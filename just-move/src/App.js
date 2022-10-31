import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAndRegisterPage } from "./components/login and register/LoginAndRegisterPage";
import { UserHomePage } from "./components/UserHomePage/UserHomePage";
import { WhereToGoNow } from "./components/WhereToGoNow"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WhereToGoNow />}></Route>
        <Route path="/login" element={<LoginAndRegisterPage />}></Route>
        <Route path="/userhome" element={<UserHomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
