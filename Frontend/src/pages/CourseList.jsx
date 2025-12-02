import React from "react";
import { Link } from "react-router-dom";

const CourseList = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Courses</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3].map(id => (
        <div key={id} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Course {id}</h3>
          <p>Course description goes here.</p>
          <Link to={`/courses/${id}`} className="text-blue-600 hover:underline">View Details</Link>
        </div>
      ))}
    </div>
  </div>
);

export default CourseList;
