import React from "react";

const Dashboard = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-100 p-4 rounded shadow">
        <h3 className="font-semibold">Courses</h3>
        <p>Browse and enroll in courses.</p>
      </div>
      <div className="bg-green-100 p-4 rounded shadow">
        <h3 className="font-semibold">Progress</h3>
        <p>Track your learning progress and achievements.</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded shadow">
        <h3 className="font-semibold">Forum</h3>
        <p>Join discussions and ask questions.</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
