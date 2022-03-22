import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { AuthContext } from "../../authentication/Auth";
import { Tree } from "./Tree";

// import Card from "./Card";

export const Dashboard = () => {
  const { Signout } = useContext(AuthContext);
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dashboard")
      .then((res) => {
        if (res.data.isAuthenticated) Signout();
        else {
          setTemplates(res.data.Template);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Signout]);

  return (
    <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-6 gap-4 mt-4 mb-8">
          <div className="bg-slate-50 p-4 rounded group">
            <Link
              to="/admin/dashboard/create/000000000000000000000000"
              className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base "
            >
              <svg
                className="group-hover:text-blue-500 mb-1 text-slate-400"
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              <span className="font-semibold text-slate-600 group-hover:text-blue-500">
                New Form
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="my-4 pl-4 text-white underline underline-offset-4">
          <span>Recent Work</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-6 gap-4 mt-4 mb-8">
          {templates &&
            templates
              .filter((e) => e.islive === false && e.isActive === true)
              .map((e, index) => {
                return (
                  <div key={index} className="bg-slate-50 p-4 rounded group">
                    <Link
                      to={`/admin/dashboard/create/${e._id}`}
                      className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base "
                    >
                      <span className="font-semibold text-slate-600 group-hover:text-blue-500">
                        {e.name}
                      </span>
                    </Link>
                  </div>
                );
              })}
        </div>
      </div>
      <div>
        <div className="mt-4 pl-4 text-white underline underline-offset-4">
          <span>Published Forms</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-6 gap-4 mt-4 mb-8">
          {templates &&
            templates
              .filter((e) => e.islive === true && e.isActive === false)
              .map((e, index) => {
                return (
                  <div
                    key={index}
                    className="bg-slate-50 p-4 rounded group"
                    // onClick={(e) => console.log(e)}
                  >
                    <Link
                      to={`/admin/dashboard/view/${e._id}`}
                      className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base "
                    >
                      <div key={index}>
                        <div>
                          <div className="font-semibold">{e.name}</div>
                          <div className="text-xs">{e.updatedAt}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export const Create = () => {
  // const { Signout } = useContext(AuthContext);
  // if (res.data.isAuthenticated) Signout();

  return <Tree />;
};

export const View = () => {
  return (
    <>
      Forms View are amde here Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Quam tempora sequi ipsa!
    </>
  );
};

export const DashboardHeader = () => {
  const { user, Signout } = useContext(AuthContext);
  return (
    <div className="font-sans bg-[#081D60]">
      <div className="bg-white border-b-2 border-gray-300 py-6">
        <div className="px-12 flex justify-between">
          <div className="flex gap-x-12">
            <NavLink
              to="/admin/dashboard/"
              className={({ isActive }) =>
                isActive
                  ? "font-bold underline underline-offset-8"
                  : "font-normal hover:underline hover:underline-offset-8"
              }
            >
              <div>DashBoard</div>
            </NavLink>
            <NavLink
              to="/admin/dashboard/manage"
              className={({ isActive }) =>
                isActive
                  ? "font-bold underline underline-offset-8"
                  : "font-normal hover:underline hover:underline-offset-8"
              }
            >
              <div>Manage</div>
            </NavLink>
          </div>
          <div className="flex gap-x-12">
            <div>
              <span>Hi {user.username}</span>
            </div>
            <button onClick={Signout} className="px-3">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <span className="pl-2">Sign out</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-12 py-8">
        <Outlet />
      </div>
    </div>
  );
};

//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES
//MANAGE ROUTES

const Popup = ({ setPopUp }) => {
  const [members, setMembers] = useState([]);
  const [add, setAdd] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("/api.user GET calling");
    axios
      .get("/api/user")
      .then((res) => {
        console.log(res.data.user);
        setMembers(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const AddUserMember = () => {
    axios
      .post("/api/user", {
        userAdd: add,
      })
      .then((res) => {
        if (res.data.success) {
          console.log("email added");
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  console.log(members);

  return (
    <div className="fixed z-50 right-0 top-0 bottom-0 backdrop-grayscale backdrop-blur-sm h-full w-full flex items-center justify-center">
      <div
        aria-hidden="true"
        // className="overflow-y-auto overflow-x-hidden fixed right-4 left-4 top-4 z-50 "
      >
        <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <div className="rounded-lg shadow bg-gray-700">
            <div className="flex justify-between items-start p-5 rounded-t border-b border-gray-300">
              <h3 className="text-xl font-semibold lg:text-2xl text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="pl-2 pr-8">Manage User</span>
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setPopUp(false);
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="">
              {members &&
                members.map((e, index) => {
                  return <span key={index}>{e}</span>;
                })}
            </div>
            <div className="flex gap-3">
              <div className="relative z-0 my-6 px-6">
                <input
                  type="email"
                  value={add}
                  onChange={(e) => {
                    setAdd(e.target.value);
                  }}
                  name="floating_email"
                  className="text-white block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="floating_email"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:translate-x-6"
                >
                  Email address
                </label>
              </div>
              <button
                onClick={() => {
                  AddUserMember();
                  setAdd("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </button>
            </div>
            <div>
              {error && (
                <p className="p-6 pt-3 text-red-400 font-bold text-sm">
                  <svg
                    className="mr-1 w-5 h-5 inline-block text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Add a valid email address !
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Manage = () => {
  const { Signout } = useContext(AuthContext);
  const [templates, setTemplates] = useState(null);
  const [PopUp, setPopUp] = useState(false);

  useEffect(() => {
    axios
      .get("/api/dashboard")
      .then((res) => {
        if (res.data.isAuthenticated) Signout();
        else {
          const t = res.data.Template.filter(
            (e) => e.islive === true && e.isActive === false
          );
          setTemplates(t);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Signout]);

  // console.log(members);
  // console.log(typeof members);

  return (
    <div>
      <div>
        <div
          id="alert-additional-content-4"
          className="p-4 mb-4 bg-blue-100 rounded-lg dark:bg-yellow-200 my-4 w-fit"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="mr-2 w-5 h-5 text-blue-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div className="text-sm font-medium text-blue-700">
              Click on the form to manage it.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-6 gap-4 mt-10 mb-8">
          {templates &&
            templates.map((e, index) => {
              return (
                <div
                  key={index}
                  className="bg-slate-50 p-4 rounded group pointer cursor-pointer"
                  onClick={(e) => console.log(e)}
                >
                  <div className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base ">
                    <div key={index}>
                      <div>
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-xs">{e.updatedAt}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-row gap-x-8 text-white">
        <div className="basis-8/12 border-r-2 border-white">
          {/* //forms mannage option are visible here */}
        </div>
        <div className="basis-4/12">
          <div className="sticky top-8 bg-blue-700 rounded p-4">
            <div className="flex">
              <button
                className="mr-2"
                onClick={() => {
                  setPopUp(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <span className="font-semibold">Users</span>
              {PopUp && <Popup setPopUp={setPopUp} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// overflow-hidden lg:overflow-auto scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 max-h-96 supports-scrollbars:pr-2 lg:max-h-96

// eslint-disable-next-line no-lone-blocks
{
  /* <div>
              <div>
                {members &&
                  members.map((e, index) => {
                    <span key={index}>{e}</span>;
                  })}
              </div>
              <div className="relative my-4">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 ">
                  <button onClick={AddUserMember}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Add Email"
                />
              </div>
            </div> */
}
