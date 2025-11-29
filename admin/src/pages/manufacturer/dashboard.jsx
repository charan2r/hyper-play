/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  ClipboardList,
  Package,
  CheckCircle,
  Download,
  TrendingUp,
  Factory,
  Calendar,
  Clock,
  Target,
} from "lucide-react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manufacturer-dashboard");

  // Manufacturer Dashboard data
  const manufacturerData = {
    assignedOrders: {
      count: 47,
      change: "+5",
      trend: "up",
      period: "new this week",
      priority: 8, // urgent orders
    },
    inProduction: {
      count: 23,
      change: "+3",
      trend: "up",
      period: "currently active",
      estimatedCompletion: "2-5 days",
    },
    completedOrders: {
      count: 156,
      change: "+12",
      trend: "up",
      period: "this month",
      onTimeRate: "94%",
    },
    assetsToDownload: {
      count: 15,
      change: "+7",
      trend: "up",
      period: "pending downloads",
      types: ["designs", "specifications", "templates"],
    },
  };

  const productionTrendData = [
    { period: "Week 1", produced: 28, delivered: 25 },
    { period: "Week 2", produced: 32, delivered: 30 },
    { period: "Week 3", produced: 29, delivered: 28 },
    { period: "Week 4", produced: 35, delivered: 32 },
    { period: "Week 5", produced: 31, delivered: 29 },
    { period: "Week 6", produced: 38, delivered: 36 },
    { period: "This Week", produced: 23, delivered: 20 },
  ];

  const recentOrders = [
    {
      id: "ORD-2024-156",
      product: "Cricket Jersey - Team Alpha",
      quantity: 25,
      status: "In Production",
      priority: "High",
      dueDate: "2024-07-25",
    },
    {
      id: "ORD-2024-157",
      product: "Football Kit - Blue Lions",
      quantity: 30,
      status: "Design Review",
      priority: "Medium",
      dueDate: "2024-07-28",
    },
    {
      id: "ORD-2024-158",
      product: "Basketball Jersey - Red Hawks",
      quantity: 15,
      status: "Material Sourcing",
      priority: "High",
      dueDate: "2024-07-24",
    },
    {
      id: "ORD-2024-159",
      product: "Tennis Polo - White Classic",
      quantity: 40,
      status: "Quality Check",
      priority: "Low",
      dueDate: "2024-07-30",
    },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case "In Production":
        return "bg-blue-100 text-blue-800";
      case "Design Review":
        return "bg-purple-100 text-purple-800";
      case "Material Sourcing":
        return "bg-orange-100 text-orange-800";
      case "Quality Check":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Track your production progress and manage assigned orders
              efficiently.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Assigned Orders Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Assigned Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {manufacturerData.assignedOrders.count}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm font-medium text-blue-600">
                      {manufacturerData.assignedOrders.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {manufacturerData.assignedOrders.period}
                    </span>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    {manufacturerData.assignedOrders.priority} urgent orders
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* In Production Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    In Production
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {manufacturerData.inProduction.count}
                  </p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm font-medium text-orange-600">
                      {manufacturerData.inProduction.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {manufacturerData.inProduction.period}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    ETA: {manufacturerData.inProduction.estimatedCompletion}
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Completed Orders Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Orders Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {manufacturerData.completedOrders.count}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {manufacturerData.completedOrders.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {manufacturerData.completedOrders.period}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {manufacturerData.completedOrders.onTimeRate} on-time
                    delivery
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Assets to Download Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Assets to Download
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {manufacturerData.assetsToDownload.count}
                  </p>
                  <div className="flex items-center mt-2">
                    <Download className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-sm font-medium text-purple-600">
                      {manufacturerData.assetsToDownload.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {manufacturerData.assetsToDownload.period}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Production Trends & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Production Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Production Trends
                </h3>
                <span className="text-sm text-gray-500">Last 7 weeks</span>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {productionTrendData.map((week, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="w-full space-y-1 flex flex-col items-center">
                      {/* Produced Bar */}
                      <div
                        className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors cursor-pointer relative group"
                        style={{
                          height: `${(week.produced / 40) * 120}px`,
                          minHeight: "10px",
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Produced: {week.produced}
                        </div>
                      </div>
                      {/* Delivered Bar */}
                      <div
                        className="w-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer relative group"
                        style={{
                          height: `${(week.delivered / 40) * 120}px`,
                          minHeight: "8px",
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Delivered: {week.delivered}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2 text-center">
                      {week.period}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>Produced</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <span className="text-sm text-gray-500">Most used</span>
              </div>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Download Assets
                      </p>
                      <p className="text-sm text-gray-600">
                        Get design files & specs
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {manufacturerData.assetsToDownload.count}
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Mark Order Complete
                      </p>
                      <p className="text-sm text-gray-600">
                        Update production status
                      </p>
                    </div>
                  </div>
                  <Target className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                  <div className="flex items-center">
                    <Factory className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Production Schedule
                      </p>
                      <p className="text-sm text-gray-600">
                        View & manage timeline
                      </p>
                    </div>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Quality Reports
                      </p>
                      <p className="text-sm text-gray-600">
                        Submit QC feedback
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    New
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h3>
              <span className="text-sm text-gray-500">
                Last 4 assigned orders
              </span>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold mr-4">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {order.product}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>Qty: {order.quantity}</span>
                        <span>Due: {order.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Update Status"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                This Month's Performance
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {manufacturerData.completedOrders.onTimeRate}
                  </p>
                  <p className="text-sm text-gray-600">On-time Delivery</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {manufacturerData.completedOrders.count}
                  </p>
                  <p className="text-sm text-gray-600">Orders Completed</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {manufacturerData.inProduction.count}
                  </p>
                  <p className="text-sm text-gray-600">
                    Currently in Production
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
