import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onFormSubmit(e) {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCred);
    }
    catch(err) {
      console.log(err);
    }
  }
  return (
    <form onSubmit= {onFormSubmit}>
      <div className="card p-3">
        <h3 className="heading-5 text-center">Sign Up</h3>
        <div>
          <label for="signUpName">Name (Optional):</label>
          <input type="text" className="form-control mb-3" id="signUpName" />
          <label for="signUpEmail">Email:</label>
          <input 
            type="email" 
            className="form-control mb-3"
            id="signUpEmail" required
            value= {email}
            onChange= {(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <label for="signUpPassword">Password:</label>
          <input 
            type="password"
            className="form-control mb-3"
            id="signUpPassword" required
            value= {password}
            onChange= {(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <label for="signUpPassword2">Confirm password:</label>
          <input type="password" className="form-control mb-3" id="signUpPassword2" required />
          <div className="d-grid">
            <button id="signUpForm" className="btn btn-primary" style={{color: 'white'}}>Sign Up</button>
          </div>
        </div>
      </div>
    </form>
  )
}