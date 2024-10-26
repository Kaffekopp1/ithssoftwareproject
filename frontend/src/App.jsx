import Home from "./Home";
import About from "./About";
import Polls from "./Polls";
import Poll from "./Poll";
import CreatePoll from "./CreatePoll";
import "./App.css";
import {
	createHashRouter,
	Link,
	Outlet,
	RouterProvider
} from "react-router-dom";
function App() {
	const router = createHashRouter([
		{
			children: [
				{ element: <Home />, path: "/" },
				{ element: <About />, path: "/about" },
				{ element: <Poll />, path: "/poll/:pollId?" },
				{ element: <Polls />, path: "/polls" },
				{ element: <CreatePoll />, path: "/createpoll" }
			],
			element: (
				<>
					<nav>
						<ul className="navbar">
							<li>
								<Link to="/">Hem</Link>
							</li>
							<li>
								<Link to="/about">Om projektet</Link>
							</li>
							<li>
								<Link to="/polls">Polls</Link>
							</li>
							<li>
								<Link to="/createpoll">Skapa Poll</Link>
							</li>
						</ul>
					</nav>
					<main>
						<div className="container">
							<Outlet />
						</div>
					</main>
				</>
			)
		}
	]);

	return <RouterProvider router={router} />;
}

export default App;
