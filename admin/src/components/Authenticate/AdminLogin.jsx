import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/Auth";
import { AuthContext } from "../../authentication/Auth";

export default function AdminLogin() {
  const { error, setError, message } = useContext(AuthContext);

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [AdminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const Loginhandler = (event) => {
    event.preventDefault();
    axios
      .post("/api/login", AdminCredentials)
      .then((response) => {
        if (response.status === 200) {
          setError(null);
          let token = JSON.parse(atob(response.data.data));
          setUser(token);
          localStorage.setItem("user", response.data.data);
          navigate("/admin/dashboard");
        }
      })
      .catch((err) => setError(err.response.data.message));
  };
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-slate-100 text-white">
      <form
        onSubmit={Loginhandler}
        className="bg-slate-500 px-8 py-8 rounded-lg text-white"
      >
        <div>
          <div className="font-bold text-2xl">Login</div>
        </div>
        {error && (
          <div className="my-6 flex gap-1 items-center text-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs">{error}</div>
          </div>
        )}
        {message && (
          <div className="my-6 flex gap-1 items-center text-green-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs">{message}</div>
          </div>
        )}
        <div class="mb-2 mt-6">
          <label for="email" class="block mb-2 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="email"
            onChange={(e) =>
              setAdminCredentials({
                ...AdminCredentials,
                username: e.target.value,
              })
            }
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) =>
              setAdminCredentials({
                ...AdminCredentials,
                password: e.target.value,
              })
            }
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
          />
        </div>
        <div className="mb-4">
          <button
            className="text-white bg-blue-600 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5  mr-2 mb-2"
            type="submit"
          >
            Login
          </button>
        </div>
        <Link className="text-xs" to="/">
          Got a form to fill?
        </Link>
      </form>
    </div>
  );
}
