/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  // const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  async function handleLoginUser(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/login", {
        email,
        password,
      });

      const userInfo = await res.data;

      setUser(userInfo);

      // alert("Login successful", userInfo);
      setRedirect(true);
    } catch (err) {
      alert("Invalid credentials");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginUser}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?
            <Link to="/register" className="underline text-black">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
