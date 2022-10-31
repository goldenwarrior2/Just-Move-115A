import { useState } from 'react';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function onFormSubmit(e) {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCred);
      navigate('/userhome');
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <form onSubmit={onFormSubmit}>
      <div className="card p-3">
        <h3 className="heading-5 text-center">Log In</h3>
        <div>
          <label htmlFor="loginEmail">Email:</label>
          <input
            type="email"
            className="form-control mb-3"
            id="loginEmail" required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <label htmlFor="loginPassword">Password:</label>
          <input
            type="password"
            className="form-control mb-3"
            id="loginPassword" required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className="d-grid">
            <button id="loginForm" type="submit" className="btn btn-primary" style={{ color: 'white' }}>Log In</button>
          </div>
        </div>
      </div>
    </form>
  )
}
