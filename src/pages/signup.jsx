import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [invalidU, setInvalidU] = useState(false);
  const [invalidP, setInvalidP] = useState(false);

  const Create = async (e) => {
    e.preventDefault();

    setInvalidU(false);
    setEmpty(false);
    setInvalidP(false);

    if (!username || !password || !rePassword) {
      return setEmpty(true);
    }

    if (password !== rePassword) {
      return setInvalidP(true);
    }

    const createAccount = {
      username: username,
      password: password,
    };

    try {
      const res = await fetch(import.meta.env.VITE_POST_SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createAccount),
      });

      const verify = await res.json();

      if (!verify.verify) {
        return setInvalidU(true);
      }
      navigate("/signin");
    } catch (err) {
      setMessage("No Fetch! Try Again");
    }
  };

  return (
    <div class="d-flex flex-column justify-content-center align-items-center vh-100 vw-100 text-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-4">
            <form onSubmit={Create}>
              <div class="container d-flex flex-column justify-content-center align-items-center">
                <img
                  class="navbar-brand logo-signin mb-5"
                  src="Images/logo.png"
                />

                <div class="form-floating mb-5 w-100">
                  <input
                    type="text"
                    class={`form-control form-control-lg ${empty && !username && "is-invalid"} ${invalidU && "is-invalid"}`}
                    id="floatingInput"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label for="floatingInput">Username</label>
                  {empty && !username && (
                    <div class="invalid-feedback">Username is required!</div>
                  )}
                  {invalidU && (
                    <div class="invalid-feedback">Username already exist!</div>
                  )}
                </div>
                <div class="form-floating mb-3 w-100">
                  <input
                    type="password"
                    class={`form-control form-control-lg ${empty && !password && "is-invalid"}`}
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label for="floatingPassword">Password</label>
                  <div class="invalid-feedback">Password is required!</div>
                </div>
                <div class="form-floating mb-4 w-100">
                  <input
                    type="password"
                    class={`form-control form-control-lg ${empty && !rePassword && "is-invalid"} ${invalidP && "is-invalid"}`}
                    id="floatingPassword"
                    placeholder="Password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                  <label for="floatingPassword">Re-enter Password</label>
                  {empty && !rePassword && (
                    <div class="invalid-feedback">
                      Re-enter Password is required!
                    </div>
                  )}
                  {invalidP && (
                    <div class="invalid-feedback">Passwords not match!</div>
                  )}
                </div>
                <button type="submit" class="btn btn-primary btn-lg mb-3 w-100">
                  Sign Up
                </button>
                <Link to="/signin" class="btn btn-secondary btn-lg w-100">
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
