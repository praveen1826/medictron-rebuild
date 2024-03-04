import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import General from "../components/General";
import Diabetes from "../components/Diabetes";
import Parkinson from "../components/Parkinson";

function App() {
  return (
    <>
      <BrowserRouter>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
          }}
        >
          <NavigationBar />
          <Routes>
            <Route path="/" Component={General} />
            <Route path="/diabetes" Component={Diabetes} />
            <Route path="/parkinson" Component={Parkinson} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
