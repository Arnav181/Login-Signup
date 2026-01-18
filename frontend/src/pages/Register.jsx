import { useState } from "react";
import axios from "axios";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    padding: "1rem",
  },

  card: {
    width: "100%",
    maxWidth: "350px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing : "border-box",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  msg: {
    marginTop: "1rem",
    textAlign: "center",
    color: "green",
  },
};


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Signup Data:", { name, email, password });

    try {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        });

        setMessage(res.data.message);
        console.log("Signup Response:", res.data);
    }
    catch (error) {
    console.error("Error during signup:", error);
    setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
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

        <button style={styles.button}>Sign Up</button>
      </form>
    </div>
  );
}


export default Register;
