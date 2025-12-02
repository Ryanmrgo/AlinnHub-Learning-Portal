import React from "react";
import { useParams } from "react-router-dom";

const Quiz = () => {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Quiz for Lesson {id}</h3>
        <p>Multiple-choice, true/false, and short-answer questions will appear here.</p>
      </div>
    </div>
  );
};

export default Quiz;
