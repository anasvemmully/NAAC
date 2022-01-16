import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import AdminLogin from './components/Authenticate/AdminLogin';
import Userlogin from './components/Authenticate/UserLogin';
// import {Tree} from './components/Dashboard/Tree';
import { AuthProvider , RequireAuth , RequireAuthManage , AuthContext } from './authentication/Auth';
import { DashboardHeader , Dashboard , Manage , Create , View } from './components/Dashboard/Dashboard';

const NotFound = () => {
  const Style = {
    position:"absolute",
    left:"50%",
    top:"50%",
    transform:"translate(-50%,-50%)"
  }
  return (
    <div style={Style}>
      <span style={{fontWeight:"bold",fontSize:"4rem"}}>Error 404</span>
    </div>
  );
}

render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route index element={<Userlogin />} />
          <Route path="/admin" element={
            <RequireAuth>
              <AdminLogin/>
            </RequireAuth>
          } />
          <Route path="/admin/dashboard/" element={
            <RequireAuthManage>
              <DashboardHeader/>
            </RequireAuthManage>  
          }>
            <Route index element={<Dashboard />} />
            <Route path="manage/" element={<Manage />} />
            <Route path="create/" element={<Create />} />
            <Route path="view/:ViewId" element={<View />} />
          </Route>
          <Route path="/form/:FormId" element={<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:'4rem'}}><b>Client</b></div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
  );
  
  
  