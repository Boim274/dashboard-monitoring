import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import FullScreenLoader from "./FullScreenLoader";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 detik biar kelihatan "lagi prepare data"

    return () => clearTimeout(timer);
  }, []);

  if (!token) return <Navigate to="/login" replace />;

  if (loading) return <FullScreenLoader />;

  return children;
};

export default ProtectedRoute;
