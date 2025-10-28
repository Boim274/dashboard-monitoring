// src/App.jsx
import React from "react";
import DashboardLayout from "./components/Dashboardlayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}

export default App;
