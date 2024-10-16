import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginUser();
  };

  const LoginUser = () => {
    const apiUrl = "https://localhost:7122/login";

    const data = {
      email,
      password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid email or password.");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem("jwtToken", data.token);
          navigate("/chat");
        } else {
          setError("No token returned");
        }
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error: ", error);
      });
  };
  return (
    <div className="container">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}{" "}
      <div className="form-grid">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-username">Email</label>
          </div>
          <input
            id="login-username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <div>
            <label htmlFor="login-password">Password</label>
          </div>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div>
            <button type="submit">Sign in</button>
          </div>
          <div className="register-container">
            <span>Don&apos;t have an account?</span>
            <span>
              <Link to="/register">Create one</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
