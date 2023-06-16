import React from "react";

export class Scroller extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            percentage: 100,
            fullscreen: {
                active: false,
                id: "",
            },
            isMounted: false
        };

        /* Refs */
        this.track = React.createRef();
        this.cursor = React.createRef();

        /* Bindings */
        this.fullscreen = this.fullscreen.bind(this);

        this.down = false;
    }

    /* Lifetime */
    componentDidMount() {
        this.setState({ isMounted: true });
        const opt = { duration: 30000, fill: "forwards", easing: "linear", iterations: 88 };
        this.track.current.animate([
            { transform: `translate(${-80}%, -50%)` },
            { transform: `translate(${-20}%, -50%)` },
            { transform: `translate(${-80}%, -50%)` },
        ], opt);
        for (const image of this.track.current.getElementsByClassName("image")) {
            image.animate([
                { objectPosition: `${0}% center` },
                { objectPosition: `${100}% center` },
                { objectPosition: `${0}% center` },
            ], opt);
        }
    }
    componentWillUnmount() {
        this.setState({ isMounted: false });
    }

    /* Fullscreen toggle */
    fullscreen(id) {}

    render() {
        return (
            <div ref={this.track} className="image-scroller" data-mouse-down-at="0" data-prev-percentage="0" percentage="0">
                {
                    this.props.images.map((e, index) =>
                        <Image
                            id={index}
                            onImageClick={this.props.onImageClick}
                            key={"scimgi-" + index}
                            scroll={this.state.percentage}
                            fullscreen={this.fullscreen}
                            data={e}
                        />
                    )
                }
            </div>
        )
    }
}

class Image extends React.PureComponent {
	
	/* Construct */
	constructor(props) {
		super(props);

		/* State */
		this.state = {
            scale: { x: 1, y: 1 }
        };

        /* Bindings */
        this.fullscreen = this.fullscreen.bind(this);

        /* Refs */
        this.item = React.createRef();
	}

	/* Lifecycle */
	componentDidMount() {}
	componentWillUnmount() {}

    /* Fullscreen image */
    fullscreen() {
        this.props.onImageClick(this.props.id)
    }

	/* Render */
	render() {
		return (
            <div
                className="image-wrapper"
                onClick={this.fullscreen}
                ref={this.item}
            >
                <img
                    draggable={false}
                    className="image"
                    src={this.props.data.src}
                    alt={this.props.id + "image uploaded bu hugo"}
                />
            </div>
		);
	};
}
