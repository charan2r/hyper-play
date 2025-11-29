/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Home,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Edit,
  Trash2,
} from "lucide-react";
import AddProduct from "../../components/AddProduct";

const Products = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Total Active Users");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    sport: "",
    status: "",
    priceRange: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [productData, setProductData] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(productData.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
    setShowBulkActions(checked && productData.length > 0);
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      const newSelected = [...selectedProducts, productId];
      setSelectedProducts(newSelected);
      setShowBulkActions(newSelected.length > 0);
    } else {
      const newSelected = selectedProducts.filter((id) => id !== productId);
      setSelectedProducts(newSelected);
      setShowBulkActions(newSelected.length > 0);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for products:`, selectedProducts);

    setSelectedProducts([]);
    setShowBulkActions(false);
  };

  const handleStatusChange = (productId, newStatus) => {
    console.log(`Changing product ${productId} status to ${newStatus}`);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProductData(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Product Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Products
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {productData.length}
                </p>
                <p className="text-sm text-gray-500">
                  All products in inventory
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Active Products
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {productData.filter((p) => p.status === "Active").length}
                </p>
                <p className="text-sm text-gray-500">Currently available</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Low Stock Items
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {productData.filter((p) => p.stock < 10).length}
                </p>
                <p className="text-sm text-gray-500">Need restocking</p>
              </div>

              {/*<div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  Rs.
                  {productData
                    .reduce(
                      (sum, p) =>
                        sum + parseInt(p.price.replace("Rs.", "")) * p.sold,
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">From all products</p>
              </div>*/}
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
                        placeholder="Search products by name, description..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                    >
                      <option value="">All Types</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.sport}
                      onChange={(e) =>
                        setFilters({ ...filters, sport: e.target.value })
                      }
                    >
                      <option value="">All Sports</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                    </select>

                    <select
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>

                    <button
                      className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => {
                        setShowAddModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </button>
                    {showAddModal && (
                      <AddProduct
                        onClose={() => setShowAddModal(false)}
                        onSave={(newProduct) => {
                          setProductData((prev) => [newProduct, ...prev]);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div className="bg-blue-50 border-b border-blue-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedProducts.length} product(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction("activate")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkAction("deactivate")}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleBulkAction("delete")}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4">
                {/* Mobile Cards View */}
                <div className="lg:hidden space-y-4">
                  {productData.slice(0, 5).map((product, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p>
                          <span className="font-medium">Category:</span>{" "}
                          {product.category}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Sport:</span>{" "}
                          {product.sport}
                        </p>
                        <p>
                          <span className="font-medium">Price:</span>{" "}
                          {product.price}
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
                              selectedProducts.length === productData.length &&
                              productData.length > 0
                            }
                          />
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Sport
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Stock
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Image
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((product, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            selectedProducts.includes(product.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedProducts.includes(product.id)}
                                onChange={(e) =>
                                  handleSelectProduct(
                                    product.id,
                                    e.target.checked
                                  )
                                }
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {product.description}
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-medium">
                            Rs.{Number(product.price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {product.category}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {product.sport}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-medium ${
                                product.stock < 10
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {product.stock}
                            </span>
                            <div className="text-xs text-gray-500">
                              Sold: {product.sold}
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <select
                              value={product.status}
                              onChange={(e) =>
                                handleStatusChange(product.id, e.target.value)
                              }
                              className={` py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                product.status
                              )}`}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Out of Stock">Out of Stock</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {product.image ? (
                              <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded-md border"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No Image
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete Product"
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
                    Showing 1 to 10 of 20 results
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
                      2
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      3
                    </button>
                    <span className="px-2 text-gray-500">...</span>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      20
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

export default Products;
