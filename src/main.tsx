import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import Todolist from "./pages/TodoList/Todolist";
import Github from "./pages/Github/Github";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Todolist />,
  },
  {
    path: "/github",
    element: <Github />,
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
