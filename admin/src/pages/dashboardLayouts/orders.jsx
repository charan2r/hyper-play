/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  UserCheck,
} from "lucide-react";

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    dateRange: "",
  });
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [orders, setOrders] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] =
    useState(null);

  useEffect(() => {
    fetchOrders();
    fetchManufacturers();
  }, []);

  // get all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/orders");
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  //get all manufacturers
  const fetchManufacturers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/get-manufacturers"
      );
      const data = await response.json();

      if (data.success) {
        setManufacturers(data.manufacturers);
      }
    } catch (err) {
      console.error("Error fetching manufacturers:", err);
    }
  };

  // assign manufacturer to order
  const assignManufacturer = async (orderId, manufacturerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/assign-manufacturer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ manufacturer_id: manufacturerId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchOrders();
        setShowAssignModal(false);
        alert(data.message);
      } else {
        alert(data.error || "Failed to assign manufacturer");
      }
    } catch (err) {
      console.error("Error assigning manufacturer:", err);
      alert("Failed to assign manufacturer");
    }
  };

  // Filter orders based on current filters
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPayment =
      !filters.paymentStatus || order.payment_status === filters.paymentStatus;
    const matchesDate =
      !filters.dateRange || order.order_date.includes(filters.dateRange);

    return matchesStatus && matchesPayment && matchesDate;
  });

  // Use filtered orders for display
  const orderData = filteredOrders;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orderData.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
    setShowBulkActions(checked && orderData.length > 0);
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
    console.log(`Bulk ${action} for orders:`, selectedOrders);
    // Implement bulk actions here
    setSelectedOrders([]);
    setShowBulkActions(false);
  };

  const handleAssignManufacturer = (order) => {
    setSelectedOrderForAssignment(order);
    setShowAssignModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "processing":
        return <Package className="h-4 w-4 text-yellow-600" />;
      case "confirmed":
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Order Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {orderData.length}
                </p>
                <p className="text-sm text-gray-500">All time orders</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Pending Orders
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    orderData.filter(
                      (order) =>
                        order.status === "confirmed" ||
                        order.status === "processing"
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Need attention</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Delivered Orders
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {
                    orderData.filter((order) => order.status === "delivered")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-500">Successfully completed</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  Rs.
                  {orderData
                    .filter((order) => order.payment_status === "Paid")
                    .reduce(
                      (sum, order) => sum + parseFloat(order.total_amount || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">From completed orders</p>
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
                        placeholder="Search orders by ID, customer name, or email..."
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
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.paymentStatus}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          paymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">Payment Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>

                    <input
                      type="date"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.dateRange}
                      onChange={(e) =>
                        setFilters({ ...filters, dateRange: e.target.value })
                      }
                    />
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
                        onClick={() => handleBulkAction("ship")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => handleBulkAction("deliver")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleBulkAction("cancel")}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel Orders
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order List Header */}
              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {orderData.slice(0, 5).map((order, index) => (
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
                              <span className="ml-2">#{order.id}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer_name}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-600 hover:text-gray-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Amount:</span> ₹
                          {parseFloat(order.total_amount || 0).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Payment:</span>{" "}
                          <span
                            className={`px-1 py-0.5 text-xs rounded ${getPaymentStatusColor(
                              order.payment_status
                            )}`}
                          >
                            {order.payment_status}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {order.order_date}
                        </p>
                        <p>
                          <span className="font-medium">Manufacturer:</span>{" "}
                          {order.manufacturer_name || (
                            <button
                              onClick={() => handleAssignManufacturer(order)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Assign
                            </button>
                          )}
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
                              selectedOrders.length === orderData.length &&
                              orderData.length > 0
                            }
                          />
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Products
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Assigned Manufacturer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Payment
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.map((order, index) => (
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
                                  {getStatusIcon(order.status)}
                                  <span className="ml-2">#{order.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.customer_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customer_email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {order.customer_phone}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.items &&
                                order.items.map((product, idx) => (
                                  <div key={idx} className="mb-1">
                                    <span className="font-medium">
                                      {product.product_name}
                                    </span>
                                    <span className="text-gray-500">
                                      {" "}
                                      x{product.quantity}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900">
                              Rs.
                              {parseFloat(
                                order.total_amount || 0
                              ).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {order.manufacturer_name ? (
                                <span className="font-medium text-gray-900">
                                  {order.manufacturer_name}
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleAssignManufacturer(order)
                                  }
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Assign
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                                order.payment_status
                              )}`}
                            >
                              {order.payment_status}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                title="Edit Order"
                              >
                                <Edit className="h-4 w-4" />
                              </button>

                              <button
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Cancel Order"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
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
                    Showing 1 to {orderData.length} of {orderData.length} orders
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

      {/* Manufacturer Assignment Modal */}
      {showAssignModal && selectedOrderForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Assign Manufacturer to Order #{selectedOrderForAssignment.id}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Customer: {selectedOrderForAssignment.customer_name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Total Amount: Rs.
                {parseFloat(
                  selectedOrderForAssignment.total_amount || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Manufacturer:
              </label>
              <select
                id="manufacturerSelect"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">Choose a manufacturer...</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const select = document.getElementById("manufacturerSelect");
                  const manufacturerId = select.value;
                  if (manufacturerId) {
                    assignManufacturer(
                      selectedOrderForAssignment.id,
                      manufacturerId
                    );
                  } else {
                    alert("Please select a manufacturer");
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
