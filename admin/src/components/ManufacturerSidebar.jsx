import { ListOrdered, X, House, LogOut } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  activeItem = "Dashboard",
  onItemClick = () => {},
  onLogout = () => {},
}) => {
  const sidebarItems = [
    { icon: House, label: "Dashboard", path: "/dashboard" },
    { icon: ListOrdered, label: "Orders", path: "/orders" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-300 border-r border-gray-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-300">
          <div className="inline-flex items-center justify-center w-25 h-30 mb-5 ml-15 mt-5">
            <img
              className="max-w-full h-auto mt-5"
              src="/logo.png"
              alt="Logo"
            />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden hover:bg-gray-200 p-2 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 flex-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <button
                key={index}
                onClick={() => onItemClick(item)}
                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-blue-50 hover:pl-8 ${
                  isActive
                    ? "bg-blue-600 text-white border-r-4 border-blue-500 shadow-lg"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="border-t border-gray-300 p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
