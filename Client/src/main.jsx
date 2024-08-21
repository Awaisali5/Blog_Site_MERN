import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage.jsx";
import Layout from "./Components/Layout.jsx";
import Home from "./Pages/Home.jsx";
import PostDetails from "./Pages/PostDetails.jsx";
import Authors from "./Pages/Authors.jsx";
import CategoryPosts from "./Pages/CategoryPosts.jsx";
import AuthorPosts from "./Pages/AuthorPosts.jsx";
import EditPost from "./Pages/EditPost.jsx";
import DeletePost from "./Pages/DeletePost.jsx";
import Logout from "./Pages/Logout.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import UserProfile from "./Pages/UserProfile.jsx";
import CreatePost from "./Pages/CreatePost.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import UserProvider from "./context/userContext.jsx";

// router
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider> <Layout /></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "posts/:id",
        element: <PostDetails />,
      },
      {
        path: "register",
        element: <Register />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "Profile/:id",
        element: <UserProfile />,
      },
      {
        path: "authors",
        element: <Authors />,
      },
      {
        path: "create",
        element: <CreatePost />,
      },
      {
        path: "posts/categories/:category",
        element: <CategoryPosts />,
      },
      {
        path: "posts/users/:id",
        element: <AuthorPosts />,
      },

      {
        path: "myposts/:id",
        element: <Dashboard />,
      },
      {
        path: "posts/:id/edit",
        element: <EditPost />,
      },
      {
        path: "posts/:id/delete",
        element: <DeletePost />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
