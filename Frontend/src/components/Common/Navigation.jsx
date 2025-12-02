import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
    <div className="font-bold text-xl">AlinHub</div>
    <div className="space-x-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/courses" className="hover:underline">Courses</Link>
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/profile" className="hover:underline">Profile</Link>
      <Link to="/login" className="hover:underline">Login</Link>
      <Link to="/register" className="hover:underline">Register</Link>
    </div>
  </nav>
);

export default Navigation;
