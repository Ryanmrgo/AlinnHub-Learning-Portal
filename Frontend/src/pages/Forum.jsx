import React from "react";
import { useParams } from "react-router-dom";

const Forum = () => {
  const { courseId } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Discussion Forum</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Course {courseId} Forum</h3>
        <p>Ask questions, get answers, upvote responses, and mark queries as solved.</p>
      </div>
    </div>
  );
};

export default Forum;
