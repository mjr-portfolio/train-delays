import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/service/:id", element: <ServiceDetail /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
