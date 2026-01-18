import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "black",
    padding: "1rem",
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
  },

  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "14px",
  },

  success: {
    color: "green",
  },

  error: {
    color: "red",
  },

  footerText: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "14px",
  },

  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
  },
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setIsError(true);
      setMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      

      localStorage.setItem("token", res.data.token);

      setMessage("Login successful 🎉");

      setTimeout(() => {
          navigate("/profile");
      }, 700);


    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Welcome Back</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <div
            style={{
              ...styles.message,
              ...(isError ? styles.error : styles.success),
            }}
          >
            {message}
          </div>
        )}

        <div style={styles.footerText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
