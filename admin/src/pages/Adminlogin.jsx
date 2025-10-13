import { useAuth0 } from "@auth0/auth0-react";
import { Mail, Shield, ArrowRight, Zap } from "lucide-react";

const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 text-center">
            <div className="w-20 h-20 flex items-center justify-center mx-auto ">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-30 h-30 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Login Form Section */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Email Login Button */}
              <button
                onClick={() => loginWithRedirect()}
                disabled={isLoading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>Continue with Email</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>

            {/* Features Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    Secure Access
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    Fast & Reliable
                  </span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                <div
                  className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
