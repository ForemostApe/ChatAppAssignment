import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Register from "./components/register/Register.jsx";
import Chat from "./chat/Chat.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/chat",
    element: <Chat />,
    errorElement: <div>404 Not Found</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
