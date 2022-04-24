/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ClientContext } from "../../authentication/ClientAuth";

import { useNavigate } from "react-router-dom";

const Userlogin = () => {
  const [userLogin, setUserLogin] = useState({
    email: "",
    otp: "",
    userid: "",
    emailok: false,
  });

  const navigate = useNavigate();

  const { notify, setUser } = React.useContext(ClientContext);

  const ClientPostLogin = (e) => {
    e.preventDefault();

    var filter =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (filter.test(userLogin.email)) {
      e.target.disabled = true;
      e.target.classList.toggle("cursor-not-allowed");
      axios
        .post(`/api/d/login`, {
          email: userLogin.email,
        })
        .then((res) => {
          if (res.data.success) {
            setUserLogin({
              email: res.data.email,
              otp: "",
              userid: res.data.userid,
              emailok: true,
            });
            notify(res.data.message)();
          }
        })
        .catch(() => {
          setUserLogin({
            ...userLogin,
            email: "",
          });
          notify("Email Not Found!", "error")();
          e.target.disabled = false;
          e.target.classList.toggle("cursor-not-allowed");
        });
    } else {
      notify("Invalid Email", "error")();
    }
  };

  const ClientOTPGetVerification = React.useCallback(
    (e) => {
      e.preventDefault();
      axios
        .get(`/api/d/login`, {
          params: {
            id: userLogin.userid,
            otp_code: userLogin.otp,
          },
        })
        .then((res) => {
          if (res.data.success) {
            notify(res.data.message)();
            setUserLogin({
              ...userLogin,
              otp: "",
            });
            const USER = {
              isActive: true,
              email: res.data.data.email,
              Us341D: res.data.data.id,
            };
            setUser(USER);
            localStorage.setItem("U3/r", btoa(JSON.stringify(USER)));
            navigate("/d/dashboard");
            //navigate to form
            //get expire value check and local storage it
          } else {
            notify(res.data.message)();
          }
        });
    },
    [navigate, notify, setUser, userLogin]
  );

  const ClientPostResendOTP = React.useCallback(
    (e) => {
      e.target.disabled = true;
      setUserLogin({
        ...userLogin,
        otp: "",
      });
      e.preventDefault();
      axios
        .post(`/api/d/resend-otp`, {
          id: userLogin.userid,
          email: userLogin.email,
        })
        .then((res) => {
          if (res.data.success) {
            notify(res.data.message)();
          }
        })
        .catch(() => {
          notify("OTP generation failed, Try Again!", "error")();
          e.target.disabled = false;
        });
    },
    [userLogin]
  );

  return (
    <div className="flex w-screen	h-screen justify-center items-center bg-slate-100">
      <form className="bg-slate-500 px-3 py-3 md:px-6 md:py-6 lg:px-8 lg:py-8 rounded-lg text-white">
        {userLogin.emailok ? (
          <div>
            <h1 className="font-bold text-2xl">Enter OTP</h1>
            <input
              className="mr-4 mt-4 px-4 rounded-lg text-black"
              type="text"
              placeholder="X X X X X X"
              value={userLogin.otp}
              onChange={(e) =>
                setUserLogin({
                  ...userLogin,
                  otp: e.target.value,
                })
              }
            />
            <button
              className="text-white bg-blue-600 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              type="submit"
              onClick={ClientOTPGetVerification}
            >
              Submit
            </button>

            <div className="mt-2">
              <button
                className="text-white bg-blue-600 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5  mr-2 mb-2"
                onClick={ClientPostResendOTP}
              >
                Resend OTP
              </button>
              <div className="flex gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-xs">
                  If you dont recieve OTP, click here to resend
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <div className="font-bold text-2xl mx-12 mb-8">Fill Form</div>
              <div className="mt-2 flex gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">Enter your Email Address</span>
              </div>
            </div>
            <div>
              <div className="relative z-0 mb-6 w-full group">
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={userLogin.email}
                    required
                    onChange={(e) =>
                      setUserLogin({
                        ...userLogin,
                        email: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="xxx@yyy.com"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <button
                className="text-white bg-blue-600 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5  mr-2 mb-2"
                type="submit"
                onClick={ClientPostLogin}
              >
                Accept
              </button>
            </div>
            <div className="flex justify-between text-grey-500 font-bold">
              <Link className="text-xs" to="/admin">
                Are you Admin?
              </Link>
              <Link className="text-xs" to="/">
                Home
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Userlogin;
