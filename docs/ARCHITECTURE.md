# Architecture

This document describes the architecture implemented in the repository. It distinguishes current behavior from intended role semantics where they differ.

## System context

```mermaid
flowchart TB
    subgraph Clients
        CUSTOMER[Customer]
        ADMIN[Administrator]
        MANUFACTURER[Manufacturer]
    end

    subgraph Web applications
        STOREFRONT[Customer SPA<br/>frontend/]
        OPERATIONS[Admin + manufacturer SPA<br/>admin/]
    end

    subgraph Backend
        API[Express 5 API<br/>backend/]
        STATE[Order state machine]
        PDF[PDFKit generator]
    end

    DB[(PostgreSQL)]
    S3[(Amazon S3)]
    STRIPE[Stripe Checkout]

    CUSTOMER --> STOREFRONT
    ADMIN --> OPERATIONS
    MANUFACTURER --> OPERATIONS
    STOREFRONT -->|JSON / Bearer JWT| API
    OPERATIONS -->|JSON, multipart, Bearer JWT| API
    API --> STATE
    API --> PDF
    API --> DB
    API -->|Product images| S3
    API -->|Create Checkout Session| STRIPE
    STRIPE -->|Signed events| API
```

The customer application and operations application are independent Vite builds. In container deployments Nginx serves each SPA and can proxy `/api/` to the backend service. In local development they call the URL embedded in `VITE_API_URL`.

## Backend layers

```mermaid
flowchart LR
    R[Express routes] --> M[Middleware]
    M --> C[Controllers]
    C --> S[Services]
    S --> P[Repositories]
    P --> D[(PostgreSQL)]

    M -.->|JWT claims| C
    M -.->|Sanitized body| C
    S -.->|Business rules| C
```

| Layer        | Location               | Responsibility                                                                |
| ------------ | ---------------------- | ----------------------------------------------------------------------------- |
| Routes       | `backend/routes`       | HTTP methods, paths, and middleware composition                               |
| Middleware   | `backend/middleware`   | JWT verification, role checks, Joi validation, rate limiting, error responses |
| Controllers  | `backend/controllers`  | HTTP input extraction and response status/envelopes                           |
| Services     | `backend/services`     | Authentication, checkout, fulfilment, state transitions, Stripe events        |
| Repositories | `backend/repositories` | Parameterized SQL and transaction boundaries                                  |
| Utilities    | `backend/utils`        | S3-backed Multer storage and order PDF generation                             |

Authentication tokens contain `id`, `email`, and `role` claims and expire after seven days. Authorization is applied per route through `verifyToken` and `requireRole`.

## Checkout and fulfilment flow

```mermaid
sequenceDiagram
    actor Customer
    participant SPA as Customer SPA
    participant API as Express API
    participant DB as PostgreSQL
    participant Stripe
    participant Ops as Admin/Manufacturer

    Customer->>SPA: Submit checkout
    SPA->>API: POST /order/create
    API->>DB: Create order and reserve inventory
    API->>DB: Add items, total, pending payment
    API->>Stripe: Create Checkout Session (LKR)
    Stripe-->>API: Session URL
    API-->>SPA: redirectUrl
    SPA->>Stripe: Redirect customer
    Stripe->>API: checkout.session.completed webhook
    API->>DB: Mark payment/order paid
    API->>DB: Convert reservation and decrement stock
    API->>DB: Auto-assign available manufacturer
    API->>DB: Clear customer cart
    Ops->>API: Advance production and delivery status
    API->>DB: Persist transition and history
```

On order creation failure, the service attempts to release inventory and cancel the order. On a failed Stripe payment, the webhook marks payment as failed, releases inventory, and cancels the order.

## Order state machine

```mermaid
stateDiagram-v2
    [*] --> PENDING_PAYMENT: checkout created
    PENDING_PAYMENT --> PAID: Stripe success
    PENDING_PAYMENT --> CANCELLED: payment failure
    PAID --> ASSIGNED: admin / auto-assignment
    PAID --> CANCELLED: admin
    ASSIGNED --> IN_PRODUCTION: manufacturer
    ASSIGNED --> CANCELLED: admin
    IN_PRODUCTION --> PACKED: manufacturer
    IN_PRODUCTION --> CANCELLED: admin
    PACKED --> SHIPPED: admin
    PACKED --> CANCELLED: admin
    SHIPPED --> DELIVERED: admin
    DELIVERED --> [*]
    CANCELLED --> [*]
```

Assignment status is synchronized as follows:

| Order status    | Manufacturing status                        |
| --------------- | ------------------------------------------- |
| `ASSIGNED`      | `ASSIGNED`                                  |
| `IN_PRODUCTION` | `IN_PRODUCTION`                             |
| `PACKED`        | `COMPLETED`                                 |
| `CANCELLED`     | `REJECTED` when an active assignment exists |

## Logical data model

The repository does not include schema migrations. This diagram is the logical model inferred from the SQL queries and should be kept in sync when migrations are introduced.

```mermaid
erDiagram
    CUSTOMER ||--o{ CARTITEM : owns
    PRODUCT ||--o{ CARTITEM : contains
    CUSTOMER ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCT ||--o{ ORDER_ITEMS : references
    ORDERS ||--o{ PAYMENTS : has
    ORDERS ||--o{ INVENTORY_RESERVATIONS : reserves
    PRODUCT ||--o{ INVENTORY_RESERVATIONS : reserved
    ORDERS ||--o{ ORDER_STATUS_HISTORY : records
    ORDERS ||--o{ MANUFACTURING_ASSIGNMENTS : assigned
    MANUFACTURER ||--o{ MANUFACTURING_ASSIGNMENTS : receives
    MANUFACTURER ||--o| MANUFACTURER_CAPACITY : limits

    CUSTOMER {
        int id PK
        string email
        string password
    }
    PRODUCT {
        int id PK
        decimal price
        int stock
        string status
        string image
    }
    ORDERS {
        int id PK
        int customer_id FK
        decimal total_amount
        string status
        string payment_status
    }
    MANUFACTURING_ASSIGNMENTS {
        int order_id FK
        int manufacturer_id FK
        string manufacturing_status
    }
```

Other queried entities include `admin` and `manufacturer` identity tables. The code also contains disabled design endpoints that reference a `design` table; they are not part of the active API.
