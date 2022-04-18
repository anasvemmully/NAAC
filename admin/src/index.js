import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import AdminLogin from "./components/Authenticate/AdminLogin";
import Userlogin from "./components/Authenticate/UserLogin";
import {
  DashboardClient,
  FillClient,
  DashboardClientHeader,
} from "./components/Dashboard/Client";

// import {Tree} from './components/Dashboard/Tree';
import {
  AuthProvider,
  RequireAuth,
  RequireAuthManage,
} from "./authentication/Auth";
import {
  RequireClient,
  RequireClientManage,
  ClientProvider,
} from "./authentication/ClientAuth";
import {
  DashboardHeader,
  Dashboard,
  Manage,
  Create,
} from "./components/Dashboard/Dashboard";

import { View } from "./components/Dashboard/AdminMangeViewTemplate";

const NotFound = () => {
  const Style = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
  };
  return (
    <div style={Style}>
      <span className="font-bold text-4xl">Error 404</span>
    </div>
  );
};

render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ClientProvider>
          <Routes>
            <Route
              index
              element={
                <RequireClient>
                  <Userlogin />
                </RequireClient>
              }
            />
            <Route
              path="/d/dashboard"
              element={
                <RequireClientManage>
                  <DashboardClientHeader />
                </RequireClientManage>
              }
            >
              <Route index element={<DashboardClient />} />
              <Route path="manage/:templateid" element={<FillClient />} />
            </Route>
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLogin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/dashboard/"
              element={
                <RequireAuthManage>
                  <DashboardHeader />
                </RequireAuthManage>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="manage/" element={<Manage />} />
              <Route path="create/:TemplateId" element={<Create />} />
              <Route path="view/:ViewId" element={<View />} />
            </Route>
            <Route
              path="/form/:FormId"
              element={
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: "4rem",
                  }}
                >
                  <b>Client</b>
                </div>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClientProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
