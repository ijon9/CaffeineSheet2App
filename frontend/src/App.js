import "./style/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AppHome from "./components/AppHome";
import AddApp from "./components/AddApp";
import TableView from "./components/TableView";
import LandingPage from "./components/LandingPage";
import Home from "./components/HomePage";
import AppDetail from "./components/AppDetail";
import DSDetail from "./components/DSDetail";
import TVDetail from "./components/TVDetail";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/yourapps" element={<AppHome />} />
        <Route path="/addApp" element={<AddApp />} />
        <Route path="/app/:id" element={<AppDetail />} />
        <Route path="/app/:id/datasource/:ds" element={<DSDetail />} />
        <Route path="/app/:id/table/:tv" element={<TVDetail />} />
        <Route path="/tableView" element={<TableView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
