import React, { useState, useEffect } from "react";
import { signup, login, verifyOTP, forgotPassword, resetPassword } from "../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/authSlice";
import { Success, Error } from "../Utils/toastUtils.js";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Redux state

  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", otp: "" });
  const [awaitingOTP, setAwaitingOTP] = useState(false);
  const [forgotOTPStage, setForgotOTPStage] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (awaitingOTP) {
        const res = await verifyOTP({ email: formData.email, otp: formData.otp });
        Success(res.data.message);

        // Auto-login after OTP verification
        const loginRes = await login({ email: formData.email, password: formData.password });
        dispatch(loginUser(loginRes.data.user));

        setAwaitingOTP(false);
        navigate("/");
      } else if (mode === "signup") {
        const res = await signup(formData);
        setMessage(res.data.message);
        Success("OTP sent to your email.");
        setAwaitingOTP(true);
      } else if (mode === "login") {
        const res = await login(formData);
        dispatch(loginUser(res.data.user));
        Success(`Welcome back, ${res.data.user.name}!`);

        if (res.data.user.is_admin) navigate("/admin-dashboard");
        else if (res.data.user.role === "seller") navigate("/seller-dashboard");
        else navigate("/");
      } else if (mode === "forgot") {
        if (!forgotOTPStage) {
          const res = await forgotPassword(formData.email);
          Success(res.data.message);
          setMessage("OTP sent to your email.");
          setForgotOTPStage(true);
        } else {
          const res = await resetPassword({
            email: formData.email,
            otp: formData.otp,
            new_password: newPassword,
          });
          Success(res.data.message);
          setForgotOTPStage(false);
          setMode("login");
          setNewPassword("");
          setFormData((prev) => ({ ...prev, otp: "" }));
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong.";
      setMessage(errorMsg);
      Error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (awaitingOTP) {
      return (
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      );
    }

    if (mode === "forgot") {
      return (
        <>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {forgotOTPStage && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </>
          )}
        </>
      );
    }

    return (
      <>
        {mode === "signup" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          {awaitingOTP
            ? "Verify OTP"
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Forgot Password"}
        </h2>

        {message && (
          <div className="mb-4 text-center text-sm text-blue-600 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent border-l-transparent rounded-full animate-spin" />
                {awaitingOTP
                  ? "Verifying..."
                  : mode === "login"
                  ? "Logging in..."
                  : "Sending OTP..."}
              </div>
            ) : (
              <>
                {awaitingOTP
                  ? "Verify OTP"
                  : mode === "login"
                  ? "Login"
                  : mode === "signup"
                  ? "Sign Up"
                  : "Send OTP"}
              </>
            )}
          </button>
        </form>

        {!awaitingOTP && (
          <div className="text-center mt-6 space-y-2">
            {mode !== "forgot" && (
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-blue-600 hover:underline text-sm"
              >
                {mode === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </button>
            )}
            <div>
              {mode === "forgot" ? (
                <button
                  onClick={() => setMode("login")}
                  className="text-gray-500 hover:underline text-sm"
                >
                  Back to Login
                </button>
              ) : (
                <button
                  onClick={() => setMode("forgot")}
                  className="text-red-500 hover:underline text-sm"
                >
                  Forgot Password?
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
