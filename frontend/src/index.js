import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Post from "./post/Post";
import Create from "./post/Create";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.Fragment>
		<RouterProvider router={router} />
	</React.Fragment>
);
