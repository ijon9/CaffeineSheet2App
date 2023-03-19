import "./style/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AppHome from "./components/AppHome";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/yourapps" element={<AppHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
