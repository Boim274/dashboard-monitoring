import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Sun,
  Moon,
  Eye,
  EyeOff
} from "lucide-react";
import gambar from "../../assets/Logo1.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "password") {
      localStorage.setItem("token", "fake-jwt-token");
      navigate("/");
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#0f172a]" : "bg-gray-100"
      }`}
    >
      {/* Bagian kiri: Form login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 relative">
        {/* Tombol Mode */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-5 right-5 p-2 rounded-full border border-gray-500/30 hover:bg-gray-500/10 transition"
        >
          {isDarkMode ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon className="text-gray-700" size={20} />
          )}
        </button>

        {/* Card Login */}
        <div
          className={`w-full max-w-md rounded-2xl p-8 border shadow-xl backdrop-blur-xl transition-all duration-700 ease-out ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } ${
            isDarkMode
              ? "bg-[#1e293b]/60 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-400 to-blue-500 p-3 rounded-full">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1
            className={`text-2xl font-semibold text-center mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-center text-sm mb-6 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Sign in to continue monitoring your dashboard
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Email address
              </label>
              <div
                className={`flex items-center mt-1 rounded-lg px-3 py-2 border ${
                  isDarkMode
                    ? "bg-[#0f172a] border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >
                <Mail
                  size={18}
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-transparent outline-none px-2  ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                  placeholder="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Password
              </label>
              <div
                className={`flex items-center mt-1 rounded-lg px-3 py-2 border relative ${
                  isDarkMode
                    ? "bg-[#0f172a] border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >
                <Lock
                  size={18}
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-transparent outline-none px-2 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                  placeholder="password"
                  required
                />

                {/* Tombol show/hide password pakai icon lucide-react */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-200 transition"
                >
                  {showPassword ? (
                    <Eye size={20} />
                  ) : (
                     <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label
                className={`flex items-center gap-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <input type="checkbox" className="accent-indigo-500" />
                Remember me
              </label>
              <a
                href="#"
                className={`${
                  isDarkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                } transition`}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Bagian kanan: Ilustrasi */}
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
    </div>
  );
};

export default LoginPage;
