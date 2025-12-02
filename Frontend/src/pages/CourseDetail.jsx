import React from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Course Details</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Course {id}</h3>
        <p>Detailed information about the course, lessons, ratings, reviews, and comments.</p>
        <a href={`/lessons/${id}`} className="text-blue-600 hover:underline">View Lessons</a>
      </div>
    </div>
  );
};

export default CourseDetail;
