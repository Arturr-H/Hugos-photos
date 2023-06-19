import React from "react";

/* Main image view */
export default class MainView extends React.PureComponent {
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
	}

	componentDidMount() {
        const TIME = 20000;
        
        for (const image of document.getElementsByClassName("imagegallery-image")) {
            this.animate(image, TIME);
            setInterval(() => this.animate(image, TIME), TIME*2);
        }
    }
	componentWillUnmount() {}
    animate = (img, time) => {
        img.animate([
            { objectPosition: `${0}% 100%` },
        ], {
            duration: time,
            easing: "ease-in-out",
            fill: "forwards"
        });
        setTimeout(() => {
            img.animate([
                { objectPosition: `${100}% 0%` },
            ], {
                duration: time,
                easing: "ease-in-out",
                fill: "forwards"
            });
        }, time);
    }

	render() {
		return (
			<section className="animated" id={this.props.id}>
				<div
					ref={this.gallery}
					// onMouseEnter={this.handleMouseEnter}
					// onMouseLeave={this.handleMouseLeave}
					className="gallery-container"
				>
					{/* <Images /> */}
					{/* <Images ref_={this.widthGrabber} images={this.props.images} triggerImageSelect={this.props.triggerImageSelect} /> */}
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
                    className="imagegallery-image TARGETABLE"
					src={this.props.src}
					alt={this.props.alt}
					onClick={() => this.props.triggerImageSelect(this.props.index)}
				/>
			</div>
		);
	}
}

