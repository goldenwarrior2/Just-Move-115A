import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAndRegisterPage } from "./components/login and register/LoginAndRegisterPage";
import { UserHomePage } from "./components/UserHomePage/UserHomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAndRegisterPage />}></Route>
        <Route path="/userhome" element={<UserHomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;