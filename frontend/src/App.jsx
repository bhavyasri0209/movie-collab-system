import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Crew from "./pages/Crew";
import Schedules from "./pages/Schedules";
import Assets from "./pages/Assets";
import Approvals from "./pages/Approvals";
import SceneBoard from "./pages/SceneBoard";
import MainLayout from "./layouts/MainLayout";
import Chat from "./pages/Chat";

export default function App() {

  return (

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/crew"
          element={<Crew />}
        />

        <Route
          path="/schedule"
          element={<Schedules />}
        />

        <Route
          path="/assets"
          element={<Assets />}
        />

        <Route
          path="/approvals"
          element={<Approvals />}
        />
        <Route
        path="/scene-board"
        element={<SceneBoard />}
      />
      <Route
        path="/chat"
        element={<Chat />}
      />
      </Route>

    </Routes>

  );
}