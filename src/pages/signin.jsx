import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const SignIn = ({ setAccount, setAccess }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const LogIn = async (e) => {
    e.preventDefault();
    setEmpty(false);
    setInvalid(false);

    if (!username || !password) {
      return setEmpty(true);
    }

    const loginAccount = {
      username: username,
      password: password,
    };

    try {
      const res = await fetch(import.meta.env.VITE_POST_SIGNIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginAccount),
      });

      const verify = await res.json();

      if (verify.verify) {
        setAccount({ username: verify.username, id: verify.id });
        setAccess(true);
        navigate("/");
      } else {
        setInvalid(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div class="d-flex flex-column justify-content-center align-items-center vh-100 vw-100 text-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-4">
            <form onSubmit={LogIn} noValidate>
              <div class="container d-flex flex-column justify-content-center align-items-center">
                <img
                  class="navbar-brand logo-signin mb-5"
                  src="Images/logo.png"
                />
                <h1 class="mb-5 fs-1 lead">Sign In</h1>

                <div class="form-floating mb-3 w-100">
                  <input
                    type="text"
                    class={`form-control ${empty && !username && "is-invalid"} ${invalid && "is-invalid"}`}
                    id="floatingInput"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label for="floatingInput">Username</label>
                  {empty && !username && (
                    <div className="invalid-feedback">
                      Username is required.
                    </div>
                  )}
                  {invalid && (
                    <div className="invalid-feedback">Invalid Username.</div>
                  )}
                </div>
                <div class="form-floating mb-4 w-100">
                  <input
                    type="password"
                    class={`form-control ${empty && !password && "is-invalid"} ${invalid && "is-invalid"}`}
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label for="floatingPassword">Password</label>
                  {empty && !password && (
                    <div className="invalid-feedback">
                      Password is required.
                    </div>
                  )}
                  {invalid && (
                    <div className="invalid-feedback">Invalid Password.</div>
                  )}
                </div>
                <button type="submit" class="btn btn-primary btn-lg mb-3 w-100">
                  Submit
                </button>
                <Link to="/signup" class="btn btn-secondary btn-lg w-100">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
