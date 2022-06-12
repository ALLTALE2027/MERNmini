import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Quote from "./components/Quote";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/quote" element={<Quote />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
