import React from "react";
import Home from "./components/Home";
import { AuthProvider } from "./context/AuthContext";

import "./css/style.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Home />
      </AuthProvider>
    </div>
  );
}

export default App;
