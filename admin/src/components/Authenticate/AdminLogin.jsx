import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/Auth';
import { AuthContext } from '../../authentication/Auth';



export default function AdminLogin() {
    const { error, setError , message } = useContext(AuthContext);

    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [AdminCredentials, setAdminCredentials] = useState({
        username: "",
        password: ""
    });
    const Loginhandler = (event) => {
        event.preventDefault();
        axios.post("/api/login", AdminCredentials)
        .then((response) => {
            if (response.status === 200) {
                setError(null);
                setUser(response.data.data);
                localStorage.setItem('user', JSON.stringify(response.data.data));
                navigate("/admin/dashboard");
            }
        })
        .catch(err => setError(err.response.data.message));
    }
    return (
        <div className='form-center'>
            <form onSubmit={Loginhandler}>
                <div className='form-input' style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '2rem' }} >Login</span>
                </div>
                {error && <div className='form-input' style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <span style={{ fontSize: '0.8rem', color: "red" }} >{error}</span>
                </div>}
                {message && <div className='form-input' style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <span style={{ fontSize: '0.8rem', color: "green" }} >{message}</span>
                </div>}
                <div className='form-input'>
                    <input label="Username" required onChange={(e) => setAdminCredentials({ ...AdminCredentials, username: e.target.value })} type="text" placeholder='Username' />
                </div>
                <div className='form-input'>
                    <input type="password" required onChange={(e) => setAdminCredentials({ ...AdminCredentials, password: e.target.value })} label="password" placeholder='Password' />
                </div>
                <div className='form-input'>
                    <button className="form-button" type="submit">Login</button>
                </div>
                <Link className="form-input form-divertion" to='/'>Got a form to fill?</Link>

            </form>
        </div>
    );
}