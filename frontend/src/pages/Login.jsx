import { login, fetchUser } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    const data = { email, password }; // send JSON instead of FormData
    dispatch(login(data));
  };

  // ✅ After login, fetch user details and save token
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      localStorage.setItem("token", user.token); // Save token
      dispatch(fetchUser()); // Fetch user profile
      toast.success("Login successful!");
      navigate("/"); // redirect to home
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
      <div className="bg-card mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md sm:w-[600px] sm:h-[450px]">
        <h1 className="text-primary text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-border focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-border focus:outline-none"
            />
          </div>
          <button
            className="bg-primary font-semibold hover:bg-primary/80 transition-all duration-300 text-xl py-2 px-4 rounded-md text-primary-foreground mx-auto my-4"
            type="submit"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
