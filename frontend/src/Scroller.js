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

        /* Bindings */
        this.fullscreen = this.fullscreen.bind(this);
        this.handleOnDown = this.handleOnDown.bind(this);
        this.handleOnMove = this.handleOnMove.bind(this);
        this.handleOnUp = this.handleOnUp.bind(this);

        this.down = false;
    }

    /* Lifetime */
    componentDidMount() {
        this.setState({ isMounted: true });
        window.onmousedown = e => this.handleOnDown(e);
		window.ontouchstart = e => this.handleOnDown(e.touches[0]);
		window.onmouseup = e => this.handleOnUp(e);
		window.ontouchend = e => this.handleOnUp(e.touches[0]);
		window.onmousemove = e => this.handleOnMove(e);
		window.ontouchmove = e => this.handleOnMove(e.touches[0]);
    }
    componentWillUnmount() {
        this.setState({ isMounted: false });
        /* Clear evts */
        window.onmousedown = e => null;
		window.ontouchstart = e => null;
		window.onmouseup = e => null;
		window.ontouchend = e => null;
		window.onmousemove = e => null;
		window.ontouchmove = e => null;
    }

    /* Movin image track */
    handleOnMove = e => {
        if (!this.state.isMounted || !this.down) return;

        const MOUSE_DELTA = (parseFloat(this.track.current.dataset.mouseDownAt) - e.clientX) / 7;
        const MAX_DELTA = window.innerWidth / 2;

        const PERCENTAGE = (MOUSE_DELTA / MAX_DELTA) * -100;
        const NEXT_PERCENTAGE_UNCONSTRAINED = parseFloat(this.track.current.dataset.prevPercentage) + PERCENTAGE;
        const NEXT_PERCENTAGE = Math.max(Math.min(NEXT_PERCENTAGE_UNCONSTRAINED, 0), -100);

        /* I hate javascript */
        if (NEXT_PERCENTAGE == NaN || NEXT_PERCENTAGE == "NaN" || !NEXT_PERCENTAGE) return;

        this.track.current.dataset.percentage = NEXT_PERCENTAGE;
        this.track.current.animate({
            transform: `translate(${NEXT_PERCENTAGE}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        this.setState({ percentage: NEXT_PERCENTAGE + 100 });

        for (const image of this.track.current.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + NEXT_PERCENTAGE}% center`
            }, { duration: 1200, fill: "forwards" });
        }
    }
    handleOnDown = e => {
        if (!this.state.isMounted) return;
        this.down = true;
        this.track.current.dataset.mouseDownAt = e.clientX
    };
    handleOnUp = () => {
        this.down = false;
        if (!this.state.isMounted || !this.track.current.dataset.percentage) return;
        this.track.current.dataset.mouseDownAt = "0";
        this.track.current.dataset.prevPercentage = this.track.current.dataset.percentage;
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
                />
            </div>
		);
	};
}
