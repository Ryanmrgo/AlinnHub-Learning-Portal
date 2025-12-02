import React from "react";
import { useParams } from "react-router-dom";

const LessonView = () => {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Lesson Viewer</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lesson {id}</h3>
        <p>View lesson files (PDF, PPT, video) and descriptions here.</p>
      </div>
    </div>
  );
};

export default LessonView;
