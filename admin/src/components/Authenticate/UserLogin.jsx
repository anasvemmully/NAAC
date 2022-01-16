import React ,{ useState } from 'react';
import { Link} from 'react-router-dom';

const Userlogin = () => {
    const [Token, setToken] = useState("");

    return (
        <div className='form-center'>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const data = {
                        token: Token
                    }
                    console.log(data);

                }}>
                    <div className='form-input' style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '2rem' }} >Fill Form</span>
                    </div>
                    <div className='form-input'>
                        <input label="Token" required onChange={(e) => setToken(e.target.value)} type="password" placeholder='Token' />
                    </div>
                    <div className='form-input' style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
                        <button className="form-button" type="submit" >Accept</button>
                    </div>
                    <Link className="form-input form-divertion" to='/admin'>Are you Admin?</Link>
                </form>
            </div>
    );
}

export default Userlogin;
