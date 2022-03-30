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

  const { notify  , setUser } = React.useContext(ClientContext);


  const ClientPostLogin = React.useCallback(
    (e) => {
      e.preventDefault();
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
          } else {
            setUserLogin({
              ...userLogin,
              email: "",
            });
            notify(res.data.message)();
          }
        });
    },
    [notify, userLogin]
  );

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
            }
            setUser(USER);
            localStorage.setItem("U3/r" , btoa(JSON.stringify(USER)));
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
          } else {
            notify(res.data.message)();
          }
        });
    },
    [notify, userLogin]
  );

  return (
    <div className="form-center">
      <form onSubmit={ClientPostLogin}>
        {userLogin.emailok ? (
          <div>
            <h1 className="font-bold">Enter OTP</h1>
            <input
              className="mr-4 mt-4 px-4"
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
            <button type="submit" onClick={ClientOTPGetVerification}>
              Submit
            </button>
            <div className="mt-6">
              <button onClick={ClientPostResendOTP}>Resend OTP</button>
            </div>
          </div>
        ) : (
          <>
            <div
              className="form-input"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <span style={{ fontWeight: "bold", fontSize: "2rem" }}>
                Fill Form
              </span>
            </div>
            <div className="form-input">
              <input
                value={userLogin.email}
                required
                onChange={(e) =>
                  setUserLogin({
                    ...userLogin,
                    email: e.target.value,
                  })
                }
                type="text"
                placeholder="xyz@gmail.com"
              />
            </div>
            <div
              className="form-input"
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "2rem",
              }}
            >
              <button className="form-button" type="submit">
                Accept
              </button>
            </div>
            <Link className="form-input form-divertion" to="/admin">
              Are you Admin?
            </Link>
          </>
        )}
      </form>
    </div>
  );
};

export default Userlogin;
