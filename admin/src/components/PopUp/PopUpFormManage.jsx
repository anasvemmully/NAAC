/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ClientContext } from "../../authentication/ClientAuth";

export const PopUpFormManage = ({
  setIsPopUp,
  ispopup,
  id,
  name,
  DeleteForm,
  GetTemplates,
}) => {
  const ref = useRef();
  const [deleteName, setDeleteName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [FormName, setFormName] = useState("");
  const { notify } = useContext(ClientContext);

  useEffect(() => {
    setFormName(name);
  }, []);

  useEffect(() => {
    axios
      .get(`/api/dashboard/form-complete`, {
        params: {
          id: id,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setIsChecked(res.data.check);
          setIsAccepting(res.data.accept);
        }
      })
      .catch(() => {
        notify("Something went wrong");
      });
  }, []);

  const UpdateFormName = useCallback(() => {
    axios
      .post(`/api/dashboard/form-name`, {
        id: id,
        name: FormName,
      })
      .then((res) => {
        if (res.data.success) {
          notify("Form name updated");
          GetTemplates();
        }
      })
      .catch(() => {
        notify("Something went wrong");
      });
  }, [FormName, GetTemplates, id, notify]);

  const CompleteFormCheck = useCallback((e) => {
    axios
      .post(`/api/dashboard/form-complete`, {
        id: id,
        v : e.target.checked,
      })
      .then((res) => {
        if (res.data.success) {
          setIsChecked(!isChecked);
          notify("Updated Successfully")();
        }
      })
      .catch(() => {
        notify("Something went wrong", "error")();
      });

    // setIsChecked(!isChecked);
  }, [id, isChecked, notify]);

  const AcceptingFormCheck = useCallback((e) => {
    axios
      .post(`/api/dashboard/form-accept`, {
        id: id,
        v : e.target.checked,

      })
      .then((res) => {
        if (res.data.success) {
          setIsAccepting(!isAccepting);
          notify("Updated Successfully")();
        }
      })
      .catch(() => {
        notify("Something went wrong", "error")();
      });

    // setIsChecked(!isChecked);
  }, [id, isAccepting, notify]);

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
                  className="h-6 w-6 text-white inline-block mr-3"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
                </svg>
                Manage Form
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setIsPopUp(!ispopup);
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
            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="form-name"
                  className="block mb-2 text-xs font-medium text-white"
                >
                  Form Name :
                </label>
                <div className="flex justify-between">
                  <input
                    type="text"
                    id="form-name"
                    value={FormName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10/12 p-2.5"
                    required
                  />
                  <button
                    className="bg-gray-50 p-2 rounded"
                    onClick={UpdateFormName}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-white flex gap-1 items-center">
                <div>
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
                </div>
                <div className="text-sm">
                  Type "<b>Delete {name}</b>" to confirm deletion
                </div>
              </div>
              <div className="flex mt-3">
                <span
                  onClick={() => {
                    DeleteForm(id, ref.current, `Delete ${name}`)();
                    setIsPopUp(!ispopup);
                  }}
                  className="cursor-pointer group hover:bg-red-300 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 group-hover:text-red-700 text-slate-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  ref={ref}
                  value={deleteName}
                  onChange={(e) => setDeleteName(e.target.value)}
                  className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="my-6">
                <label
                  htmlFor="toggle-example"
                  className="flex relative items-center mb-4 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="toggle-example"
                    className="sr-only"
                    checked={isChecked}
                    onChange={CompleteFormCheck}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
                  <span className="flex items-center gap-1 ml-3 text-xs font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>Form is public, completed !</div>
                  </span>
                </label>
              </div>
              <div className="my-6">
                <label
                  htmlFor="accept-example"
                  className="flex relative items-center mb-4 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="accept-example"
                    className="sr-only"
                    checked={isAccepting}
                    onChange={AcceptingFormCheck}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
                  <span className="flex items-center gap-1 ml-3 text-xs font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>Form is Accepting</div>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
