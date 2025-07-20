import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = ({ account, access, setAccess }) => {
  const navigate = useNavigate();

  const [userAccount, setUserAccount] = useState(account);
  const [log, setLog] = useState(access);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState(null);
  const [caption, setCaption] = useState(null);
  const [empty, setEmpty] = useState(null);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [posts, setPosts] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [valid, setValid] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!log) {
      navigate("/signin");
    }
  }, []);

  const reloading = () => {
    if(reload){
      return setReload(false);
    }
    setReload(true);
  }

  const fetchPost = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_GET_POSTS);
      const data = await res.json();
      setPosts(data.reverse());
      setSpinner(false);
      setValid(true);
    } catch (err) {
      console.error(err);
      setSpinner(false);
    }
  };

  const fetchPosts = async () => {
      setSpinner(true);
      try{
      const res = await fetch(import.meta.env.VITE_GET_POSTS);
      if(!res.ok){
        setSpinner(false);
        return;
      }
      const data = await res.json();
      if(data.length === 0){
        setSpinner(false);
        return;
      }
      setPosts(data.reverse());
      setSpinner(false);
    }
    catch(err){
      console.error(err.message);
      setSpinner(false);
    }
    };

    const fetchAccounts = async () => {
      setSpinner(true);
      try{
        const res = await fetch(import.meta.env.VITE_GET_ACCOUNT);
        if(!res.ok){
          setSpinner(false);
          return;
        }
        const data = await res.json();
        setAccounts(data.reverse());
      }
      catch(err){
        console.error(err.message);
        setSpinner(false);
      }
    };

  const CreatePost = async (e) => {
    e.preventDefault();
    setEmpty(false);
    setValid(false);

    if (!title || !caption) {
      return setEmpty(true);
    }

    const createPost = {
      username: userAccount.username,
      date: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
      title: title,
      caption: caption,
    };

    setSpinner(true);
    const res = await fetch(import.meta.env.VITE_POST_CREATEPOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPost),
    });

    const verify = await res.json();
    setCaption("");
    setTitle("");
    fetchPost();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [reload]);

  useEffect(() => {
    fetchAccounts();
  }, [reload]);

  const logout = () => {
    setAccess(false);
    navigate("/signin");
  };

  return (
    <>
      <nav class="navbar navbar-dark fixed-top">
        <div class="container-fluid">
          <img class="navbar-brand logo-size" src="Images/logo.png" />
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end bg-dark offcanvas-dark"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div class="offcanvas-header">
              <div class="d-flex align-items-center">
                <h5
                  class="offcanvas-title text-light"
                  id="offcanvasNavbarLabel"
                >
                  Settings
                </h5>
              </div>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item d-flex flex-column justify-content-center align-items-center fw-bold text-light my-5">
                  <h3 class="fs-4 fw-bold">Account Information</h3>
                  <i class="bi bi-person-circle text-light user-size"></i>
                  <h1 class="fs-6 fw-bold">
                    Name: <span class="fw-light">{account.username}</span>
                  </h1>
                  <h1 class="fs-6 fw-bold">
                    ID: <span class="fw-light">{account.id}</span>
                  </h1>
                </li>
                <li class="nav-item d-flex align-items-center fw-bold">
                  <i class="bi bi-box-arrow-right text-danger"></i>
                  <button
                    class="btn text-danger bg-transparent border-0 fw-bold"
                    onClick={logout}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div class="offcanvas offcanvas-start offcanvas-dark bg-dark" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title text-light" id="staticBackdropLabel"></h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div>
            <form class="container-fluid" onSubmit={CreatePost} noValidate>
                <div class="container justify-content-center">
                  <h3 class="mb-4 fs-4 fw-bold text-light">Create Post</h3>
                  <div class="form-floating mb-3 w-100">
                    <input
                      type="text"
                      class={`form-control ${empty && !title && "is-invalid"} ${valid && "is-valid"}`}
                      id="floatingInputDisabled"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label for="floatingInputDisabled">Title</label>
                    ${empty && !title && (<div class="invalid-feedback">Title is required.</div>)}
                  </div>
                  <div class="form-floating mb-4">
                    <textarea
                      class={`form-control py-5 ${empty && !caption && "is-invalid"} ${valid && "is-valid"}`}
                      placeholder="Caption"
                      id="floatingTextareaDisabled"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                    <label for="floatingTextareaDisabled">Caption</label>
                    {empty && !caption && (<div class="invalid-feedback">Caption is required.</div>)}
                    {valid && (<div class="valid-feedback">Done.</div>)}
                  </div>
                  <button type="submit" class="btn btn-primary btn-lg w-100">
                    Submit
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>


      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
        <div class="container-fluid text-center text-light">
          <div class="row justify-content-evenly align-items-center vh-100">
            <div class="d-none col-xl-3 bg-dark d-xl-flex flex-column justify-content-start align-items-center p-5 rounded-2 border border-secondary vh80 overflow-y-scroll scroll-container">
              <h3 class="fs-2 fw-bold mb-4">Zest Users</h3>
              {accounts &&
                accounts.map((account, index) => (
                  <div
                    class="d-flex justify-content-center align-items-center"
                    key={index}
                  >
                    <i class="bi bi-person-fill fs-5"></i>
                    <h1 class="fs-6 mt-2 ms-1">{account.username}</h1>
                  </div>
                ))}
                {!accounts && (<h1 class="fs-6 mt-2 ms-1">No Users</h1>)}
            </div>
            <div
              class={`col-10 col-sm-8 col-md-7 col-lg-6 col-xl-4 h-100 d-flex flex-column ${posts ? "justify-content-start" : "justify-content-center"} align-items-center overflow-scroll overflow-x-hidden scroll-container`}
            >
              {posts &&
                posts.map((value, index) => (
                  <div
                    class={`card text-center bg-dark text-light border border-secondary w-100 ${index === 0 ? "mt-5 mb-4" : "my-4"} `}
                    key={index}
                  >
                    <div class="card-header d-flex align-items-center">
                      <i class="bi bi-person-circle text-light fs-4 me-2"></i>
                      {value.username}
                    </div>
                    <div class="card-body card-dark">
                      <h5 class="card-title pb-3">{value.title}</h5>
                      <p class="card-text pb-3">{value.caption}</p>
                    </div>
                    <div class="card-footer">
                      <h5 class="fs-6">Posted on {value.date}</h5>
                    </div>
                  </div>
                ))}
              {!posts && (
                <div>
                  <h1 class="fs-4 text-light">No Posts</h1>
                </div>
              )}
            </div>
            <div class="d-none col-xl-3 border d-xl-flex flex-column justify-content-center align-items-center border border-secondary bg-dark p-5 rounded-2">
              <form class="container-fluid" onSubmit={CreatePost} noValidate>
                <div class="container justify-content-center">
                  <h3 class="mb-4 fs-4 fw-bold">Create Post</h3>
                  <div class="form-floating mb-3 w-100">
                    <input
                      type="text"
                      class={`form-control ${empty && !title && "is-invalid"} ${valid && "is-valid"}`}
                      id="floatingInputDisabled"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label for="floatingInputDisabled">Title</label>
                    {empty && !title && (<div class="invalid-feedback">Title is required.</div>)}
                  </div>
                  <div class="form-floating mb-4">
                    <textarea
                      class={`form-control py-5 ${empty && !caption && "is-invalid"} ${valid && "is-valid"}`}
                      placeholder="Caption"
                      id="floatingTextareaDisabled"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                    <label for="floatingTextareaDisabled">Caption</label>
                    {empty && !caption && (<div class="invalid-feedback">Caption is required.</div>)}
                    {valid && (<div class="valid-feedback">Done.</div>)}
                  </div>
                  <button type="submit" class="btn btn-primary btn-lg w-100">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {spinner && (
                <div class="position-absolute top-0 start-0 vh-100 vw-100 bg-info bg-opacity-25 d-flex justify-content-evenly align-items-center cover">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
      )}
      <div class="position-fixed bottom-0 start-50 translate-middle-x mb-3 z-index-5">
        <div class="d-flex justify-content-center">
          <button
            class="d-block d-xl-none btn btn-success btn-lg mx-3 fs-6 px-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#staticBackdrop"
            aria-controls="staticBackdrop"
          >
            Create Post
          </button>
          <button class="btn btn-primary mx-3 fs-6 rounded-pill" onClick={reloading}>
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
