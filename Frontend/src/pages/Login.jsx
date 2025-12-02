import React from "react";

const Login = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    <form className="w-full max-w-sm bg-gray-100 p-6 rounded shadow">
      <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" />
      <input type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
    </form>
    <p className="mt-4">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a></p>
  </div>
);

export default Login;
