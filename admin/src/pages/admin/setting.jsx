/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Save, Camera } from "lucide-react";

const SettingsPage = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  const [admin, setAdmin] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    profile_picture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get admin data from localStorage first
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const userData = JSON.parse(adminUser);
      setAdmin(userData);
    }

    // Fetch full admin profile from API
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          "http://localhost:5000/api/admin/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (data.success) {
          setAdmin(data.data);
          // Update localStorage with full data
          localStorage.setItem("adminUser", JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Update localStorage with new data
      localStorage.setItem("adminUser", JSON.stringify(admin));
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    const first = admin.first_name?.[0] || "A";
    const last = admin.last_name?.[0] || "D";
    return `${first}${last}`.toUpperCase();
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Personal Information
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={admin.first_name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isEditing ? "bg-gray-50 text-gray-600" : ""
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={admin.last_name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isEditing ? "bg-gray-50 text-gray-600" : ""
            }`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={admin.email || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isEditing ? "bg-gray-50 text-gray-600" : ""
            }`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={admin.phone || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isEditing ? "bg-gray-50 text-gray-600" : ""
            }`}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {getInitials()}
          </div>
          {isEditing && (
            <div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Camera className="h-4 w-4 mr-2" />
                Upload New Photo
              </button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSettingsTab) {
      case "profile":
        return renderProfileSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 hidden lg:block">
            Settings
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 lg:p-6">
                  {renderContent()}

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default SettingsPage;
