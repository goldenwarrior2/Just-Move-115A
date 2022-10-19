import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [username, setName] = useState('');
  const navigate = useNavigate();

  async function onFormSubmit(e) {
    e.preventDefault();
    if (password !== password2) {
      // TODO: Display some error to the user
      // Also probably add is-invalid onBlur
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCred);
      // TODO: Store user name into a document
      // Should probably handle this with onAuthStateChanged
      navigate('/userhome');
    }
    catch (err) {
      // TODO: Display some error to the user
      // Will probably need a switch statement to convert to a user-friendly error
      console.log(err);
    }
  }
  return (
    <form onSubmit={onFormSubmit}>
      <div className="card p-3">
        <h3 className="heading-5 text-center">Sign Up</h3>
        <div>
          <label htmlFor="signUpName">Name (Optional):</label>
          <input type="text" className="form-control mb-3" id="signUpName" value={username} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="signUpEmail">Email:</label>
          <input
            type="email"
            className="form-control mb-3"
            id="signUpEmail" required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <label htmlFor="signUpPassword">Password:</label>
          <input
            type="password"
            className="form-control mb-3"
            id="signUpPassword" required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <label htmlFor="signUpPassword2">Confirm password:</label>
          <input type="password" className="form-control mb-3" id="signUpPassword2" required
            value={password2} onChange={(e) => setPassword2(e.target.value)} />
          <div className="d-grid">
            <button id="signUpForm" type="submit" className="btn btn-primary" style={{ color: 'white' }}>Sign Up</button>
          </div>
        </div>
      </div>
    </form>
  )
}
