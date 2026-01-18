function Profile() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000000",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2>Welcome </h2>
        <p>You are logged in</p>

        <button
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            background: "#dc3545",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
