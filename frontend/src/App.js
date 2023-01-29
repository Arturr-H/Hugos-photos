import "./App.css";
import React from "react";
import Navbar from "./Nav";
import ScaledImage from "./ScaledImage";
/* Main */
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			blurPercentage: 0,
		};
		
		/* Refs */
		this.main = React.createRef();
	}
	
	componentDidMount() {
		this.main !== null && this.main.current.addEventListener("scroll", (e) => {
			this.setState({ blurPercentage: Math.min(e.target.scrollTop / window.innerHeight, 1) });
		})
	}
	componentWillUnmount() {}

	render() {
		return (
			<div>
				<Navbar />
				<main ref={this.main}>

					{/* Only show if not completly dark */}
					{
						this.state.blurPercentage < 1 ?
						<ScaledImage
							blur={this.state.blurPercentage*10}
							brightness={100 - this.state.blurPercentage*100}
							className={"fixed"}
							source={"https://cdna.artstation.com/p/assets/images/images/016/637/344/large/dmitry-kremiansky-forestmorningkremiansky.jpg?1552915999"}
						/> : null
					}
					<section></section>
					<section><h1>Hello</h1></section>

				</main>
			</div>
		);
	}
}

/* Exports */
export default App;
