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
		this.window = ["", "", "", "", "", "", ""];

		/* Static */
		this.images = [
			{
				src: require("./assets/images/compressed/Lingonberries.JPG"),
				datum: "12/06/22",
			},
			{
				src: require("./assets/images/compressed/ForestWoman.JPG"),
				datum: "12/06/22",
			},
			{
				src: require("./assets/images/compressed/Hayfield.JPG"),
				datum: "12/06/22",
			},
			{
				src: require("./assets/images/compressed/Bee.JPG"),
				datum: "12/06/22",
			},
			{
				src: require("./assets/images/compressed/SkyOcean.JPG"),
				datum: "12/06/22",
			},
			{
				src: require("./assets/images/compressed/SkyOceanRain.JPG"),
				datum: "12/06/22",
			},
			{
				src: require("./assets/images/compressed/Toadstool.JPG"),
				datum: "12/06/22",
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

		/* Secret code for opening secret tab */
		document.addEventListener("keydown", (e) => {

			/* Add key to array */
			this.window.shift();
			this.window.push(e.key);

			/* Check if array is correct */
			if (this.window.join("") === "hugo123") {
				window.open("/post", "_blank");
				this.window = [];
			}
		});
	}
	componentWillUnmount() { }
	closeShowImage = () => {
		this.imageShow.current && this.imageShow.current.animate([
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
			<div className="background">
				<Navbar aboutMeVisible={this.state.scrollPercentage < 1}  />
				
				<h1 style={{
					transform: "translateX(-50%) translateY(" +  ((-50) - this.state.scrollPercentage*-100) + "%)",
					top: (50 - this.state.scrollPercentage*50) + "%",
					fontSize: Math.max(19.5 - (this.state.scrollPercentage * 32), 7) + "vmin",
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
								brightness={110 - this.state.scrollPercentage * 100}
								className={"fixed"}
								source={require("./assets/images/default/SnowHouse.JPG")}
							/> : <ScaledImage
								blur={10}
								brightness={10}
								className={"fixed"}
								source={require("./assets/images/compressed/SnowHouse.JPG")}
							/>
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
					icon={this.state.scrollPercentage < 1 ? "chevron-down" : "chevron-down-white"}
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
			autoScroll: true,
			galleryScrollPercentage: 0
		};

		/* Refs */
		this.gallery = React.createRef();
		this.widthGrabber = React.createRef();

		/* Bindings */
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}

	componentDidMount() {
		// if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		// 	/* Mobile */
		// }else {
		// 	/* Resize event */
		// 	window.addEventListener("resize", this.onResize);

		// 	/* Scroll evts */
		// 	this.gallery.current.scrollLeft = window.innerWidth*1.5 + 11;
		// 	this.gallery && this.gallery.current.addEventListener("scroll", (e) => {
		// 		let s = this.widthGrabber.current.offsetWidth - 140;

		// 		let scrollDistance = (e.target.scrollLeft - s) / s;
		// 		if (scrollDistance > 1) { this.onResize(false); }
		// 		else { this.setState({ scrollDistance }); }
		// 	})
			
			// this.intervalId = setInterval(() => {
			// 	if (this.state.autoScroll && !this.state.isResizing && !this.props.showImageActive) {
			// 		this.gallery.current.scrollLeft += 2;
			// 	}
			// }, 10);
		// }

		// this.intervalId = setInterval(() => {
		// 	let next = this.state.galleryScrollPercentage + 0.06;
		// 	if (next >= 0) {
		// 		this.setState({ galleryScrollPercentage: -100 });
		// 	}else {
		// 		this.setState({ galleryScrollPercentage: next });
		// 	}
		// }, 8);
	}
	componentWillUnmount() {
		// clearInterval(this.intervalId);
		clearInterval(this.resizeTimeout);
	}

	/* Mouse evts */
	handleMouseEnter() {
		this.setState({ autoScroll: false });

		/* Fade out scrolling exponentially */
		let additionalScrollFactor = 4;

		let scrollInterval = setInterval(() => {
			additionalScrollFactor *= 0.9;

			this.gallery.current && (this.gallery.current.scrollLeft += additionalScrollFactor);
			if (additionalScrollFactor < 0.05) { clearInterval(scrollInterval); }
		}, 20);
	}
	handleMouseLeave() {
		/* Fade in scrolling exponentially */
		let additionalScrollFactor = 1;

		let scrollInterval = setInterval(() => {
			additionalScrollFactor *= 1.1;

			this.gallery.current && (this.gallery.current.scrollLeft += additionalScrollFactor);
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
					// onMouseEnter={this.handleMouseEnter}
					// onMouseLeave={this.handleMouseLeave}
					className="gallery-container"
				>
					{/* <Images /> */}
					<Images ref_={this.widthGrabber} images={this.props.images} triggerImageSelect={this.props.triggerImageSelect} />
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
			<div className="images-container" ref={this.props.ref_}>
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
