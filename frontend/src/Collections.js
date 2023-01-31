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
                <div className="collections">
                    <div className="area"><CoverImage src={require("./assets/images/compressed/Bee.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/ForestWoman.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/Lingonberries.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/SkyOcean.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/SnowHouse.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/Toadstool.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/Hayfield.JPG")} /></div>
                    <div className="area"><CoverImage src={require("./assets/images/compressed/SkyOceanRain.JPG")} /></div>
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
            <div style={{ width: "min-content", position: "relative" }}>
                <img className="pin" src={require("./assets/icons/pin.png")} />
                <div style={{ transform: "rotate(" + this.randomRotation + "deg)" }} className="cover-image-container">

                    <div className="cover-image">
                        <img src={this.props.src} />
                    </div>
                    <p>Sunsets</p>
                </div>
            </div>
        )
    }
}


