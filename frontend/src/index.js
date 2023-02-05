import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Post from "./post/Post";
import Create from "./post/Create";
import Add from "./post/Add";
import Collection from "./Collection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./About";

/* Router */
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/post",
		element: <Post />,
	},
	{
		path: "/create",
		element: <Create />,
	},
	{
		path: "/add",
		element: <Add />,
	},
	{
		path: "/collection/:id",
		element: <Collection />,
	},
	{
		path: "/about",
		element: <About />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.Fragment>
		<RouterProvider router={router} />
	</React.Fragment>
);
