import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("admin"); // 'admin' or 'manufacturer'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        role === "manufacturer"
          ? `${API_URL}/auth/manufacturer/login`
          : `${API_URL}/auth/admin/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Save token and user based on role
      if (role === "manufacturer") {
        localStorage.setItem("manufacturerToken", data.token);
        localStorage.setItem("manufacturerUser", JSON.stringify(data.user));
        window.location.href = "/manufacturer";
      } else {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-100 rounded-full opacity-10 animate-bounce"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto mt-5">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[400px]">
          {/* Login Form */}
          <div className="p-5 lg:p-8 flex flex-col justify-center">
            <div className="max-w-xs mx-auto w-full">
              {/* Logo and Header */}
              <div className="text-center mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Login
                </h1>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Login As
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="admin"
                        name="role"
                        value="admin"
                        checked={role === "admin"}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="admin"
                        className="ml-2 block text-sm text-gray-700 cursor-pointer"
                      >
                        Admin
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="manufacturer"
                        name="role"
                        value="manufacturer"
                        checked={role === "manufacturer"}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="manufacturer"
                        className="ml-2 block text-sm text-gray-700 cursor-pointer"
                      >
                        Manufacturer
                      </label>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-[60%] bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
