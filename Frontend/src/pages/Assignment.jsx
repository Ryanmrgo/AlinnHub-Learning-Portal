import React from "react";
import { useParams } from "react-router-dom";

const Assignment = () => {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Assignment Submission</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Assignment for Lesson {id}</h3>
        <form className="mt-4">
          <input type="file" className="mb-3" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Assignment</button>
        </form>
      </div>
    </div>
  );
};

export default Assignment;
