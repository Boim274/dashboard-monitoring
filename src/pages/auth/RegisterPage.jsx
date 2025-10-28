import React, { useState, useEffect } from "react";
import { Mail, Lock, User as UserIcon, Sun, Moon, Eye, EyeOff } from "lucide-react";
import gambar from "../../assets/Logo1.png";

const RegisterPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setShow(true);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    console.log("Register success:", formData);
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-700 ${
        isDarkMode ? "bg-[#0F172A]" : "bg-gray-100"
      }`}
    >
      {/* Tombol Toggle Tema */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-5 right-5 z-50 p-2 rounded-full border transition-all duration-200 active:scale-90 ${
          isDarkMode
            ? "border-gray-600 hover:bg-gray-700/50"
            : "border-gray-300 hover:bg-gray-200"
        }`}
      >
        {isDarkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-gray-700" />
        )}
      </button>

    {/* Bagian Kiri - Gambar */}
    <div
        className={`hidden md:flex w-1/2 items-center justify-center p-10 transition-all duration-700 ${
            isDarkMode
            ? "bg-gradient-to-br from-indigo-600 to-purple-700"
            : "bg-gradient-to-br from-indigo-200 to-purple-300"
        }`}
    >
        <div
            className={`flex flex-col items-center justify-center text-center transform transition-all duration-700 ${
            show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
        >
            {/* Gambar */}
            <img
            src={gambar}
            alt="Register Illustration"
            className="w-1/2 max-w-md drop-shadow-2xl mb-6"
            />

            {/* Teks di bawah gambar */}
            <p
            className={`text-lg font-medium ${
                isDarkMode ? "text-white/90" : "text-blue-600"

            }`}
            >
            <p className="text-5xl font-semibold">MONITORING</p>
            <p className="text-2xl font-normal mt-2">SYSTEM</p>
            </p>
        </div>
    </div>


      {/* Bagian Kanan - Form Register */}
      <div
        className={`flex w-full md:w-1/2 items-center justify-center p-6 md:p-12 transition-all duration-700 ${
          show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-lg p-8 transition-all duration-500 ${
            isDarkMode
              ? "bg-[#1E293B] border border-white/10 hover:shadow-indigo-500/10"
              : "bg-white border border-gray-200 hover:shadow-indigo-300/20"
          }`}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-400 to-blue-500 p-3 rounded-full">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          

          <h2
            className={`text-2xl font-bold text-center mb-6 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <UserIcon
                  className={`absolute left-3 top-2.5 w-5 h-5 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 outline-none ${
                    isDarkMode
                      ? "bg-[#0F172A] border-gray-700 text-gray-200 focus:ring-indigo-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-400"
                  }`}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-2.5 w-5 h-5 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 outline-none ${
                    isDarkMode
                      ? "bg-[#0F172A] border-gray-700 text-gray-200 focus:ring-indigo-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-400"
                  }`}
                  placeholder="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-2.5 w-5 h-5 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 outline-none ${
                    isDarkMode
                      ? "bg-[#0F172A] border-gray-700 text-gray-200 focus:ring-indigo-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-400"
                  }`}
                  placeholder="password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition"
                >
                  {showConfirm ? <Eye size={18} /> : <EyeOff  size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-2.5 w-5 h-5 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 outline-none ${
                    error
                      ? "border-red-500 focus:ring-red-400"
                      : isDarkMode
                      ? "bg-[#0F172A] border-gray-700 text-gray-200 focus:ring-indigo-400"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-400"
                  }`}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition"
                >
                  {showConfirm ? <Eye size={18} /> : <EyeOff  size={18} />}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-between">
              <label
                className={`flex items-center text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-500 border-gray-700 rounded focus:ring-indigo-400"
                />
                <span className="ml-2">I agree to the terms</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
            >
              Create Account
            </button>

            <p
              className={`text-center text-sm mt-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Already have an account?{" "}
              <a
                href="/login"
                className={`font-medium transition-colors ${
                  isDarkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
