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
            <button onClick={CreateUser()}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

const CreateUser = () => {
  const username = "Per";
  const email = "per.karlsson@yh.nackademin.se";
  const password = "Abc123!!!";

  const apiUrl = "https://localhost:7122/Auth/register";

  const data = {
    user: { username },
    email: { email },
    password: { password },
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(apiUrl, requestOptions).then((response) => {
    if (!response.ok) {
      throw new Error("Response was not OK.");
    }
    console.log("Hey, it worked!");
    return response.json();
  });
};
