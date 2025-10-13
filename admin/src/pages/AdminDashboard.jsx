import { useState } from "react";
import Settings from "../pages/dashboardLayouts/setting";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import Customers from "./dashboardLayouts/customers";
import AnalyticsDashboard from "./dashboardLayouts/analytics";
import Products from "./dashboardLayouts/products";
import Orders from "./dashboardLayouts/orders";
import Inventory from "./dashboardLayouts/inventory";
import Dashboard from "./dashboardLayouts/dashboard";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const handleSidebarItemClick = (item) => {
    setActivePage(item.label);
    setIsSidebarOpen(false);
    console.log("Navigation to:", item.path);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPageContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Products":
        return <Products />;

      case "Orders":
        return <Orders />;

      case "Customers":
        return <Customers />;

      case "Settings":
        return <Settings />;

      default:
        return (
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Dashboard
              </h1>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-gray-600">Welcome to the Dashboard!</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem={activePage}
        onItemClick={handleSidebarItemClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {activePage}
            </h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Page Content */}
        {renderPageContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
