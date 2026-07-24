# API Documentation

## Conventions

The local API base URL is:

```text
http://localhost:5000/api/v1
```

Protected endpoints expect:

```http
Authorization: Bearer <jwt>
```

JWTs contain `id`, `email`, and `role` and expire after seven days. Roles are `customer`, `admin`, and `manufacturer`.

In production, authentication endpoints allow 5 requests per IP per 15 minutes and the general `/api` limiter allows 100 requests per IP per 15 minutes.

## API Summary

### Authentication

| Method | Path                              | Authorization | Description                          |
| ------ | --------------------------------- | ------------- | ------------------------------------ |
| `POST` | `/api/v1/auth/register`           | None          | Register a customer and return a JWT |
| `POST` | `/api/v1/auth/login`              | None          | Customer login                       |
| `POST` | `/api/v1/auth/admin/login`        | None          | Admin login                          |
| `GET`  | `/api/v1/auth/admin/profile`      | Admin         | Read authenticated admin profile     |
| `POST` | `/api/v1/auth/manufacturer/login` | None          | Manufacturer login                   |

### Products and customers

| Method   | Path                         | Authorization       | Description                          |
| -------- | ---------------------------- | ------------------- | ------------------------------------ |
| `GET`    | `/api/v1/customer/products`  | None                | List active products                 |
| `GET`    | `/api/v1/admin/products`     | None                | List all products                    |
| `GET`    | `/api/v1/admin/products/:id` | None                | Get one product                      |
| `POST`   | `/api/v1/admin/products/add` | Admin               | Create a product with optional image |
| `PUT`    | `/api/v1/admin/products/:id` | Admin               | Update a product with optional image |
| `DELETE` | `/api/v1/admin/products/:id` | Admin               | Delete a product                     |
| `GET`    | `/api/v1/customer/all`       | None (current code) | List customers                       |

### Cart and customer orders

| Method | Path                             | Authorization | Description                                 |
| ------ | -------------------------------- | ------------- | ------------------------------------------- |
| `GET`  | `/api/v1/customer/cart`          | Customer      | Read the authenticated customer's cart      |
| `POST` | `/api/v1/customer/cart`          | Customer      | Add a product to the cart                   |
| `POST` | `/api/v1/order/create`           | Any valid JWT | Create an order and Stripe Checkout Session |
| `GET`  | `/api/v1/order/orders`           | Any valid JWT | List orders for the JWT subject             |
| `GET`  | `/api/v1/order/orders/:order_id` | Any valid JWT | Read an owned order                         |

### Admin

| Method | Path                                                | Authorization       | Description                                |
| ------ | --------------------------------------------------- | ------------------- | ------------------------------------------ |
| `GET`  | `/api/v1/admin/orders`                              | None (current code) | List all orders and items                  |
| `PUT`  | `/api/v1/admin/orders/:orderId/assign-manufacturer` | None (current code) | Assign or reassign a manufacturer          |
| `PUT`  | `/api/v1/admin/orders/:orderId/status`              | None (current code) | Apply an admin-permitted status transition |
| `GET`  | `/api/v1/admin/get-manufacturers`                   | None (current code) | List active manufacturers                  |

### Manufacturer

| Method  | Path                                     | Authorization | Description                      |
| ------- | ---------------------------------------- | ------------- | -------------------------------- |
| `GET`   | `/api/v1/manufacturer/orders`            | Manufacturer  | List assigned orders             |
| `PATCH` | `/api/v1/manufacturer/orders/:id/status` | Manufacturer  | Advance an assigned order        |
| `GET`   | `/api/v1/manufacturer/orders/:id/pdf`    | Manufacturer  | Download an order production PDF |

### Payments

| Method | Path                       | Authorization    | Description                     |
| ------ | -------------------------- | ---------------- | ------------------------------- |
| `POST` | `/api/v1/payments/webhook` | Stripe signature | Process supported Stripe events |

## Authentication details

### Register customer

`POST /api/v1/auth/register`

```json
{
  "name": "Alex Perera",
  "email": "alex@example.com",
  "password": "minimum-8-characters",
  "phone_number": "0771234567",
  "address": "10 Main Street, Colombo"
}
```

Validation:

- `name`: required, 2–100 characters
- `email`: required, valid email
- `password`: required, at least 8 characters
- `phone_number`: required, exactly 10 digits
- `address`: optional, at most 500 characters

Returns `201` with a customer object and token. Duplicate email returns `400`.

### Login

Customer, admin, and manufacturer login endpoints all accept:

```json
{
  "email": "alex@example.com",
  "password": "your-password"
}
```

A successful response is:

```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "alex@example.com"
  }
}
```

Customer responses also contain `user.name`. Invalid credentials return `401`.

### Admin profile

`GET /api/v1/auth/admin/profile`

Returns the authenticated admin's `id`, `email`, `first_name`, `last_name`, `phone`, and `profile_picture`.

## Product details

Product list and detail responses expose database product fields. Active customer products are filtered case-insensitively on `status = 'active'`.

### Create product

`POST /api/v1/admin/products/add`

Content type: `multipart/form-data`.

| Field         | Required | Rules                                        |
| ------------- | -------- | -------------------------------------------- |
| `name`        | Yes      | 2–100 characters                             |
| `description` | Yes      | At most 1,000 characters                     |
| `price`       | Yes      | Positive number                              |
| `category`    | Yes      | At most 50 characters                        |
| `sport`       | Yes      | At most 50 characters                        |
| `status`      | No       | `active` or `inactive`; defaults to `active` |
| `stock`       | No       | Non-negative integer; defaults to `0`        |
| `image`       | No       | File streamed to S3 under `products/`        |

Example:

```bash
curl -X POST http://localhost:5000/api/v1/admin/products/add \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Training Jersey" \
  -F "description=Breathable team training jersey" \
  -F "price=4500" \
  -F "category=Jerseys" \
  -F "sport=Football" \
  -F "status=active" \
  -F "stock=25" \
  -F "image=@jersey.jpg"
```

Returns `201`.

### Update product

`PUT /api/v1/admin/products/:id` also accepts multipart form data. At least one validated product field must be supplied. When a new `image` is included, its S3 URL replaces the existing URL.

### Delete product

`DELETE /api/v1/admin/products/:id` returns:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Cart details

### Add to cart

`POST /api/v1/customer/cart`

```json
{
  "product_id": 42,
  "quantity": 2
}
```

Returns the inserted cart row with `201`.

### Get cart

`GET /api/v1/customer/cart`

Returns a JSON array:

```json
[
  {
    "id": 10,
    "product_id": 42,
    "quantity": 2,
    "description": "Breathable team training jersey",
    "name": "Training Jersey",
    "price": 4500,
    "image": "https://example-bucket.s3.example/products/example.jpg",
    "line_total": 9000
  }
]
```

## Checkout and orders

### Create order

`POST /api/v1/order/create`

```json
{
  "cartItems": [
    {
      "product_id": 42,
      "quantity": 2
    }
  ],
  "customerInfo": {
    "firstName": "Alex",
    "lastName": "Perera",
    "email": "alex@example.com",
    "phone": "0771234567",
    "address": "10 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka"
  }
}
```

Validation:

- `cartItems`: required non-empty array
- `product_id`: required integer
- `quantity`: required integer of at least 1
- `customerInfo.firstName`: required, 2–50 characters
- `customerInfo.lastName`: optional, 2–50 characters
- `customerInfo.email`: required email
- `phone`: optional, exactly 10 digits when supplied
- `address`: optional, at most 500 characters
- `city` and `country`: optional, at most 50 characters

Successful response:

```json
{
  "success": true,
  "data": {
    "orderId": 101,
    "sessionId": "cs_test_...",
    "redirectUrl": "https://checkout.stripe.com/...",
    "total": 9000,
    "status": "PENDING_PAYMENT"
  }
}
```

The client should redirect to `redirectUrl`.

### List customer orders

`GET /api/v1/order/orders` returns the JWT subject's orders newest first, with an `items` array on each order.

### Get one customer order

`GET /api/v1/order/orders/:order_id` returns `403` when the order exists but belongs to another customer and `404` when no order exists.

## Admin features

### Assign a manufacturer

`PUT /api/v1/admin/orders/:orderId/assign-manufacturer`

```json
{
  "manufacturer_id": 7
}
```

The operation locks capacity, rejects any prior active assignment, creates the new assignment, and transitions the order from `PAID` to `ASSIGNED` in one transaction. A manufacturer at capacity is rejected.

### Update order status

`PUT /api/v1/admin/orders/:orderId/status`

```json
{
  "status": "SHIPPED",
  "note": "Handed to courier"
}
```

Admin targets permitted by the service are `ASSIGNED`, `SHIPPED`, `DELIVERED`, and `CANCELLED`, but the current order state must also allow the requested transition. Invalid transitions return `422`.

## Manufacturer features

### List assigned orders

`GET /api/v1/manufacturer/orders` returns assignment timestamps, manufacturing status, customer/order totals, total quantity, and a `products` array.

### Update manufacturing status

`PATCH /api/v1/manufacturer/orders/:id/status`

```json
{
  "status": "IN_PRODUCTION",
  "note": "Materials issued"
}
```

Manufacturers can target only `IN_PRODUCTION` and `PACKED`, must own the assignment, and must follow the state machine.

## Stripe webhook

`POST /api/v1/payments/webhook`

The endpoint requires Stripe's `Stripe-Signature` header and unmodified raw body. Supported events:

| Event                           | Effect                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `checkout.session.completed`    | Mark payment paid, transition order to `PAID`, convert inventory reservation, auto-assign a manufacturer when capacity exists, clear cart |
| `payment_intent.payment_failed` | Mark payment failed, release inventory, cancel order                                                                                      |

Other verified Stripe events return success without domain changes.

## Order statuses

| Status            | Meaning                                        |
| ----------------- | ---------------------------------------------- |
| `PENDING_PAYMENT` | Checkout initialized and awaiting confirmation |
| `PAID`            | Stripe payment confirmed                       |
| `ASSIGNED`        | Manufacturer assigned                          |
| `IN_PRODUCTION`   | Manufacturer started work                      |
| `PACKED`          | Production complete and packed                 |
| `SHIPPED`         | Handed to delivery                             |
| `DELIVERED`       | Fulfilment complete                            |
| `CANCELLED`       | Terminal cancellation                          |
