import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import Quiz from "./pages/Quiz";
import Forum from "./pages/Forum";
import Assignment from "./pages/Assignment";
import Profile from "./pages/Profile";
import Navigation from "./components/Common/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/lessons/:id" element={<LessonView />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/forum/:courseId" element={<Forum />} />
        <Route path="/assignment/:id" element={<Assignment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
