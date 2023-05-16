import "./App.css";
import React from "react";
import Navbar from "./Nav";
import ScaledImage from "./ScaledImage";
import Icon from "./Icon";
import Collections from "./Collections";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll"
import { Scroller } from "./Scroller";

/* Main */
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/* Changeable */
		this.state = {
			imageModal: {},
			section: 1
		};

		/* Refs */
		this.s1 = React.createRef();
		this.s2 = React.createRef();
		this.s3 = React.createRef();

		/* Bindings */
		this.scroll = this.scroll.bind(this);

		/* Scroller images */
		this.images = [
			{
				src: require("./assets/images/compressed/Lingonberries.JPG"),
				src_no_compress: require("./assets/images/default/Lingonberries.JPG"),
				datum: "Unknown",
			},
			{
				src: require("./assets/images/compressed/ForestWoman.JPG"),
				src_no_compress: require("./assets/images/default/ForestWoman.JPG"),
				datum: "Unknown",
			},
			{
				src: require("./assets/images/compressed/Hayfield.JPG"),
				src_no_compress: require("./assets/images/default/Hayfield.JPG"),
				datum: "Unknown",
			},
			{
				src: require("./assets/images/compressed/Bee.JPG"),
				src_no_compress: require("./assets/images/default/Bee.JPG"),
				datum: "Unknown",
			},
			{
				src: require("./assets/images/compressed/SkyOcean.JPG"),
				src_no_compress: require("./assets/images/default/SkyOcean.JPG"),
				datum: "Unknown",
			},
			{
				src: require("./assets/images/compressed/SkyOceanRain.JPG"),
				src_no_compress: require("./assets/images/default/SkyOceanRain.JPG"),
				datum: "Unknown",
			},
			{
				src: require("./assets/images/compressed/Toadstool.JPG"),
				src_no_compress: require("./assets/images/default/Toadstool.JPG"),
				datum: "Unknown",
			}
		];
	}

	/* Component Lifetime */
	componentDidMount() {}
	componentWillUnmount() {}

	// TODO: Check status
	closeImageModal = () => {
		this.imageShow.current && this.imageShow.current.animate([
			{ opacity: 1 },
			{ opacity: 0 }
		], {
			duration: 250,
			easing: "ease-in-out"
		});

		setTimeout(() => {
			this.setState({
				imageModal: {
					active: false,
					info: { src: "", ort: "", datum: "", kamera: "" }
				}
			});
		}, 250);
	};

	/* On image click */
	// TODO: Check status
	triggerImageSelect = (index) => {
		console.log("img", index);
		let imgData = this.images[index];

		this.setState({
			imageModal: {
				active: true,
				info: {
					src: imgData.src,
					ort: imgData.ort,
					datum: imgData.datum,
					kamera: imgData.kamera,
					src_no_compress: imgData.src_no_compress
				}
			}
		})
	}

	/* Use of scroll-button */
	scroll() {
		let num = this.state.section + 1;
		let map = {
			1: this.s1,
			2: this.s2,
			3: this.s3,
		};

		/* Scroll to section */
		map[num].current.scrollIntoView({ behavior: "smooth" });

		/* Set num */
		this.setState({ section: num >= 3 ? 0 : num });
	}

	/* Render */
	render() {
		return (
			<div className="background">
				<Navbar aboutMeVisible={this.state.scrollPercentage < 1}  />

				{/* ALL SECTIONS ARE HERE */}
				<main>
					{/* Background image */}
					<ScaledImage
						blur={10}
						brightness={100}
						className={"fixed"}
						source={require("./assets/images/compressed/SnowHouse.JPG")}
					/>

					{/* The <ScaledImage /> is position: flex therefore we need an
						extra section to compensate / add height to the page */}
					<section className="center-container" ref={this.s1}>
						{/* Title / header */}
						<h1 className="title">Hugo Sjögren</h1>
					</section>

					{/* Image scrolling (hugos fav images) */}
					<section ref={this.s2} className="animated" id={this.props.id}>
						<div className="images-container">
							<Scroller
								images={this.images}
								onImageClick={(index) => this.triggerImageSelect(index)}
							/>
						</div>
					</section>

					{/* Collections section */}
					<div ref={this.s3} className="collections-ref-container" id="collections-ref-container">
						<Collections scroll={this.state.scrollPercentage} />
					</div>
				</main>

				{/* On image click */}
				{ this.state.imageModal.active ? <div className="image-show-background" ref={this.imageShow}>
					<div className="TARGETABLE container">
						<Icon className="close" size={24} icon="x" onClick={this.closeimageModal} />
						<img alt="backg" src={this.state.imageModal.info.src_no_compress} className="TARGETABLE image-show" />

						{/* Needed for margin */}
						<div className="TARGETABLE info"></div>

						{/* Download */}
						<a
                            href={this.state.imageModal.info.src_no_compress}
                            className="TARGETABLE download"
                            download
                        >
                            <p className="TARGETABLE">Download</p>
                            <Icon className="TARGETABLE" size={24} icon="download" />
                        </a>
					</div>
					<img alt="blur" src={this.images[0]} className="TARGETABLE image-show-blur" />
				</div> : null }

				{/* This is the button that will help users scroll
					BECAUSE FOR SOME FKN REASON CHROME DECIDES TO 
					BAIL OUT ON GREAT SCROLL FEATURES PLEASEE WHY */}
				<button onClick={this.scroll} className="scroll-button">
					<Icon
						className="chevron-down"
						icon={"chevron-down-white"}
						size={48}
					/>
				</button>
			</div>
		);
	}
}

/* Export with nav features */
function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

/* Exports */
export default withRouter(App);
