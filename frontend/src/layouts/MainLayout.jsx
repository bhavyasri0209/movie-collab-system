import { Outlet, NavLink } from "react-router-dom";

import {
  FaChartBar,
  FaFilm,
  FaUsers,
  FaCalendarAlt,
  FaVideo,
  FaCheckCircle,
  FaLayerGroup,
  FaComments
} from "react-icons/fa";

import "../styles/layout.css";

export default function MainLayout() {

  return (

    <div className="dashboard">

      <aside className="sidebar">

        <h2>StudioFlow</h2>

        <nav>

          <NavLink to="/dashboard">
            <FaChartBar />
            Overview
          </NavLink>

          <NavLink to="/projects">
            <FaFilm />
            Productions
          </NavLink>

          <NavLink to="/crew">
            <FaUsers />
            Crew
          </NavLink>

          <NavLink to="/schedule">
            <FaCalendarAlt />
            Schedules
          </NavLink>

          <NavLink to="/assets">
            <FaVideo />
            Assets
          </NavLink>

          <NavLink to="/approvals">
            <FaCheckCircle />
            Approvals
          </NavLink>
          <NavLink to="/scene-board">
          <FaLayerGroup />
          Scene Board
          </NavLink>
          <NavLink to="/chat">
            <FaComments />
            Chat
          </NavLink>
        </nav>

      </aside>

      <main className="main-layout-content">

        <Outlet />

      </main>

    </div>
  );
}