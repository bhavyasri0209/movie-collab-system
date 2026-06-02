import "../styles/dashboard.css";

import { motion } from "framer-motion";

import { useState } from "react";

import {
  FaFilm,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBell,
  FaVideo,
  FaSearch,
  FaUserCircle,
  FaCheckCircle,
  FaChartBar,
  FaClock,
  FaUpload,
  FaComments
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Dashboard() {

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const cards = [
    {
      title: "Crew Management",
      icon: <FaUsers />,
      desc: "Manage actors, editors, cinematographers and production teams."
    },
    {
      title: "Production Timeline",
      icon: <FaFilm />,
      desc: "Track every stage of production with cinematic workflow control."
    },
    {
      title: "Shoot Scheduling",
      icon: <FaCalendarAlt />,
      desc: "Dynamic shooting schedules with real-time updates."
    },
    {
      title: "Location Tracking",
      icon: <FaMapMarkerAlt />,
      desc: "Monitor studio and outdoor shoot locations."
    },
    {
      title: "Notifications",
      icon: <FaBell />,
      desc: "Live approval alerts and production communication."
    },
    {
      title: "Media Assets",
      icon: <FaVideo />,
      desc: "Centralized movie assets and scene uploads."
    }
  ];

  const analytics = [
    {
      title: "Scene Completion",
      value: "92%"
    },
    {
      title: "Crew Efficiency",
      value: "87%"
    },
    {
      title: "Budget Usage",
      value: "68%"
    },
    {
      title: "Asset Processing",
      value: "95%"
    }
  ];

  const activities = [
    "Scene 12 approved by Director",
    "Night shoot moved to Location B",
    "Drone footage uploaded",
    "Editor updated final sequence",
    "New cinematographer joined production"
  ];

  return (

    <div className="dashboard">
      <main className="main-panel">

        <div className="topbar">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search productions, crew, scenes..."
            />

          </div>

          <div className="topbar-right">

            <div
              className="notification"
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            >

              <FaBell />

              <span className="dot"></span>

            </div>

            <div
              className="profile"
              onClick={() =>
                setShowProfile(!showProfile)
              }
            >

              <FaUserCircle className="profile-icon" />

              <div>
                <h4>Director</h4>
                <span>Christopher Nolan</span>
              </div>

            </div>

          </div>

          {
            showNotifications && (

              <div className="notification-panel">

                <h3>Notifications</h3>

                <div className="notify-item">
                  Scene 12 approved
                </div>

                <div className="notify-item">
                  Crew updated schedule
                </div>

                <div className="notify-item">
                  Drone footage uploaded
                </div>

              </div>

            )
          }

          {
            showProfile && (

              <div className="profile-dropdown">

                <div className="profile-option">
                  My Profile
                </div>

                <div className="profile-option">
                  Production Settings
                </div>

                <div className="profile-option logout">
                  Logout
                </div>

              </div>

            )
          }

        </div>

        <div className="hero-banner">

          <div>

            <span className="live-tag">
              LIVE PRODUCTION
            </span>

            <h1>
              Interstellar
              <br />
              Production Dashboard
            </h1>

            <p>
              Real-time collaboration for directors,
              cinematographers, editors and production crews.
            </p>

            <div className="hero-buttons">

              <button className="primary-btn">
                Launch Production
              </button>

              <button className="secondary-btn">
                View Timeline
              </button>

            </div>

          </div>

          <div className="circle-glow"></div>

        </div>

        <div className="stats-row">

          <div className="stat-box">
            <h3>48</h3>
            <span>Crew Members</span>
          </div>

          <div className="stat-box">
            <h3>12</h3>
            <span>Scenes Pending</span>
          </div>

          <div className="stat-box">
            <h3>5</h3>
            <span>Locations Active</span>
          </div>

          <div className="stat-box">
            <h3>92%</h3>
            <span>Production Progress</span>
          </div>

        </div>

        <div className="cards">

          {cards.map((card, index) => (

            <motion.div
              className="card"
              key={index}
              whileHover={{ y: -12, scale: 1.03 }}
            >

              <div className="card-icon">
                {card.icon}
              </div>

              <h3>{card.title}</h3>

              <p>{card.desc}</p>

            </motion.div>

          ))}

        </div>

        <div className="analytics-section">

          <h2>Production Analytics</h2>

          <div className="analytics-grid">

            {analytics.map((item, index) => (

              <div className="analytics-card" key={index}>

                <div className="analytics-top">

                  <span>{item.title}</span>

                  <h3>{item.value}</h3>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{ width: item.value }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="bottom-grid">

          <div className="activity-feed">

            <h2>
              <FaClock />
              Live Production Activity
            </h2>

            {
              activities.map((item, index) => (

                <div className="activity-item" key={index}>
                  {item}
                </div>

              ))
            }

          </div>

          <div className="quick-actions">

            <h2>
              <FaUpload />
              Quick Actions
            </h2>

            <button>Upload Assets</button>

            <button>Create Schedule</button>

            <button>Assign Crew</button>

            <button>Start Approval</button>

          </div>

          <div className="team-chat">

            <h2>
              <FaComments />
              Crew Communication
            </h2>

            <div className="chat-box">
              Director: Finalize Scene 8 tonight.
            </div>

            <div className="chat-box">
              Editor: Uploading updated cut now.
            </div>

            <div className="chat-box">
              Cinematographer: Lighting setup complete.
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}