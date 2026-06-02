import { useState, useEffect } from "react";
import "../styles/schedules.css";
import api from "../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day: "Monday",
    scene: "",
    time: "08:00 AM",
    location: ""
  });

  // Fetch schedules from backend
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get("/schedules");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      // Fallback to mock data
      setSchedules([
        { day: "Monday", scene: "Scene 12 - Space Dock", time: "08:00 AM", location: "Iceland Studio" },
        { day: "Tuesday", scene: "Scene 4 - Earth Farm", time: "11:00 AM", location: "Los Angeles Set" },
        { day: "Wednesday", scene: "Scene 8 - Black Hole", time: "06:00 PM", location: "Warner Bros Studio" },
        { day: "Thursday", scene: "Trailer Recording", time: "03:00 PM", location: "Sound Stage 4" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    
    if (!formData.scene.trim() || !formData.location.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      // Add to local state immediately
      setSchedules(prev => [...prev, formData]);
      
      // Try to save to backend (optional)
      await api.post("/create-schedule", formData).catch(err => console.log("Backend save note:", err.message));
      
      setFormData({ day: "Monday", scene: "", time: "08:00 AM", location: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h1>Production Shooting Schedule</h1>
        <button onClick={() => setShowModal(true)} className="add-btn">
          + Add Schedule
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Shooting Schedule</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAddSchedule}>
              <div className="form-group">
                <label>Day *</label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Scene Name *</label>
                <input
                  type="text"
                  name="scene"
                  value={formData.scene}
                  onChange={handleInputChange}
                  placeholder="e.g., Scene 12 - Space Dock"
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                >
                  {TIMES.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Iceland Studio"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Adding..." : "Add Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="schedule-grid">
        {schedules.length === 0 ? (
          <p className="empty-state">No schedules added yet. Click "Add Schedule" to create one!</p>
        ) : (
          schedules.map((item, index) => (
            <div className="schedule-card" key={index}>
              <div className="schedule-day">{item.day}</div>
              <h2>{item.scene}</h2>
              <div className="schedule-info">
                <p>⏰ {item.time}</p>
                <p>📍 {item.location}</p>
              </div>
              <button className="delete-btn" onClick={() => handleRemoveSchedule(index)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}