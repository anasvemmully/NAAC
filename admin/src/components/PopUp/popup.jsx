/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext, useCallback } from "react";
import { TreeContext } from "../../Contexts/TreeContext";
import "flowbite";

// TODO : pop up  width and height fixing
// TODO : publishing form
// TODO : changes pending for uploading status
// TODO : succesfuly uplooaded status

const Popup = (props) => {
  const { data, setPopup, smartDelete } = props;

  const { treeData, SET_TREE_DATA } = useContext(TreeContext);
  const [Data, setData] = useState({
    title: "",
    type: "",
    parent: "",
    level: "",
    index: "",
    data: null,
  });

  const checkBoxHandler = useCallback(
    (e) => {
      const { name, checked } = e.target;

      setData({
        ...Data,
        data: {
          ...Data.data,
          [name]: checked,
        },
      });
    },
    [Data]
  );

  useEffect(() => {
    setData(data);
  }, [data]);

  const isDataAvailable = (name) => {
    if (Data.data === null) return false;
    else if (Data.data?.[name] === undefined) return false;
    else return Data.data?.[name];
  };

  const help = {
    get isChildrenAvailable() {
      if (treeData.length === 1) return false;
      else if (treeData.length === Data.index + 1) return false;
      else if (treeData[Data.index + 1].level === Data.level + 1) return true;
      else return false;
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
            <div className="flex justify-between items-start p-5 rounded-t border-b border-gray-300">
              <h3 className="text-xl font-semibold lg:text-2xl text-white">
                <svg
                  className="h-6 w-6 text-white inline-block mr-3"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
                </svg>
                {Data.title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => {
                  setPopup(false);
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
            <div className="p-6 space-y-6 text-white ">
              <div className="relative z-0 mb-6 w-full group ">
                <input
                  type="text"
                  name="title"
                  value={Data.title}
                  onChange={(e) => {
                    setData({ ...Data, title: e.target.value });
                  }}
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="title"
                  className="absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Title
                </label>
              </div>

              <label
                htmlFor="toggle-section"
                className={
                  "flex relative items-center mb-2 " +
                  (help.isChildrenAvailable === true
                    ? "cursor-not-allowed"
                    : "cursor-pointer")
                }
              >
                <input
                  type="checkbox"
                  disabled={help.isChildrenAvailable === true ? "disabled" : ""}
                  checked={Data.type === "section" ? "checked" : ""}
                  id="toggle-section"
                  className="sr-only"
                  onChange={(e) => {
                    setData({
                      ...Data,
                      type: e.target.checked ? "section" : "item",
                      // data  : e.target.checked ? null : Data.data,
                    });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
                <span className="ml-3 text-sm font-medium text-white dark:text-gray-300">
                  Is this a Section ?
                </span>
              </label>
              {help.isChildrenAvailable === true ? (
                <p className="text-red-400 font-bold text-sm">
                  <svg
                    className="mr-1 w-5 h-5 inline-block text-red-400"
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
                  There are already items in this section !
                </p>
              ) : (
                ""
              )}

              {Data.type === "item" ? (
                <div className="flex flex-col">
                  <p className="text-white font-bold text-xs pb-2 w-full">
                    Choose Type :
                  </p>
                  <div className="grid grid-cols-3 gap-x-3">
                    <div className="items-center mb-4  ">
                      <input
                        id="checkbox-image"
                        aria-describedby="checkbox-image"
                        type="checkbox"
                        name="image"
                        checked={isDataAvailable("image") ? "checked" : ""}
                        onChange={checkBoxHandler}
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-image"
                        className="ml-3 text-xs cursor-pointer"
                      >
                        IMAGE
                      </label>
                    </div>
                    <div className="flex items-center mb-4  ">
                      <input
                        id="checkbox-excel"
                        aria-describedby="checkbox-excel"
                        type="checkbox"
                        name="excel"
                        checked={isDataAvailable("excel") ? "checked" : ""}
                        onChange={checkBoxHandler}
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-excel"
                        className="ml-3 text-xs cursor-pointer"
                      >
                        EXCEL
                      </label>
                    </div>
                    <div className="flex items-center mb-4  ">
                      <input
                        id="checkbox-pdf"
                        aria-describedby="checkbox-pdf"
                        type="checkbox"
                        name="pdf"
                        checked={isDataAvailable("pdf") ? "checked" : ""}
                        onChange={checkBoxHandler}
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-pdf"
                        className="ml-3 text-xs cursor-pointer"
                      >
                        PDF
                      </label>
                    </div>
                    <div className="flex items-center mb-4 ">
                      <input
                        id="checkbox-text"
                        aria-describedby="checkbox-text"
                        type="checkbox"
                        name="text"
                        checked={isDataAvailable("text") ? "checked" : ""}
                        onChange={checkBoxHandler}
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-text"
                        className="ml-3 text-xs cursor-pointer"
                      >
                        TEXT
                      </label>
                    </div>
                    <div className="flex items-center mb-4 ">
                      <input
                        id="checkbox-web"
                        aria-describedby="checkbox-web"
                        type="checkbox"
                        name="web"
                        checked={isDataAvailable("web") ? "checked" : ""}
                        onChange={checkBoxHandler}
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-web"
                        className="ml-3 text-xs cursor-pointer"
                      >
                        WEB
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center p-6 pb-3 space-x-2 rounded-b border-t border-white-300 ">
              <button
                type="button"
                onClick={() => {
                  treeData[Data.index] = {
                    title: Data.title,
                    type: Data.type,
                    parent: Data.parent,
                    level: Data.level,
                    data: Data.type === "section" ? null : Data.data,
                  };
                  SET_TREE_DATA([...treeData]);
                  setPopup(false);
                  // setData({
                  //   title: "",
                  //   type: "",
                  //   parent: "",
                  //   level: "",
                  // });
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => {
                  smartDelete();
                  setPopup(false);
                }}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
              >
                Delete
              </button>
            </div>
            {help.isChildrenAvailable === true ? (
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
                Deleting this item will also delete all its children.
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
