/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { ClientContext } from "../../authentication/ClientAuth";

import { useParams } from "react-router-dom";

const Icon = ({ file_type }) => {
  // eslint-disable-next-line default-case
  if (file_type === "image") {
    return (
      <div className="px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
  } else if (file_type === "text") {
    return (
      <div className="px-1">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    );
  } else if (file_type === "excel") {
    return (
      <div className="px-1">
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
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  } else if (file_type === "pdf") {
    return (
      <div className="px-1">
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
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  } else if (file_type === "web") {
    return (
      <div className="px-1">
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
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </div>
    );
  }
};

export const FileUploadPopUp = ({ setPopUp2, res, file_type }) => {
  const { type, index, level, parent, title } = res;

  const { notify, Signout } = React.useContext(ClientContext);

  const [file, setFile] = useState(null);
  const [webLink, setWebLink] = useState("");

  const templateid = useParams().templateid;

  const UploadFile = React.useCallback(
    (e) => {
      e.preventDefault();
      const data = new FormData();
      data.append("file", file);
      data.append(
        "misc",
        JSON.stringify({
          templateid: templateid,
          index: index,
        })
      );

      if (file) {
        axios
          .post("/api/d/upload/", data, {
            headers: {
              // "Content-Type": "multipart/form-data",
              "Content-Type": "application/octet-stream",
            },
          })
          .then((res) => {
            if (res.data.success) {
              setPopUp2(false);
              notify(res.data.message)();
            } else {
              notify(res.data.message)();
              Signout();
            }
          });
      }
    },
    [Signout, file, index, notify, setPopUp2, templateid]
  );
  const DownloadFile = React.useCallback(() => {
    axios
      .get("/api/d/download/", {
        params: {
          templateid: templateid,
          index: index,
          type: file_type,
        },
      })
      .then((res) => {
          console.log(res);
        // if (!res.data.success) {
        //   Signout();
        // }
        // setPopUp2(false);
        // notify(res.data.message)();
      });
  }, [file_type, index, templateid]);

  const UpdateWeb = React.useCallback(
    (e) => {
      e.preventDefault();

      if (
        webLink.match(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        )
      ) {
        // console.log(webLink);
        // console.log(webLink);
        // console.log(webLink);
        // console.log(webLink);
        // console.log(webLink);
        // console.log(webLink);
        // console.log(webLink);
        // console.log(webLink);
      }
    },
    [webLink]
  );

  const help = {
    // eslint-disable-next-line getter-return
    get file_accept_string() {
      if (file_type === "image") {
        return "image/png, image/jpeg, image/jpg";
      } else if (file_type === "text") {
        return "text/plain";
      } else if (file_type === "excel") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      } else if (file_type === "pdf") {
        return "application/pdf";
      }
    },
  };

  return (
    <div className="fixed z-50 right-0 top-0 bottom-0 backdrop-grayscale backdrop-blur-sm h-full w-full flex items-center justify-center">
      <div
        aria-hidden="true"
        // className="overflow-y-auto overflow-x-hidden fixed right-4 left-4 top-4 z-50 "
      >
        <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <div className="rounded-lg shadow bg-gray-700">
            <div className="flex  gap-52 justify-between items-start p-5 rounded-t border-b border-gray-300">
              <h3 className="flex items-center text-xl font-semibold lg:text-2xl text-white">
                <Icon file_type={file_type} />
                <div>Upload {file_type}</div>
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
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

            {file_type === "web" ? (
              <form>
                <div className="m-6 pb-6">
                  <label
                    htmlFor="website-admin"
                    className="block mb-2 text-sm font-medium "
                  >
                    Enter the {file_type} link :
                  </label>
                  <div className="flex text-slate-700">
                    <span className="inline-flex items-center px-3 text-sm bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:border-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      onChange={(e) => setWebLink(e.target.value)}
                      id="website-admin"
                      className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="http://..."
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={UpdateWeb}
                      className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <form>
                  <div className="p-6 text-white">
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="user_avatar"
                    >
                      Upload {file_type} :
                    </label>
                    <input
                      className="block w-full text-sm font-bold rounded-lg bg-red-500 border border-gray-300 cursor-pointer focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      aria-describedby="user_avatar_help"
                      id="user_avatar"
                      accept={help.file_accept_string}
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <div
                      className="flex items-center gap-2 mt-4 text-xs"
                      id="user_avatar_help"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-white-500 font-bold">
                        Upload/Re-upload the {file_type}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={UploadFile}
                      className="mt-4 flex items-center gap-2 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Upload</span>
                    </button>
                  </div>
                </form>
                <div className="mx-6 mb-6 py-6 text-white border-t-4 border-slate-400 border-double">
                  <span className="block mb-2 text-sm font-medium">
                    Download {file_type} :
                  </span>
                  <button
                    onClick={DownloadFile}
                    className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Download</span>
                  </button>
                  <div className="flex items-center gap-2 mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-white-500 font-bold text-xs ">
                      Download the {file_type} to view !
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// res.blob().then((blob) => {
//   let url = window.URL.createObjectURL(blob);
//   let a = document.createElement("a");
//   a.href = url;
//   a.download = "test.pdf";
//   a.click();
// });
// const blob = await res.blob();
// download(blob, "test.pdf");
