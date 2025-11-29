/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Factory,
  ArrowUpRight,
} from "lucide-react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Total Active Agencies");

  // Dashboard data
  const overviewData = {
    totalSales: {
      value: "Rs. 2,45,000",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
    },
    traffic: {
      value: "12,458",
      change: "+8.2%",
      trend: "up",
      period: "sessions this month",
    },
    activeManufacturers: {
      value: "24",
      change: "+2",
      trend: "up",
      period: "active partners",
    },
  };

  const topProducts = [
    { name: "Cricket Jersey - Premium", orders: 145, revenue: "Rs. 72,500" },
    { name: "Football Jersey - Pro", orders: 128, revenue: "Rs. 76,800" },
    { name: "Basketball Jersey - Elite", orders: 96, revenue: "Rs. 52,800" },
    { name: "Tennis Shirt - Classic", orders: 87, revenue: "Rs. 34,800" },
    { name: "Soccer Training Kit", orders: 76, revenue: "Rs. 45,600" },
  ];

  const ordersByStatus = [
    { status: "Delivered", count: 234, color: "bg-green-500", percentage: 45 },
    { status: "Processing", count: 156, color: "bg-blue-500", percentage: 30 },
    { status: "Shipped", count: 89, color: "bg-yellow-500", percentage: 17 },
    { status: "Pending", count: 42, color: "bg-orange-500", percentage: 8 },
  ];

  const salesTrendData = [
    { day: "Mon", sales: 45000 },
    { day: "Tue", sales: 52000 },
    { day: "Wed", sales: 48000 },
    { day: "Thu", sales: 61000 },
    { day: "Fri", sales: 55000 },
    { day: "Sat", sales: 67000 },
    { day: "Sun", sales: 58000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Agencies", active: false },
    { icon: Users, label: "Users", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: HelpCircle, label: "Help", active: false },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome! Here's what's happening with your sports system.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Sales Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.totalSales.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {overviewData.totalSales.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        overviewData.totalSales.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {overviewData.totalSales.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {overviewData.totalSales.period}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Traffic Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Website Traffic
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.traffic.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {overviewData.traffic.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {overviewData.traffic.period}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Manufacturers Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active Manufacturers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.activeManufacturers.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {overviewData.activeManufacturers.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {overviewData.activeManufacturers.period}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Factory className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Trends
                </h3>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {salesTrendData.map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors cursor-pointer relative group"
                      style={{ height: `${(day.sales / 70000) * 200}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Rs. {(day.sales / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Orders by Status
                </h3>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <div className="space-y-4">
                {ordersByStatus.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${order.color} mr-3`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900 mr-4">
                        {order.count}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${order.color}`}
                          style={{ width: `${order.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {order.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Top 5 Products
              </h3>
              <span className="text-sm text-gray-500">
                By orders this month
              </span>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.orders} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {product.revenue}
                    </p>
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Revenue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
