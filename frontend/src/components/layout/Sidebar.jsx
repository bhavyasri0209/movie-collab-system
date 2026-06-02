import {
  FaFilm,
  FaUsers,
  FaCalendar,
  FaVideo,
  FaCheckCircle,
  FaChartBar
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
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
          <FaCalendar />
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

      </nav>

    </aside>
  );
}