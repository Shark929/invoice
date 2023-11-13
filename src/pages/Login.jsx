import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
      
  const onLogin = (e) => {
      e.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigate("/")
          console.log(user);
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
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
            <h1>GNT Invoice Login</h1>                            
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
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required                                 
                        placeholder="Password"              
                    />
                    </div>   
                                        
                    <div>
                      <button      
                        style={{
                          backgroundColor: '#4DA9FF',
                          width: '270px',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '10px',
                          color: 'white'
                        }}                  
                        onClick={onLogin}                                        
                      >      
                          Login                                                                  
                      </button>
                    </div>                               
                </form>
                
                <p className="text-sm text-white text-center">
                    No account yet? {' '}
                    <NavLink to="/register">
                        Register
                    </NavLink>
                </p>
                                            
            </div>
        </section>
    </main>
  )
}

export default Login