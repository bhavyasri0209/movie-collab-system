import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/auth.css";

import { loginUser } from "../services/authService";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

 const handleLogin = async () => {

  const response = await API.post("/login", {
    email,
    password
  });

  localStorage.setItem(
    "user",
    JSON.stringify({
      name: response.data.username
    })
  );

};

        setError("");
        navigate("/dashboard");

      }

    } catch (err) {

      setError("Invalid email or password");

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>Studio Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {
          error && (
            <p className="error-text">
              {error}
            </p>
          )
        }

        <button onClick={handleLogin}>
          Access Production
        </button>

      </div>

    </div>
  );
}