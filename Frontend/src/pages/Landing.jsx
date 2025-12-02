import React from "react";

const Landing = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-4xl font-bold mb-4 text-blue-700">AlinHub</h1>
    <p className="mb-6 text-lg text-gray-700 max-w-xl text-center">
      A Charity-Based Digital Learning Portal for students, teachers, and communities. Free, open-access, and community-driven.
    </p>
    <div className="space-x-4">
      <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
      <a href="/register" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Register</a>
    </div>
  </div>
);

export default Landing;
