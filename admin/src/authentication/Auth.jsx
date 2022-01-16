import { createContext , useState , useContext , useEffect} from "react";
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState({
        isAuthenticated:false,
        isAdmin  : false,
        username: "",
        email: ""
    });
    const [error,setError] = useState(null);
    const [message,setMessage] = useState(null);

    useEffect(()=>{
        const user = localStorage.getItem('user');
        if(user){
            setUser(JSON.parse(user));
        }
    },[]);
    const Signout = () =>{
        setUser({
            isAuthenticated:false,
            isAdmin  : false,
            username: "",
            email: ""
        });
        axios.post('/api/logout').then(res=>{
            setMessage(res.data.message);
            localStorage.removeItem('user');
        }).catch(err=>{
            console.log(err);
        });
    }
    const value = { user , setUser , Signout , error , setError, message , setMessage };
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const { user, setUser } = useContext(AuthContext);
    return { user, setUser };
};

export const RequireAuth = ({ children }) => {
    let auth = useAuth();
    if (auth.user.isAuthenticated) {
        return <Navigate to="/admin/dashboard" />; 
    }  
    else{
        return children;
    }
  }

  export const RequireAuthManage = ({ children }) => {
    let auth = useAuth();
    if (auth.user.isAuthenticated && auth.user.isAdmin) {
        return children; 
    }  
    else{
        return <Navigate to="/admin" />;
    }
  }

//   