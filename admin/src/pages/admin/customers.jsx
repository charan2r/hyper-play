/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Search,
  Download,
  Users,
  Edit,
  Trash2,
  Phone,
  Mail,
  ShoppingBag,
  Star,
  MessageCircle,
} from "lucide-react";

const Customers = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const customerData = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      address: "123 Main St, Colombo, Sri Lanka",
      phone_number: "0717205943",
      totalOrders: 12,
    },
    {
      id: 2,
      name: "Charan Romi",
      email: "charan5@email.com",
      address: "123 Main St, Colombo, Sri Lanka",
      phone_number: "0717205943",
      totalOrders: 10,
    },
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customerData.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
    setShowBulkActions(checked && customerData.length > 0);
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      const newSelected = [...selectedCustomers, customerId];
      setSelectedCustomers(newSelected);
      setShowBulkActions(newSelected.length > 0);
    } else {
      const newSelected = selectedCustomers.filter((id) => id !== customerId);
      setSelectedCustomers(newSelected);
      setShowBulkActions(newSelected.length > 0);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for customers:`, selectedCustomers);
    // Implement bulk actions here
    setSelectedCustomers([]);
    setShowBulkActions(false);
  };

  const handleCustomerAction = (customer, action) => {
    setSelectedCustomer(customer);
    if (action === "view") {
      setShowCustomerModal(true);
    }
    console.log(`${action} customer:`, customer);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Customers
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {customerData.length}
                    </p>
                    <p className="text-sm text-gray-500">Active Customers</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Revenue
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      Rs. 24500
                    </p>
                    <p className="text-sm text-gray-500">From all customers</p>
                  </div>
                </div>
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
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div className="bg-blue-50 border-b border-blue-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedCustomers.length} customer(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction("email")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer List */}
              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {customerData.slice(0, 5).map((customer, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={(e) =>
                              handleSelectCustomer(
                                customer.id,
                                e.target.checked
                              )
                            }
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <span>{customer.name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-green-600 hover:text-green-800">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-800">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          <span className="font-medium">Orders:</span>{" "}
                          {customer.totalOrders}
                        </p>

                        <p className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="font-medium">Phone:</span>{" "}
                          {customer.phone_number}
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
                              selectedCustomers.length ===
                                customerData.length && customerData.length > 0
                            }
                          />
                          Name
                        </th>

                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Total Orders
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Contact Number
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Address
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.map((customer, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            selectedCustomers.includes(customer.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedCustomers.includes(
                                  customer.id
                                )}
                                onChange={(e) =>
                                  handleSelectCustomer(
                                    customer.id,
                                    e.target.checked
                                  )
                                }
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {customer.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-500">
                              {customer.email}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-500">
                              {customer.totalOrders}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-500">
                              {customer.phone_number}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-500">
                              {customer.address}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Send Message"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </button>

                              <button
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                title="Edit Customer"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-red-600 hover:text-redy-800 hover:bg-red-50 rounded"
                                title="Delete Customer"
                              >
                                <Trash2 className="h-4 w-4" />
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
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      customerData.length
                    )}{" "}
                    to{" "}
                    {Math.min(currentPage * itemsPerPage, customerData.length)}{" "}
                    of {customerData.length} customers
                    {selectedCustomers.length > 0 && (
                      <span className="ml-4 text-blue-600">
                        ({selectedCustomers.length} selected)
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    {[
                      ...Array(Math.ceil(customerData.length / itemsPerPage)),
                    ].map((_, i) => {
                      const pageNumber = i + 1;
                      const totalPages = Math.ceil(
                        customerData.length / itemsPerPage
                      );

                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === pageNumber
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled={
                        currentPage ===
                        Math.ceil(customerData.length / itemsPerPage)
                      }
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
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

export default Customers;
