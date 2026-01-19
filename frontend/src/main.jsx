import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Dashboard from "./pages/Dashboard";
import ServiceDetail from "./pages/ServiceDetail";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/service/:id", element: <ServiceDetail /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);
