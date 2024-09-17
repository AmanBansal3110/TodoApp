import React from 'react';
import '../css/SignUp.css';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  async function signing() {
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      if(!email || !password){
        alert('Enter all fields');
        return
      }
      const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
       // Parse the response as text
      // console.log(text);
  
      // Navigate to home page if successful
      navigate('/home'); 
  
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Incorrect username or Password');
    }
  }
  
  return (
    <div className="sign-up-container">
      <div className="sign-up-card">
        <h2 className="sign-up-title">Sign In</h2>
        <input
          id='email'
          className="sign-up-input full-width"
          type="email"
          placeholder="Email"
        />
        <input
          id='password'
          className="sign-up-input full-width"
          type="password"
          placeholder="Password"
        />
        <button onClick={signing} className="sign-up-button">Sign In</button>
        <p className="sign-up-footer">
          Don't have an account?{' '}
          <a onClick={()=>navigate('/')} className="sign-up-link">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
