import "./App.css";
import React from "react";
import Navbar from "./Nav";
import ScaledImage from "./ScaledImage";
import Icon from "./Icon";
import Collections from "./Collections";

/* Main */
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			scrollPercentage: 0.0,
			showImage: {
				active: false,
				info: {
					src: "",
					ort: "",
					datum: "",
					kamera: ""
				}
			}
		};

		/* Refs */
		this.main = React.createRef();
		this.imageShow = React.createRef();
		this.scrollToSection = React.createRef();

		/* Static */
		this.images = [
			{
				src: require("./assets/images/compressed/Lingonberries.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			},
			{
				src: require("./assets/images/compressed/ForestWoman.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			},
			{
				src: require("./assets/images/compressed/Hayfield.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			},
			{
				src: require("./assets/images/compressed/Bee.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			},
			{
				src: require("./assets/images/compressed/SkyOcean.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			},
			{
				src: require("./assets/images/compressed/SkyOceanRain.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			},
			{
				src: require("./assets/images/compressed/Toadstool.JPG"),
				ort: "Dalarna",
				datum: "12/06/22",
				kamera: "Nikon 123xp6"
			 }
		];
	}

	componentDidMount() {
		this.main !== null && this.main.current.addEventListener("scroll", (e) => {
			this.setState({ scrollPercentage: Math.min(e.target.scrollTop / window.innerHeight, 1) });
		})

		/* Remove active if click item not have className="TARGETABLE" */
		document.addEventListener("click", (e) => {
			if (e.target.className.indexOf("TARGETABLE") === -1) {
				this.closeShowImage();
			}
		});
	}
	componentWillUnmount() { }
	closeShowImage = () => {
		this.imageShow.current.animate([
			{ opacity: 1 },
			{ opacity: 0 }
		], {
			duration: 250,
			easing: "ease-in-out"
		});

		setTimeout(() => {
			this.setState({
				showImage: {
					active: false,
					info: { src: "", ort: "", datum: "", kamera: "" }
				}
			});
		}, 250);
	};

	/* On image click */
	triggerImageSelect = (index) => {
		let imgData = this.images[index];

		this.setState({
			showImage: {
				active: true,
				info: {
					src: imgData.src,
					ort: imgData.ort,
					datum: imgData.datum,
					kamera: imgData.kamera
				}
			}
		})
	}
	scrollDown = () => {
		this.scrollToSection.current.scrollIntoView({ behavior: "smooth" });
	}

	render() {
		return (
			<div>
				<Navbar />
				<h1 style={{
					transform: "translateX(-50%) translateY(" +  ((-50) - this.state.scrollPercentage*-76) + "%)",
					top: (50 - this.state.scrollPercentage*50) + "%",
					fontSize: Math.max(250 - (this.state.scrollPercentage * 400), 100),
					letterSpacing: this.state.scrollPercentage * 10
				}} className="title">
					Hugo Sjögren
				</h1>
				<main ref={this.main}>

					{/* Only show if not completly dark */}
					{
						this.state.scrollPercentage < 1 ?
							<ScaledImage
								blur={this.state.scrollPercentage * 10}
								brightness={100 - this.state.scrollPercentage * 100}
								className={"fixed"}
								source={require("./assets/images/default/SnowHouse.JPG")}
							/> : null
					}

					{/* Scrolling section hidden behind fixed image (never shown) */}
					<section></section>

					{/* Play intro animation upon visibility */}
					{
						this.state.scrollPercentage >= 1 ?
							<MainView
								triggerImageSelect={this.triggerImageSelect}
								images={this.images}
								showImageActive={this.state.showImage.active}
							/>
							: <section ref={this.scrollToSection}></section>
					}

					{/* Collections section */}
					<Collections scroll={this.state.scrollPercentage} />
				</main>

				{/* Chevron down */}
				<Icon
					onClick={this.scrollDown}
					className="chevron-down"
					icon="chevron-down"
					size={80}
				/>

				{/* On image click */}
				{ this.state.showImage.active ? <div className="image-show-background" ref={this.imageShow}>
					<div className="TARGETABLE container">
						<Icon className="close" size={24} icon="x" onClick={this.closeShowImage} />
						<img alt="backg" src={this.state.showImage.info.src} className="TARGETABLE image-show" />
						<div className="TARGETABLE info">
							<div className="TARGETABLE bit">
								<Icon size={24} icon="calendar" />
								<p className="TARGETABLE">Datum: </p>
								<p className="TARGETABLE">{this.state.showImage.info.datum}</p>
							</div>
							<div className="TARGETABLE bit">
								<Icon size={24} icon="map-pin" />
								<p className="TARGETABLE">Ort: </p>
								<p className="TARGETABLE">{this.state.showImage.info.ort}</p>
							</div>
							<div className="TARGETABLE bit">
								<Icon size={24} icon="camera" />
								<p className="TARGETABLE">Kamera: </p>
								<p className="TARGETABLE">{this.state.showImage.info.kamera}</p>
							</div>
						</div>
					</div>
					<img alt="blur" src={this.images[0]} className="TARGETABLE image-show-blur" />
				</div> : null }
			</div>
		);
	}
}

/* Main image view */
class MainView extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			isResizing: false,
			autoScroll: true
		};

		/* Refs */
		this.gallery = React.createRef();

		/* Bindings */
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}

	componentDidMount() {

		/* Resize event */
		window.addEventListener("resize", this.onResize);

		/* Scroll evts */
		this.gallery.current.scrollLeft = window.innerWidth*1.5 + 11;
		this.gallery && this.gallery.current.addEventListener("scroll", (e) => {
			console.log(this.state.isResizing);
			let s = window.innerWidth*1.5;
			let scrollDistance = (e.target.scrollLeft - s) / s;
			if (scrollDistance > 1) { this.onResize(); }
			else { this.setState({ scrollDistance }); }
		})
		this.intervalId = setInterval(() => {
			if (this.state.autoScroll && !this.state.isResizing && !this.props.showImageActive) {
				this.gallery.current.scrollLeft += 2;
			}
		}, 10);
	}
	componentWillUnmount() {
		clearInterval(this.intervalId);
		clearInterval(this.resizeTimeout);
	}

	onResize = () => {
		this.setState({ isResizing: true });
		this.resizeTimeout = setTimeout(() => {
			this.setState({ isResizing: false });
		}, 500);
		this.gallery.current.scrollLeft = window.innerWidth*1.5 - 10;
	}

	/* Mouse evts */
	handleMouseEnter() {
		this.setState({ autoScroll: false });

		/* Fade out scrolling exponentially */
		let additionalScrollFactor = 4;

		let scrollInterval = setInterval(() => {
			additionalScrollFactor *= 0.9;

			this.gallery.current.scrollLeft += additionalScrollFactor;
			if (additionalScrollFactor < 0.05) { clearInterval(scrollInterval); }
		}, 20);
	}
	handleMouseLeave() {
		/* Fade in scrolling exponentially */
		let additionalScrollFactor = 1;

		let scrollInterval = setInterval(() => {
			additionalScrollFactor *= 1.1;

			this.gallery.current.scrollLeft += additionalScrollFactor;
			if (additionalScrollFactor > 3) {
				this.setState({ autoScroll: true });
				clearInterval(scrollInterval);
			}
		}, 20);
	}

	render() {
		return (
			<section className="animated">
				<div
					ref={this.gallery}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					className="gallery-container"
				>
					{/* <Images /> */}
					<Images images={this.props.images} triggerImageSelect={this.props.triggerImageSelect} />
					<Images images={this.props.images} triggerImageSelect={this.props.triggerImageSelect} />
					<Images images={this.props.images} triggerImageSelect={this.props.triggerImageSelect} />
				</div>
			</section>
		);
	}
}

/* Images in the main image view */
class Images extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
		};

		/* Static */
	}

	componentDidMount() { }
	componentWillUnmount() { }

	render() {
		return (
			<div className="images-container">
				{
					this.props.images.map((data, index) => 
						<Image
							alt={"hugos pic " + (index + 1)}
							className={"s s" + (index + 1)}
							src={data.src}
							key={index}
							index={index}
							triggerImageSelect={this.props.triggerImageSelect}
						/>
					)
				}
			</div>
		);
	}
}

/* Image in the Images view */
class Image extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
		};

		/* Static */
	}

	componentDidMount() { }
	componentWillUnmount() { }

	render() {
		return (
			<div className={this.props.className + " TARGETABLE"}>
				<img
					src={this.props.src}
					alt={this.props.alt}
					className={"TARGETABLE"}
					onClick={() => this.props.triggerImageSelect(this.props.index)}
				/>
			</div>
		);
	}
}



/* Exports */
export default App;
