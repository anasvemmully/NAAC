/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { AuthContext } from "../../authentication/Auth";
import { ClientContext } from "../../authentication/ClientAuth";

import { PopUpFormManage } from "../PopUp/PopUpFormManage";

import { Tree } from "./Tree";

import { toast } from "react-toastify";

// import Card from "./Card";

toast.configure();

export const Dashboard = () => {
  const { Signout } = useContext(AuthContext);
  const [templates, setTemplates] = useState(null);
  const { notify } = useContext(ClientContext);

  const GetTemplates = React.useCallback(() => {
    axios
      .get(`/api/dashboard`)
      .then((res) => {
        if (res.data.isAuthenticated) Signout();
        else {
          setTemplates(res.data.Template);
        }
      })
      .catch((err) => {
        Signout();
      });
  }, []);

  const DeleteForm = (id, ref, match) => {
    return () => {
      if (ref.value === match) {
        axios
          .post(`/api/dashboard/delete-form`, { id: id })
          .then((res) => {
            if (res.data.success) {
              GetTemplates();
              notify("Form Deleted")();
            }
          })
          .catch(() => {
            notify("Something Went Wrong")();
          });
      } else {
        notify("Expression not matched !", "error")();
      }
    };
  };

  useEffect(() => {
    GetTemplates();
  }, []);

  return (
    <>
      <div>
        <div className="overflow-x-scroll sm:overflow-x-hidden pb-4 flex sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 mb-8">
          <div className="bg-slate-50 p-3 rounded group ">
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
        <div className="overflow-x-scroll sm:overflow-x-hidden pb-4 flex sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 mb-8">
          {templates &&
            templates
              .filter((e) => e.islive === false && e.isActive === true)
              .map((e, index) => {
                return (
                  <div
                    key={index}
                    className="bg-slate-50 p-3 sm:p-4 rounded group"
                  >
                    <div>
                      <Link
                        to={`/admin/dashboard/create/${e._id}`}
                        className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 py-auto flex items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base"
                      >
                        <span className="font-semibold text-slate-600 group-hover:text-blue-500">
                          {e.name}
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <div>
        <div className="mt-4 pl-4 text-white underline underline-offset-4">
          <span>Published Forms</span>
        </div>
        <div className="overflow-x-scroll sm:overflow-x-hidden pb-4 flex sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 mb-8">
          {templates &&
            templates
              .filter((e) => e.islive === true && e.isActive === false)
              .map((e, index) => {
                return (
                  <Form
                    key={index}
                    index={index}
                    id={e._id}
                    name={e.name}
                    DeleteForm={DeleteForm}
                  />
                );
              })}
        </div>
      </div>
    </>
  );
};

const Form = (props) => {
  const { index, id, name, DeleteForm } = props;

  const [ispopup, setIsPopUp] = useState(false);

  return (
    <div className="bg-slate-50 p-4 rounded">
      <div className="flex flex-row gap-2 justify-between">
        <Link
          to={`/admin/dashboard/view/${id}`}
          className="grow hover:border-blue-500 hover:border-solid px-10 py-6 items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base "
        >
          <div key={index}>
            <div>
              <div className="font-semibold">{name}</div>
            </div>
          </div>
        </Link>
        <div
          onClick={() => {
            setIsPopUp(!ispopup);
          }}
          className="cursor-pointer flex group hover:border-red-500 hover:border-solid p-2 items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base"
        >
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:text-red-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      </div>
      {ispopup && (
        <PopUpFormManage
          setIsPopUp={setIsPopUp}
          DeleteForm={DeleteForm}
          ispopup={ispopup}
          name={name}
          id={id}
        />
      )}
    </div>
  );
};

export const Create = () => {
  // const { Signout } = useContext(AuthContext);
  // if (res.data.isAuthenticated) Signout();

  return <Tree />;
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
            <div className="hidden sm:block">
              <span>Hi {user.username}</span>
            </div>
            <button onClick={Signout} className="px-3">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <span className="pl-2">Sign out</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 sm:px-12 pt-10 pb-16">
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

const Popup = ({ manageTemplateId }) => {
  const [members, setMembers] = useState([]);
  const [add, setAdd] = useState("");
  const [error, setError] = useState(false);

  // const toastId = React.useRef(null);

  const { notify } = useContext(AuthContext);

  useEffect(() => {
    GetUserMember();
    // eslint-disable-next-line no-use-before-define
  }, []);

  const GetUserMember = React.useCallback(() => {
    axios
      .get(`/api/user`)
      .then((res) => {
        setMembers(res.data.user);
      })
      .catch((err) => {});
  }, []);

  const AddUserMember = React.useCallback(() => {
    axios
      .post(`/api/user`, {
        userAdd: add,
      })
      .then((res) => {
        if (res.data.success) {
          GetUserMember();
          notify(`${add} added`)();

          setError(false);
        }
      })
      .catch((err) => {
        setError(true);
        notify(`${add} error`, "error")();
      });
  }, [GetUserMember, add, manageTemplateId]);

  const AdminDeleteUser = React.useCallback(
    (e) => {
      return () => {
        axios
          .delete(`/api/user/`, {
            data: { email: e.email },
          })
          .then((res) => {
            if (res.data.success) {
              notify(`${e.email} removed`)();
              GetUserMember();
            }
          });
      };
    },
    [GetUserMember, manageTemplateId]
  );

  // const notify = (message) => {
  //   return function () {
  //     if (!toast.isActive(toastId.current)) {
  //       toastId.current = toast.success(message, {
  //         position: "top-right",
  //         transition: Slide,
  //         autoClose: 1000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: false,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     }
  //   };
  // };

  return (
    <div>
      <div>
        {members &&
          members.map((e, index) => {
            return (
              <div className="flex " key={index}>
                <button className="mr-2" onClick={AdminDeleteUser(e)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="text-sm my-1">{e.email}</div>
              </div>
            );
          })}
      </div>
      <div className="flex gap-3">
        <div className="relative z-0 mt-6 px-6">
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
            className="absolute text-sm text-white-500 dark:text-white-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white-600 peer-focus:dark:text-white-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:translate-x-6"
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
          <p className="p-6 pt-3 text-red-400 font-bold text-xs">
            <svg
              className="mr-1 w-4 h-4 inline-block text-red-400"
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
  );
};

const Role = ({ PopUp2, setPopUp2, template, index, level }) => {
  const { manageTemplateId, manageTemplate } = template;
  const [members, setMembers] = useState([]);

  const [resultMembers, setResultMembers] = useState();
  const [roles, setRoles] = useState([]);

  const { notify } = useContext(AuthContext);

  useEffect(() => {
    GetUserMember();
    GetRolesMember();
    // eslint-disable-next-line no-use-before-define
  }, []);

  const GetRolesMember = React.useCallback(async () => {
    await axios
      .post(`/api/dashboard/get-role`, {
        id: manageTemplateId,
        index: index,
      })
      .then((res) => {
        setRoles(res.data.roles);
      })
      .catch((err) => {});
  }, [index, manageTemplateId]);

  const GetUserMember = React.useCallback(async () => {
    await axios
      .get(`/api/user`)
      .then((res) => {
        setMembers(res.data.user);
      })
      .catch((err) => {});
  }, []);

  const filterRoles = React.useCallback(
    (e) => {
      const temp = members.filter((member) => {
        if (roles) {
          return (
            member.email?.includes(e.target.value) &&
            !roles.includes(member.email)
          );
        } else {
          return member.email?.includes(e.target.value);
        }
      });
      setResultMembers(temp);
    },
    [members]
  );

  const AddUserRole = React.useCallback(
    (email, index, template_id) => {
      return () => {
        var i = index + 1;
        for (i; i < manageTemplate.length; i++) {
          if (
            manageTemplate[i].level < level ||
            manageTemplate[i].level === level
          ) {
            break;
          }
        }
        axios
          .post(`/api/dashboard/role`, {
            email: email,
            start: index,
            end: i,
            template_id: template_id,
          })
          .then((res) => {
            GetRolesMember();
            notify("Role Updated");
          })
          .catch(() => {
            notify("Role Taken");
          });
      };
    },
    [GetRolesMember, level, manageTemplate]
  );

  const AdminDeleteRoleUser = React.useCallback(
    (index, role) => {
      return () => {
        axios
          .delete(`/api/dashboard/role`, {
            data: {
              id: manageTemplateId,
              index: index,
              email: role,
            },
          })
          .then((res) => {
            if (res.data.success) {
              GetRolesMember();
              notify("Updated");
            }
          })
          .catch((err) => {});
      };
    },
    [GetRolesMember, manageTemplateId]
  );

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
                <span className="pl-2 pr-8">Add User to fill the form</span>
              </h3>
              <button
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  setPopUp2(false);
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
            <div>
              <div className="mx-6 my-4">
                {roles &&
                  roles.map((role, i) => {
                    return (
                      <div
                        key={i}
                        className="flex px-3 py-1 my-2 border rounded-full"
                      >
                        <button onClick={AdminDeleteRoleUser(index, role)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <span className="text-white text-sm">{role}</span>
                      </div>
                    );
                  })}
              </div>
              <div className="mx-6 my-4">
                <label
                  htmlFor="email-adress-icon"
                  className="block mb-2 text-xs font-medium text-white"
                >
                  Search :
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="xyz@gmail.com"
                    onChange={filterRoles}
                  />
                </div>
              </div>
              <div className="mx-6 my-4 pb-4">
                {resultMembers &&
                  resultMembers.map((e, i) => {
                    return (
                      <div key={i} className="text-sm my-3 flex">
                        <button
                          onClick={AddUserRole(
                            e.email,
                            index,
                            manageTemplateId
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mx-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        {e.email}
                      </div>
                    );
                  })}
              </div>
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

  // const [PopUp, setPopUp] = useState(false);

  const [manageTemplate, setManageTemplate] = useState([]);
  const [manageTemplateName, setManageTemplateName] = useState();
  const [manageTemplateId, setManageTemplateId] = useState();

  useEffect(() => {
    axios
      .get(`/api/dashboard`)
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
        Signout();
      });
  }, [Signout]);

  const templateManage = React.useCallback(
    (id) => {
      axios
        .get(`/api/dashboard/manage/${id}`)
        .then((res) => {
          setManageTemplate(res.data.data.layout);
          setManageTemplateName(res.data.data.name);
          setManageTemplateId(res.data.data.id);
        })
        .catch(() => Signout());
    },
    [Signout]
  );

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
        <div className="overflow-x-scroll sm:overflow-x-hidden pb-4 flex sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-10 mb-8">
          {templates &&
            templates.map((e, index) => {
              return (
                <div
                  key={index}
                  className="bg-slate-50 p-4 rounded group pointer cursor-pointer"
                  onClick={() => templateManage(e._id)}
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
      <div className="flex flex-col-reverse lg:flex-row gap-x-8 text-white">
        <div className="basis-8/12 lg:border-r-2 lg:border-white lg:pr-6">
          {manageTemplateName && (
            <div className="p-1 pt-4 lg:p-4">
              <div className="font-semibold text-xl">{manageTemplateName}</div>
              <div className="flex py-1">
                <svg
                  className="mr-2 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div className="text-xs">
                  Add users to the section to manage it.
                </div>
              </div>
            </div>
          )}
          <div className="pl-4 ">
            {/* scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 max-h-96 supports-scrollbars:pr-2 lg:max-h-96 */}
            {manageTemplate &&
              manageTemplate.map((e, index) => (
                <TemplateView
                  key={index}
                  data={e}
                  index={index}
                  manageTemplate={manageTemplate}
                  manageTemplateId={manageTemplateId}
                />
              ))}
          </div>
        </div>
        <div className="basis-4/12">
          <div className="sticky top-8 bg-blue-700 rounded p-4 mb-2">
            <div>
              <span className="font-semibold">Users</span>
              <Popup />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateView = ({ data, manageTemplateId, manageTemplate, index }) => {
  const [PopUp2, setPopUp2] = useState(false);

  let style = {
    marginLeft: `${data.level * 3}rem`,
  };

  if (data.type === "section") {
    return (
      <div className="flex py-1" style={style}>
        <button
          onClick={() => {
            setPopUp2(!PopUp2);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {PopUp2 && (
          <Role
            index={index}
            setPopUp2={setPopUp2}
            PopUp2={PopUp2}
            level={data.level}
            template={{ manageTemplateId, manageTemplate }}
          />
        )}
        <div>{data.title}</div>
      </div>
    );
  } else {
    const data_types = data.data
      ? Object.keys(data.data).filter((f) => data.data[f] === true)
      : null;
    return (
      <div className="p-3 ml-7 border mb-2 rounded" style={style}>
        <div className="mb-4">{data.title}</div>
        <div className="flex justify-end	border-t border-slate-500	pt-2">
          {data_types &&
            data_types.map((f, index) => {
              // eslint-disable-next-line default-case
              switch (f) {
                case "image":
                  return (
                    <div key={index} className="px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  );
                case "text":
                  return (
                    <div key={index} className="px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  );
                case "excel":
                  return (
                    <div key={index} className="px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  );
                case "pdf":
                  return (
                    <div key={index} className="px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  );
                case "web":
                  return (
                    <div key={index} className="px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                  );
              }
            })}
        </div>
      </div>
    );
  }
};
