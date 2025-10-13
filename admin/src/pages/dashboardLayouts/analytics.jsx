/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Download,
  Home,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  ShoppingBag,
  Package,
  Truck,
  Star,
} from "lucide-react";

const AnalyticsDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState("7d");
  const [selectedMetrics, setSelectedMetrics] = useState({
    sales: true,
    products: true,
    orders: true,
    manufacturers: true,
    customers: true,
  });
  const [viewMode, setViewMode] = useState("dashboard"); // dashboard, sales, products, orders, manufacturers, customers

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Customers", active: false },
    { icon: Package, label: "Products", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: HelpCircle, label: "Help", active: false },
  ];

  const timeRanges = [
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
    { label: "1Y", value: "1y" },
  ];

  // Sample data for sports system analytics
  const salesTrendsData = [
    {
      name: "Jan",
      revenue: 145000,
      jerseys: 1250,
      accessories: 850,
      growth: 12.5,
    },
    {
      name: "Feb",
      revenue: 168000,
      jerseys: 1450,
      accessories: 920,
      growth: 15.8,
    },
    {
      name: "Mar",
      revenue: 192000,
      jerseys: 1680,
      accessories: 1100,
      growth: 14.3,
    },
    {
      name: "Apr",
      revenue: 178000,
      jerseys: 1520,
      accessories: 980,
      growth: -7.3,
    },
  ];

  const productPerformanceData = [
    {
      name: "Custom Football Jerseys",
      sales: 2450,
      revenue: 147000,
      profit: 58800,
      trend: "up",
      category: "Jerseys",
      rating: 4.8,
      returns: 2.1,
    },
    {
      name: "Basketball Uniforms",
      sales: 1890,
      revenue: 113400,
      profit: 45360,
      trend: "up",
      category: "Jerseys",
      rating: 4.6,
      returns: 1.8,
    },
    {
      name: "Soccer Training Kits",
      sales: 1650,
      revenue: 82500,
      profit: 28875,
      trend: "down",
      category: "Training",
      rating: 4.4,
      returns: 3.2,
    },
    {
      name: "Baseball Caps",
      sales: 3250,
      revenue: 65000,
      profit: 26000,
      trend: "up",
      category: "Accessories",
      rating: 4.7,
      returns: 1.5,
    },
  ];

  const orderVolumeData = [
    {
      name: "Week 1",
      orders: 245,
      completed: 238,
      pending: 7,
      cancelled: 3,
      avgProcessing: 2.1,
    },
    {
      name: "Week 2",
      orders: 289,
      completed: 275,
      pending: 14,
      cancelled: 5,
      avgProcessing: 2.3,
    },
    {
      name: "Week 3",
      orders: 324,
      completed: 310,
      pending: 12,
      cancelled: 2,
      avgProcessing: 1.9,
    },
    {
      name: "Week 4",
      orders: 298,
      completed: 285,
      pending: 13,
      cancelled: 4,
      avgProcessing: 2.2,
    },
  ];

  const manufacturerPerformanceData = [
    {
      name: "SportsCraft Pro",
      completedOrders: 1250,
      totalOrders: 1280,
      avgDeliveryTime: 5.2,
      delayedOrders: 30,
      qualityRating: 4.8,
      onTimeRate: 97.6,
      status: "excellent",
    },
    {
      name: "Elite Jersey Works",
      completedOrders: 980,
      totalOrders: 1020,
      avgDeliveryTime: 6.8,
      delayedOrders: 40,
      qualityRating: 4.5,
      onTimeRate: 94.1,
      status: "good",
    },
    {
      name: "Custom Athletic Gear",
      completedOrders: 750,
      totalOrders: 850,
      avgDeliveryTime: 8.5,
      delayedOrders: 100,
      qualityRating: 4.2,
      onTimeRate: 88.2,
      status: "needs_improvement",
    },
  ];

  const customerGrowthData = [
    {
      name: "Jan",
      newCustomers: 145,
      totalCustomers: 2450,
      retention: 94.2,
      churn: 5.8,
    },
    {
      name: "Feb",
      newCustomers: 189,
      totalCustomers: 2639,
      retention: 95.1,
      churn: 4.9,
    },
    {
      name: "Mar",
      newCustomers: 234,
      totalCustomers: 2873,
      retention: 93.8,
      churn: 6.2,
    },
    {
      name: "Apr",
      newCustomers: 198,
      totalCustomers: 3071,
      retention: 96.2,
      churn: 3.8,
    },
  ];

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "needs_improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sports Analytics Dashboard
                </h1>
              </div>

              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {/* Metric Selection Toggle */}
                <div className="flex items-center space-x-2 bg-white border rounded-lg p-1">
                  <button
                    onClick={() => toggleMetric("sales")}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedMetrics.sales
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Sales
                  </button>
                  <button
                    onClick={() => toggleMetric("products")}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedMetrics.products
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => toggleMetric("orders")}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedMetrics.orders
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => toggleMetric("manufacturers")}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedMetrics.manufacturers
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Manufacturers
                  </button>
                  <button
                    onClick={() => toggleMetric("customers")}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedMetrics.customers
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Customers
                  </button>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center space-x-1 bg-white border rounded-lg p-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setActiveTimeRange(range.value)}
                      className={`px-3 py-1 text-sm rounded ${
                        activeTimeRange === range.value
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        Rs. 146,000
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600">
                        Total Orders
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">1,824</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600">
                        Active Customers
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">3,561</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Trends Section */}
            {selectedMetrics.sales && (
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales Trends
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      Revenue
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      Jerseys
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                      Accessories
                    </div>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between space-x-2 px-4">
                  {salesTrendsData.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="w-full bg-teal-400 rounded-t-md hover:bg-teal-500 transition-colors cursor-pointer relative group"
                        style={{ height: `${(item.revenue / 250000) * 200}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Performance & Order Volume Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Product Performance */}
              {selectedMetrics.products && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top Product Performance
                    </h3>
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {productPerformanceData
                      .slice(0, 5)
                      .map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {product.sales} units •{" "}
                                {formatCurrency(product.revenue)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-600">
                                {product.rating}
                              </span>
                            </div>
                            <div
                              className={`flex items-center ${
                                product.trend === "up"
                                  ? "text-green-600"
                                  : product.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {product.trend === "up" ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : product.trend === "down" ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : (
                                <Activity className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Order Volume Over Time */}
              {selectedMetrics.orders && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order Volume Trends
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                        Completed
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                        Pending
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                        Cancelled
                      </div>
                    </div>
                  </div>
                  <div className="h-48 flex items-end justify-between space-x-3 px-4">
                    {orderVolumeData.map((week, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div className="w-full flex flex-col space-y-1">
                          <div
                            className="w-full bg-green-600 hover:bg-green-700 transition-colors cursor-pointer relative group"
                            style={{
                              height: `${(week.completed / 400) * 160}px`,
                            }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Completed: {week.completed}
                            </div>
                          </div>
                          <div
                            className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors cursor-pointer relative group"
                            style={{
                              height: `${(week.pending / 400) * 160}px`,
                            }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Pending: {week.pending}
                            </div>
                          </div>
                          <div
                            className="w-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer relative group"
                            style={{
                              height: `${(week.cancelled / 400) * 160}px`,
                            }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Cancelled: {week.cancelled}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          {week.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manufacturer Performance */}
            {selectedMetrics.manufacturers && (
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Manufacturer Performance
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Track delivery performance and quality metrics
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {manufacturerPerformanceData.map((manufacturer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <Truck className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {manufacturer.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>
                                {manufacturer.completedOrders}/
                                {manufacturer.totalOrders} orders
                              </span>
                              <span>
                                Avg: {manufacturer.avgDeliveryTime} days
                              </span>
                              <span className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                {manufacturer.qualityRating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPercentage(manufacturer.onTimeRate)}{" "}
                              On-Time
                            </div>
                            <div className="text-xs text-gray-600">
                              {manufacturer.delayedOrders} delayed
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                              manufacturer.status
                            )}`}
                          >
                            {manufacturer.status
                              .replace("_", " ")
                              .charAt(0)
                              .toUpperCase() +
                              manufacturer.status.replace("_", " ").slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Growth */}
            {selectedMetrics.customers && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Growth & Retention
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      New Customers
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      Retention Rate
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Growth Chart */}
                  <div className="h-48 flex items-end justify-between space-x-2">
                    {customerGrowthData.map((month, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-colors cursor-pointer relative group"
                          style={{
                            height: `${(month.newCustomers / 300) * 160}px`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            +{month.newCustomers} customers
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          {month.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Retention Metrics */}
                  <div className="space-y-4">
                    {customerGrowthData.slice(-3).map((month, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {month.name} 2024
                          </h4>
                          <p className="text-sm text-gray-600">
                            {month.totalCustomers.toLocaleString()} total
                            customers
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {formatPercentage(month.retention)} retained
                          </div>
                          <div className="text-xs text-red-600">
                            {formatPercentage(month.churn)} churn
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
