import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Crew"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await registerUser(formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Studio Account</h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <select 
          name="role" 
          value={formData.role}
          onChange={handleChange}
          style={{padding: "10px", marginBottom: "15px", borderRadius: "4px"}}
        >
          <option value="Director">Director</option>
          <option value="Producer">Producer</option>
          <option value="Crew">Crew</option>
          <option value="Editor">Editor</option>
          <option value="Cinematographer">Cinematographer</option>
        </select>

        {error && <p className="error-text">{error}</p>}
        {success && <p style={{color: "green"}}>{success}</p>}

        <button onClick={handleRegister}>Create Account</button>

        <p style={{marginTop: "15px", textAlign: "center"}}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}