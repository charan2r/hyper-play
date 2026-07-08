/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import API_URL from "../../config/api";
import {
  Search,
  Download,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText,
} from "lucide-react";

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dateRange: "",
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/manufacturer/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("manufacturerToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const orders = await response.json();

        const newOrders = orders.data.map((order) => ({
          id: order.order_id,
          orderId: order.order_id,
          customerId: order.customer_id,
          totalAmount: order.total_amount,
          orderDate: order.order_date,
          paymentStatus: order.payment_status,
          products: Array.isArray(order.products) ? order.products : [],
          totalQuantity: order.total_quantity,
          status: order.status,
          manufacturerId: order.manufacturer_id,
          manufacturerName: order.manufacturer_name,
          manufacturerEmail: order.manufacturer_email,
        }));
        setOrders(newOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadAssets = async (orderId) => {
    try {
      const response = await fetch(
        `${API_URL}/manufacturer/orders/${orderId}/pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("manufacturerToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      // Get the blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  // Helper functions for production status styling
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_production":
        return "bg-yellow-100 text-yellow-800";
      case "production_completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "assigned":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "in_production":
        return <Package className="h-4 w-4 text-yellow-600" />;
      case "production_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return "text-red-600 font-bold"; // Overdue
    if (days <= 3) return "text-red-500 font-semibold"; // Urgent
    if (days <= 7) return "text-yellow-600 font-medium"; // Soon
    return "text-gray-600"; // Normal
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
    setShowBulkActions(checked && orders.length > 0);
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      const newSelected = [...selectedOrders, orderId];
      setSelectedOrders(newSelected);
      setShowBulkActions(newSelected.length > 0);
    } else {
      const newSelected = selectedOrders.filter((id) => id !== orderId);
      setSelectedOrders(newSelected);
      setShowBulkActions(newSelected.length > 0);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for production orders:`, selectedOrders);
    // Implement bulk actions here
    setSelectedOrders([]);
    setShowBulkActions(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("manufacturerToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update orders in state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order,
          ),
        );
        alert(data.message || "Status updated successfully");
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Production Orders
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
                <p className="text-sm text-gray-500">Assigned to you</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  In Production
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    orders.filter(
                      (order) =>
                        order.status === "assigned" ||
                        order.status === "in_production",
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Currently active</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Ready to Ship
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((order) => order.status === "shipped").length}
                </p>
                <p className="text-sm text-gray-500">Completed orders</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Amount
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  Rs.{" "}
                  {orders
                    .reduce((sum, order) => sum + order.totalAmount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">All orders value</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Product, or Customer..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <option value="">All Status</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_production">In Production</option>
                      <option value="production_completed">
                        Production Completed
                      </option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.priority}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="">All </option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div className="bg-blue-50 border-b border-blue-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedOrders.length} order(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction("start-production")}
                        className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Start Production
                      </button>

                      <button
                        onClick={() => handleBulkAction("ready-to-ship")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark Ready
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order List Content */}
              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {orders.slice(0, 5).map((order, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) =>
                              handleSelectOrder(order.id, e.target.checked)
                            }
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              {getStatusIcon(order.status)}
                              <span className="ml-2">#{order.orderId}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Customer ID: {order.customerId}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleDownloadAssets(order.orderId)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Quantity:</span>{" "}
                          {order.totalQuantity}
                        </p>
                        <p>
                          <span className="font-medium">Amount:</span> Rs.
                          {order.totalAmount}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Product:</span>{" "}
                          {order.products[0]?.product_name || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            checked={
                              selectedOrders.length === orders.length &&
                              orders.length > 0
                            }
                          />
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Product(s)
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Quantity
                        </th>

                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Order Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            selectedOrders.includes(order.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedOrders.includes(order.id)}
                                onChange={(e) =>
                                  handleSelectOrder(order.id, e.target.checked)
                                }
                              />
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  <span className="ml-2">{order.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.products.map((product, idx) => (
                                <div key={idx}>
                                  <div className="font-medium text-gray-900">
                                    {product.product_name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 text-base">
                              {order.totalQuantity}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.orderId,
                                  e.target.value,
                                )
                              }
                              className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              <option value="assigned">Assigned</option>
                              <option value="in_production">
                                In Production
                              </option>
                              <option value="production_completed">
                                Completed
                              </option>
                              <option value="production_completed">
                                Rejected
                              </option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 text-base">
                              Rs. {order.totalAmount}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing 1 to {orders.length} of {orders.length} production
                    orders
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
