/* eslint-disable no-unused-vars */

import { Provider, useDispatch, useSelector } from "react-redux";

// Redux Actions
const SET_EMAIL = "SET_EMAIL";
const SET_LOADING = "SET_LOADING";
const SET_MESSAGE = "SET_MESSAGE";

const setEmail = (email) => ({ type: SET_EMAIL, payload: email });
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
const setMessage = (message) => ({ type: SET_MESSAGE, payload: message });

// Redux Reducer
const initialState = {
  email: "",
  loading: false,
  message: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
};

// Security Illustration Component
const SecurityIllustration = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-gray-900/20"></div>

      {/* Optional: Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10"></div>
    </div>
  );
};

// Main Password Reset Component
const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const { email, loading, message } = useSelector((state) => state);

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    dispatch(setLoading(true));
    dispatch(setMessage(""));

    // Simulate API call
    setTimeout(() => {
      dispatch(setLoading(false));
      dispatch(setMessage("Password reset link sent to your email!"));
    }, 2000);
  };

  const handleCancel = () => {
    dispatch(setEmail(""));
    dispatch(setMessage(""));
  };

  return (
    <div className="flex items-center justify-center h-full px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-500 outline-none transition-all duration-300 bg-gray-50 text-sm sm:text-base font-medium placeholder-gray-400 hover:border-gray-400"
              placeholder="Enter your email address"
              required
            />
          </div>

          {message && (
            <div
              className={`p-3 sm:p-4 ${
                message.includes("sent")
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              } border-2 rounded-xl`}
            >
              <p
                className={`text-sm sm:text-base ${
                  message.includes("sent") ? "text-emerald-700" : "text-red-700"
                } font-medium`}
              >
                {message}
              </p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none disabled:hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Remember your password?{" "}
            <button className="text-indigo-600 hover:text-indigo-700 active:text-indigo-800 font-bold transition-colors duration-200 underline decoration-2 underline-offset-2">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main ForgotPassword Component
const ForgotPassword = () => {
  return (
    <Provider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Layout - Stack vertically */}
        <div className="block md:hidden">
          {/* Mobile illustration header */}
          <div className="w-full h-64 sm:h-72 relative">
            <SecurityIllustration />
          </div>

          {/* Mobile form */}
          <div className="w-full bg-white rounded-t-3xl -mt-6 relative z-10 shadow-2xl">
            <ForgotPasswordForm />
          </div>
        </div>

        {/* Tablet & Desktop Layout - Side by side */}
        <div className="hidden md:flex md:min-h-screen">
          {/* Illustration section */}
          <div className="w-1/2 relative">
            <SecurityIllustration />
          </div>

          {/* Form section */}
          <div className="w-1/2 bg-white flex items-center justify-center">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default ForgotPassword;
