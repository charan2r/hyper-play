/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Save, Camera } from "lucide-react";
const SettingsPage = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john@agency.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
            JD
          </div>
          <div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Camera className="h-4 w-4 mr-2" />
              Upload New Photo
            </button>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
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
                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                    <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
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
