import "./style/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AppHome from "./components/AppHome";
import AddApp from "./components/AddApp";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/yourapps" element={<AppHome />} />
        <Route path="/addApp" element={<AddApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
