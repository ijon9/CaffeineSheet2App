import "./style/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AppHome from "./components/AppHome";
import AddApp from "./components/AddApp";
import AddDataSource from "./components/AddDataSource";
import Application from "./components/Application"
import TableView from "./components/TableView"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/yourapps" element={<AppHome />} />
        <Route path="/addApp" element={<AddApp />} />
        <Route path="/addDataSource" element={<AddDataSource />} />
        <Route path="/openApp" element={<Application />} />
        <Route path="/tableView" element={<TableView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
