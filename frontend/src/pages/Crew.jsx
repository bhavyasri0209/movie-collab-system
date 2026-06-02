import { useState, useEffect } from "react";
import "../styles/crew.css";
import api from "../services/api";

const ROLES = ["Director", "Producer", "Cinematographer", "Editor", "Actor", "Sound Engineer", "Music Composer"];
const STATUSES = ["Active", "Available", "Busy", "On Leave"];

export default function Crew() {
  const [crew, setCrew] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "Director",
    status: "Active"
  });

  // Fetch crew data from backend
  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    try {
      setLoading(true);
      const response = await api.get("/crew");
      setCrew(response.data);
    } catch (error) {
      console.error("Error fetching crew:", error);
      // Fallback to mock data if API fails
      setCrew([
        { name: "Christopher Nolan", role: "Director", status: "Active" },
        { name: "Hans Zimmer", role: "Music Composer", status: "Available" },
        { name: "Hoyte van Hoytema", role: "Cinematographer", status: "Busy" },
        { name: "Lee Smith", role: "Film Editor", status: "Active" }
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

  const handleAddCrew = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Please enter crew name");
      return;
    }

    try {
      setLoading(true);
      // Add to local state immediately for better UX
      setCrew(prev => [...prev, formData]);
      
      // Try to save to backend (optional)
      await api.post("/assign-crew", {
        crew_name: formData.name,
        role: formData.role
      }).catch(err => console.log("Backend save note:", err.message));
      
      setFormData({ name: "", role: "Director", status: "Active" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding crew:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCrew = (index) => {
    setCrew(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="crew-page">
      <div className="crew-header">
        <h1>Crew Management</h1>
        <button onClick={() => setShowModal(true)} className="add-btn">
          + Add Crew
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Crew Member</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAddCrew}>
              <div className="form-group">
                <label>Crew Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter crew member name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Adding..." : "Add Crew Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="crew-grid">
        {crew.length === 0 ? (
          <p className="empty-state">No crew members added yet. Click "Add Crew" to get started!</p>
        ) : (
          crew.map((member, index) => (
            <div className="crew-card" key={index}>
              <div className="crew-avatar">
                {member.name[0]}
              </div>
              <h2>{member.name}</h2>
              <p className="crew-role">{member.role}</p>
              <span className={`crew-status ${member.status.toLowerCase()}`}>
                {member.status}
              </span>
              <button className="delete-btn" onClick={() => handleRemoveCrew(index)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}