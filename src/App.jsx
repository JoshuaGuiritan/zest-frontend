import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Home from "./pages/homepage";

const App = () => {
  const [account, setAccount] = useState("");
  const [access, setAccess] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<SignIn setAccount={setAccount} setAccess={setAccess} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <Home account={account} access={access} setAccess={setAccess} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
