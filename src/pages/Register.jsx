import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase/config';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault()
   
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          navigate("/login")
          // ...
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
      });

 
  }

  return (
    <main 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        overflow: 'hidden',
      }}
    >        
      <section>
        <div>
            <div>                  
                <h1>GNT Invoice Register</h1>                                                                            
                <form>                                                                                            
                    <div>
                        <input
                            style={{
                              marginBottom: '10px',
                              padding: '8px',
                              width: '250px'
                            }}
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}  
                            required                                    
                            placeholder="Email"                                
                        />
                    </div>
                    <div>
                        <input
                            style={{
                              marginBottom: '10px',
                              padding: '8px',
                              width: '250px'
                            }}
                            type="password"
                            label="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required                                 
                            placeholder="Password"              
                        />
                    </div>                                             
                    <button
                        style={{
                          backgroundColor: '#4DA9FF',
                          width: '270px',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '10px',
                          color: 'white'
                        }}
                        type="submit" 
                        onClick={onSubmit}                        
                    >  
                        Register                                
                    </button>
                                                                     
                </form>
                <p>
                    Already have an account?{' '}
                    <NavLink to="/login" >
                        Login
                    </NavLink>
                </p>                   
            </div>
        </div>
      </section>
    </main>
  )
}

export default Register