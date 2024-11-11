import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import Todolist from "./pages/TodoList/Todolist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Todolist />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider
      value={defaultSystem}
      children={<RouterProvider router={router} />}
    />
  </StrictMode>
);
