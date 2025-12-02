import React from "react";

const Register = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <h2 className="text-2xl font-bold mb-4">Register</h2>
    <form className="w-full max-w-sm bg-gray-100 p-6 rounded shadow">
      <input type="text" placeholder="Name" className="w-full mb-3 p-2 border rounded" />
      <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" />
      <input type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded" />
      <select className="w-full mb-3 p-2 border rounded">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
    </form>
    <p className="mt-4">Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></p>
  </div>
);

export default Register;
