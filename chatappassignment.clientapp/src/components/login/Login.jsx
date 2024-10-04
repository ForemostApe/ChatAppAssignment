import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container">
      <h1>Login</h1>
      <div className="form-grid">
        <form type="onSubmit">
          <div>
            <label htmlFor="login-username">Username</label>
          </div>
          <input id="login-username"></input>
          <div>
            <label htmlFor="login-password">Password</label>
          </div>
          <input type="password" id="login-password"></input>
          <div>
            <button onClick="submit">Sign in</button>
          </div>
          <div className="register-container">
            Don&apos;t have an account?<Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
