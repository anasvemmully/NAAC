import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../authentication/Auth';
import { Tree } from './Tree';


export const Dashboard = () => {
    const { Signout } = useContext(AuthContext);
    const [templates, setTemplates] = useState(null);
    const [ActiveTemplate, setActiveTemplate] = useState(null);

    useEffect(() => {
        axios.get('/api/dashboard').then(res => {
            if (res.data.isAuthenticated) Signout();
            else {
                setTemplates(res.data.template);
                setActiveTemplate(res.data.activeTemplate);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [Signout]);
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-6 gap-4'>
            {templates && templates.map((e, index) => (
                <div className="bg-slate-50 p-4 rounded group" onClick={(e) => console.log(e)}>
                    <Link to={`/admin/dashboard/view/${e.id}`} className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base ">
                        <div key={index}>
                            <div>
                                <div>{e.name}</div>
                                <div>{e.updatedAt}</div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
            {ActiveTemplate ?
                <div className="bg-slate-50 p-4 rounded group">
                    <Link to="/admin/dashboard/create/" className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base ">
                        <span className='text-slate-600 group-hover:text-blue-500'>{ ActiveTemplate.name }</span>
                    </Link>
                </div>
                :
                <div className="bg-slate-50 p-4 rounded group">
                    <Link to="/admin/dashboard/create/" className="group-hover:border-blue-500 group-hover:border-solid px-10 py-6 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-base ">
                        <svg className="group-hover:text-blue-500 mb-1 text-slate-400" width="20" height="20" fill="currentColor" aria-hidden="true">
                            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                        </svg>
                        <span className='text-slate-600 group-hover:text-blue-500'>New Form</span>
                    </Link>
                </div>
            }
        </div>
    )
}




export const Manage = () => {
    return (
        <>Users Section role are Managed here!!!</>
    );
}

export const Create = () => {
    // const { Signout } = useContext(AuthContext);
    // if (res.data.isAuthenticated) Signout();

    return (
        <Tree/>
    );
}

export const View = () => {
    return (
        <>Forms View are amde here Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam tempora sequi ipsa!</>
    );
}

export const DashboardHeader = () => {
    const { user, Signout } = useContext(AuthContext);
    return (
        <div className='font-sans bg-[#081D60]'>
            <div className='bg-white border-b-2 border-gray-300 py-6'>
                <div className='px-12 flex justify-between'>
                    <div className='flex gap-x-12'>
                        <NavLink to="/admin/dashboard/" className={({ isActive }) => isActive ? "font-bold underline underline-offset-8" : "font-normal hover:underline hover:underline-offset-8"} >
                            <div>
                                DashBoard
                            </div>
                        </NavLink>
                        <NavLink to="/admin/dashboard/manage" className={({ isActive }) => isActive ? "font-bold underline underline-offset-8" : "font-normal hover:underline hover:underline-offset-8"}>
                            <div>
                                Manage
                            </div>
                        </NavLink>
                    </div>
                    <div className='flex gap-x-12'>
                        <div>
                            <span>Hi {user.username}</span>
                        </div>
                        <button onClick={Signout} className='px-3'>
                            <i className="fa fa-sign-out" aria-hidden="true"></i>
                            <span className='pl-2'>Sign out</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='px-12 py-8'>
                <Outlet />
            </div>
        </div>
    );
}

                // <div className='md:container mx-auto px-2 flex gap-x-24 py-6 '>
                //     <Outlet />
                // </div>

// bg-[#081D60]