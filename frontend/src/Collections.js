/* Imports */
import React from "react";

/* Main */
export default class Collections extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Props */
    }

    render() {
        return (
            <section className="collection-section">
                <h1 className="collections-title">My Collections {this.props.scroll}</h1>
                <div className="collections">
                    <div className="area a1"><CoverImage /></div>
                    <div className="area a2"><CoverImage /></div>
                    <div className="area a3"><CoverImage /></div>
                    <div className="area a4"><CoverImage /></div>
                    <div className="area a5"><CoverImage /></div>
                    <div className="area a6"><CoverImage /></div>
                    <div className="area a7"><CoverImage /></div>
                    <div className="area a8"><CoverImage /></div>
                </div>
            </section>
        )
    }
}
class CoverImage extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Props */
        this.randomRotationOffset = 5;
        this.randomRotation = (Math.random() * this.randomRotationOffset) - this.randomRotationOffset/2;
    }

    componentDidMount() {}

    render() {
        return (
            <div style={{ transform: "rotate(" + this.randomRotation + "deg)" }} className="cover-image-container">
                <img className="pin" src={require("./assets/icons/pin.png")} />

                <img className="cover-image" src={require("./assets/images/compressed/Bee.JPG")} />
                <p>Sunsets</p>
            </div>
        )
    }
}


