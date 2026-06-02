import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
  FaCog
} from "react-icons/fa";
import api from "../../services/api";

export default function Topbar() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);

  // Get user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Error parsing user:", e);
      }
    }

    // Mock notifications
    setNotifications([
      { id: 1, message: "Scene 12 approved by Director", time: "2 minutes ago", read: false },
      { id: 2, message: "New crew member added to production", time: "1 hour ago", read: false },
      { id: 3, message: "Asset upload completed successfully", time: "3 hours ago", read: false },
      { id: 4, message: "Schedule updated for tomorrow", time: "5 hours ago", read: true }
    ]);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout").catch(err => console.log("Logout API note:", err.message));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowProfileMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const handleNotificationClick = (notifId) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notifId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const displayName = user?.role || "User";
  const displayRole = user?.role || "Crew Member";

  return (
    <div className="topbar">
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search productions, crew, scenes..."
        />
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="notification-container">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {unreadCount > 0 && <span className="dot"></span>}
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="dropdown notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button className="clear-btn" onClick={clearAllNotifications}>
                    Clear
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="empty-notif">No notifications</div>
              ) : (
                <div className="notification-list">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notif-item ${notif.read ? "read" : "unread"}`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <div className="notif-content">
                        <p>{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      {!notif.read && <div className="notif-dot"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-container">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <FaUserCircle className="profile-icon" />
            <div className="profile-info">
              <h4>{displayRole}</h4>
              <span>{displayName}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="dropdown profile-dropdown">
              <div className="dropdown-header profile-header">
                <FaUserCircle className="header-icon" />
                <div>
                  <h3>{displayName}</h3>
                  <p>{displayRole}</p>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-menu">
                <button className="menu-item" onClick={() => {
                  navigate("/dashboard");
                  setShowProfileMenu(false);
                }}>
                  <FaUser /> My Profile
                </button>

                <button className="menu-item" onClick={() => {
                  setShowProfileMenu(false);
                  // Add settings navigation when ready
                }}>
                  <FaCog /> Settings
                </button>

                <div className="dropdown-divider"></div>

                <button className="menu-item logout" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}