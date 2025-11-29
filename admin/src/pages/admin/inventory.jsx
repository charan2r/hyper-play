/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Search,
  Download,
  Package,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

const Inventory = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    sport: "",
    stockLevel: "",
    manufacturer: "",
  });
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedItemForReorder, setSelectedItemForReorder] = useState(null);

  const inventoryData = [
    {
      id: 1,
      name: "Cricket Jersey",
      description: "Premium quality cricket jersey",
      price: "Rs.500",
      category: "Men",
      sport: "Cricket",
      currentStock: 25,
      minStockLevel: 10,
      maxStockLevel: 100,

      manufacturer: "SportsTech Ltd",
      status: "Active",
    },
    {
      id: 2,
      name: "Football Jersey",
      description: "Professional football jersey",
      price: "Rs.600",
      category: "Women",
      sport: "Football",
      currentStock: 8,
      minStockLevel: 10,
      maxStockLevel: 80,

      manufacturer: "Elite Sports Co",
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Basketball Jersey",
      description: "Lightweight basketball jersey",
      price: "Rs.550",
      category: "Kids",
      sport: "Basketball",
      currentStock: 45,
      minStockLevel: 15,
      maxStockLevel: 90,

      manufacturer: "Pro Athletic",
      status: "Active",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Overstocked":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(inventoryData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
    setShowBulkActions(checked && inventoryData.length > 0);
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      const newSelected = [...selectedItems, itemId];
      setSelectedItems(newSelected);
      setShowBulkActions(newSelected.length > 0);
    } else {
      const newSelected = selectedItems.filter((id) => id !== itemId);
      setSelectedItems(newSelected);
      setShowBulkActions(newSelected.length > 0);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for items:`, selectedItems);
    // Implement bulk actions here
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const handleReorder = (item) => {
    setSelectedItemForReorder(item);
    setShowReorderModal(true);
  };

  const getStockStatus = (item) => {
    if (item.currentStock <= 0) return "Out of Stock";
    if (item.currentStock <= item.reorderPoint) return "Critical";
    if (item.currentStock < item.minStockLevel) return "Low Stock";
    if (item.currentStock > item.maxStockLevel) return "Overstocked";
    return "Active";
  };

  const calculateDaysOfStock = (currentStock, avgDailySales) => {
    if (avgDailySales === 0) return "∞";
    return Math.floor(currentStock / avgDailySales);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Inventory Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Items
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {inventoryData.length}
                    </p>
                    <p className="text-sm text-gray-500">Items in inventory</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Low Stock Items
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        inventoryData.filter(
                          (item) =>
                            getStockStatus(item) === "Low Stock" ||
                            getStockStatus(item) === "Critical"
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-500">Need reordering</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Total Stock Value
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      Rs. 20000
                    </p>
                    <p className="text-sm text-gray-500">
                      Current inventory value
                    </p>
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
                        placeholder="Search by name, or manufacturer..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.stockLevel}
                      onChange={(e) =>
                        setFilters({ ...filters, stockLevel: e.target.value })
                      }
                    >
                      <option value="">All Stock Levels</option>
                      <option value="Critical">Critical</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Active">Normal</option>
                      <option value="Overstocked">Overstocked</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.supplier}
                      onChange={(e) =>
                        setFilters({ ...filters, supplier: e.target.value })
                      }
                    >
                      <option value="">All Manufacturers</option>
                      <option value="SportsTech Ltd">SportsTech Ltd</option>
                      <option value="Elite Sports Co">Elite Sports Co</option>
                      <option value="Pro Athletic">Pro Athletic</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                    >
                      <option value="">All Categories</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div className="bg-blue-50 border-b border-blue-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedItems.length} item(s) selected
                    </span>
                    <div className="flex space-x-2">
                      {/*<button
                        onClick={() => handleBulkAction("reorder")}
                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                      >
                        Bulk Reorder
                      </button>
                      <button
                        onClick={() => handleBulkAction("adjust_stock")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Adjust Stock
                      </button>*/}
                      <button
                        onClick={() => handleBulkAction("export")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Export Inventory
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {inventoryData.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) =>
                              handleSelectItem(item.id, e.target.checked)
                            }
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <span className="ml-2">{item.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            getStockStatus(item)
                          )}`}
                        >
                          {getStockStatus(item)}
                        </span>
                        <span className="text-sm font-medium">
                          Stock: {item.currentStock}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Manufacturer:</span>{" "}
                          {item.manufacturer}
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
                              selectedItems.length === inventoryData.length &&
                              inventoryData.length > 0
                            }
                          />
                          Item
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Current Stock
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Stock Levels
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Manufacturer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.map((item, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            selectedItems.includes(item.id) ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) =>
                                  handleSelectItem(item.id, e.target.checked)
                                }
                              />
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  <span className="ml-2">{item.name}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span
                                className={`font-bold text-lg ${
                                  item.currentStock <= item.reorderPoint
                                    ? "text-red-600"
                                    : item.currentStock < item.minStockLevel
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {item.currentStock}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm space-y-1">
                              <div>Min: {item.minStockLevel}</div>
                              <div>Max: {item.maxStockLevel}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div className="font-medium">
                                {item.manufacturer}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                getStockStatus(item)
                              )}`}
                            >
                              {getStockStatus(item)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing 1 to {inventoryData.length} of{" "}
                    {inventoryData.length} items
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

export default Inventory;
