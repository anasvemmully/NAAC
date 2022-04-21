/* eslint-disable array-callback-return */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useParams } from "react-router-dom";
import { ClientContext } from "../../authentication/ClientAuth";

// import { Scrollspy } from "@makotot/ghostui";
// import Scrollspy from "react-scrollspy";

import { FileUploadPopUp } from "../PopUp/FileUploadPopUp";

// import { Scrollspy } from "@makotot/ghostui";

export const DashboardClient = () => {
  const { notify, Signout } = React.useContext(ClientContext);

  const [MemberTemplate, setMemeberTemplate] = useState([]);
  const [SearchTemplate, setSearchTemplate] = useState([]);

  useEffect(() => {
    axios.get(`/api/d/dashboard`).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setMemeberTemplate(res.data.template);
        setSearchTemplate(res.data.template);
      } else {
        notify(res.data.message)();
        Signout();
      }
    });
  }, [Signout, notify]);

  const filterRoles = React.useCallback(
    (e) => {
      setSearchTemplate(
        MemberTemplate.filter((member) =>
          member.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    },
    [MemberTemplate]
  );

  return (
    <>
      <div>
        <div className="my-4 pl-4 text-white underline underline-offset-4">
          <span>Fill the form : </span>
        </div>
        <div className="my-8 sm:w-2/4 lg:w-1/4">
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              onChange={filterRoles}
            />
          </div>
        </div>
        <div className="overflow-x-scroll sm:overflow-x-hidden pb-4 flex sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 mb-8">
          {SearchTemplate &&
            SearchTemplate.map((e, index) => {
              return (
                <div key={index} className="bg-slate-50 p-4 rounded group">
                  <Link
                    to={`/d/dashboard/manage/${e.id}`}
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
    </>
  );
};

export const FillClient = () => {
  const { Signout } = React.useContext(ClientContext);

  const [template, setTemplate] = useState([]);
  const { templateid } = useParams();

  useEffect(() => {
    axios.post(`/api/d/dashboard`, { templateid: templateid }).then((res) => {
      console.log(res.data);
      if (res.data.success) {
        setTemplate(res.data.template);
      } else {
        Signout();
      }
    });
  }, [Signout, templateid]);

  // const items = () => template?.layout
  //   .map((e, i) => {
  //     if (e.type === "section") {
  //       return `section-${i}`;
  //     }
  //   })
  //   .filter((e) => e !== undefined);

  return (
    // <Scrollspy sectionRefs={sectionRefs}>
    //   {({ currentElementIndexInViewport }) => (
    <div className="flex flex-col-reverse lg:flex-row gap-x-8 text-white">
      <div className="basis-8/12 lg:border-r-2 lg:border-white lg:pr-6">
        {template && (
          <div className="pl-1 lg:pl-4">
            <div className="font-semibold text-xl">{template.name}</div>
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
              <div className="text-xs">Upload files in to the form !</div>
            </div>
          </div>
        )}
        <div className="pl-1 lg:pl-4">
          {/* scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 max-h-96 supports-scrollbars:pr-2 lg:max-h-96 */}
          {template &&
            template.layout?.map((e, i) => (
              <TemplateView key={e.index} data={e} id={`section-${i}`} />
            ))}
        </div>
      </div>
      <div className="basis-4/12 hidden lg:block">
        <div className="sticky top-8 rounded p-4 mb-2">
          <div>
            <span className="font-semibold">Table of Contents : </span>
            {/* {template?.layout && (
              <Scrollspy
                offset={0}
                items={items()}
                currentClassName="font-bold border-slate-100"
              > */}
            {template.layout &&
              // eslint-disable-next-line array-callback-return
              template.layout.map((e, i) => {
                if (e.type === "section") {
                  return (
                    <li
                      style={{
                        marginLeft: `${e.level * 1.6}rem`,
                      }}
                      key={i}
                      className="text-sm py-2 pl-5 border-l-2 border-slate-500 list-none"
                    >
                      <a href={`#section-${i}`}>
                        {e.title.slice(0, 40) +
                          (e.title.length > 40 ? "..." : "")}
                      </a>
                    </li>
                  );
                }
              })}
            {/* </Scrollspy>
            )} */}
          </div>
        </div>
      </div>
    </div>
    //   )}
    // </Scrollspy>
  );
};

const TemplateView = ({ data, id }) => {
  let style = {
    marginLeft: `${data.level * 3}rem`,
  };

  if (data.type === "section") {
    return (
      <div id={id} className="flex items-center py-1" style={style}>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <div>{data.title}</div>
      </div>
    );
  } else {
    const res = {
      type: data.type,
      index: data.index,
      level: data.level,
      parent: data.parent,
      title: data.title,
    };
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
                  return <Image key={index} res={res} file_type={f} />;
                case "text":
                  return <Text key={index} res={res} file_type={f} />;
                case "excel":
                  return <Excel key={index} res={res} file_type={f} />;
                case "pdf":
                  return <Pdf key={index} res={res} file_type={f} />;
                case "web":
                  return <Web key={index} res={res} file_type={f} />;
              }
            })}
        </div>
      </div>
    );
  }
};

const Image = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
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
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Text = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
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
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Excel = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
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
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Pdf = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
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
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

const Web = ({ res, file_type }) => {
  const [PopUp2, setPopUp2] = useState(false);

  return (
    <>
      <button onClick={() => setPopUp2(true)}>
        <div className="px-1">
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
      </button>
      {PopUp2 && (
        <FileUploadPopUp
          setPopUp2={setPopUp2}
          res={res}
          file_type={file_type}
        />
      )}
    </>
  );
};

export const DashboardClientHeader = () => {
  const { user, Signout } = React.useContext(ClientContext);

  return (
    <div className="font-sans bg-[#081D60]">
      <div className="bg-white border-b-2 border-gray-300 py-6">
        <div className="px-12 flex justify-between">
          <div className="flex gap-x-12">
            <NavLink to="/d/dashboard" className="font-semibold">
              <div>DashBoard</div>
            </NavLink>
          </div>
          <div className="flex gap-x-12">
            <div className="hidden sm:block ">
              <span>Hi {user.email || "Anonymous"}</span>
            </div>
            <button onClick={Signout} className="px-3">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <span className="pl-2 hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-8 pt-10 pb-16 text-white">
        <Outlet />
      </div>
    </div>
  );
};
