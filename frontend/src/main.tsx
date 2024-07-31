import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { NotifierContextProvider } from "./context/NotifierContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotifierContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </NotifierContextProvider>
  </React.StrictMode>
);
