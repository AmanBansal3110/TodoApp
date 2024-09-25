import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SignUp.css'; // Importing the enhanced custom CSS file

function SignUp() {
  const navigate = useNavigate();
  async function register(){
    try{

      const firstname = document.getElementById('firstname').value
      const lastname = document.getElementById('lastname').value
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      
      if (!firstname || !lastname || !email || !password) {
        alert('All fields are required. Please fill out every field.');
        return; // Stop further execution if validation fails
      }
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, password }),
        credentials: 'include' // Ensure cookies are included
      });

      if (!response.ok) {
        // Check the status code and throw an error if not 200 OK
        const errorData = await response.json(); // or response.text() based on server response
        throw new Error(errorData.error || 'Registration failed');
      }
      
     // Parse the response as text
    navigate('/home'); 
    
  } catch (error) {
    alert('Account already exist');
  }
}

  return (
    <div className="sign-up-container">
      <div className="sign-up-card">
        <h2 className="sign-up-title">Create an Account</h2>
        {/* <form action="http://localhost:3000/register"> */}
        <div className="input-group">
          <input
            id='firstname'
            className="sign-up-input"
            type="text"
            placeholder="First Name"
            name='firstname'
            />
          <input
            id='lastname'
            className="sign-up-input"
            type="text"
            placeholder="Last Name"
            name='lastname'
            />
        </div>
        <input
          id='email'
          className="sign-up-input full-width"
          type="email"
          placeholder="Email"
          name='email'
          />
        <input
          id='password'
          className="sign-up-input full-width"
          type="password"
          placeholder="Password"
          name='password'
          />
        <button onClick={register} className="sign-up-button">Sign Up</button>
        {/* </form> */}
        <p className="sign-up-footer">
          Already have an account?{' '}
          <a onClick={()=>navigate('/SignIn')} className="sign-up-link">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
