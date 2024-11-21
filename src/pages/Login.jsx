import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Login() {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  async function onSubmitHandler(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (currentState === "Sign Up") {
        // TO REGISTER
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });

        if (data?.success) {
          console.log("Register successful");
          toast.success("Registration Successful");
          setToken(data?.token);
          localStorage.setItem("uToken", data?.token);
          setCurrentState("Login");
          // go to the last page you were before you try to access this page
          // navigate(location.state?.from?.pathname || "/");
        } else {
          console.log("could not register");
          toast.error(data?.message);
        }
      } else {
        // TO LOGIN
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });

        if (data?.success) {
          console.log("login successful");
          setToken(data?.token);
          localStorage.setItem("uToken", data?.token);
          // go to the last page you were before you try to access this page
          navigate(location.state?.from?.pathname || "/");
        } else {
          console.log("could not loin");
          toast.error(data?.message);
        }
      }
    } catch (err) {
      console.log(
        "Error in Login.jsx in onSubmitHandler  register/login : ",
        err
      );
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      // it will return to where we were if the user is logged in
      navigate(-1);
    }
  }, [navigate, token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState !== "Login" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Name"
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>
      <button
        className="bg-black text-white font-light px-8 py-2 mt-4"
        disabled={loading}
      >
        {currentState === "Login" && loading
          ? "Signing In..."
          : currentState === "Login" && !loading
          ? "Sign In"
          : currentState === "Sign Up" && loading
          ? "Signing Up..."
          : "Sign Up"}
      </button>
    </form>
  );
}

export default Login;
