import "./Register.css";

const Register = () => {
  return (
    <div className="container">
      <h1>Register</h1>
      <div className="form-grid">
        <form type="onSubmit">
          <div>
            <label htmlFor="login-username">Username</label>
          </div>
          <input id="login-username"></input>
          <div>
            <label htmlFor="login-email">Email</label>
          </div>
          <input id="login-email"></input>
          <div>
            <label htmlFor="login-password">Password</label>
          </div>
          <input type="password" id="login-password"></input>
          <div>
            <button onClick="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
