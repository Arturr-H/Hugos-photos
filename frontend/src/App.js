import "./App.css";
import React from "react";
import Navbar from "./Nav";

/* Main */
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {};
		
		/* Refs */
	}
	
	componentDidMount() {}
	componentWillUnmount() {}

	render() {
		return (
			<div className="App">
				<Navbar />
				<main></main>
			</div>
		);
	}
}

/* Exports */
export default App;
