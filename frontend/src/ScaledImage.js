/* Imports */
import React  from "react";

/* Main */
export default class ScaledImage extends React.PureComponent {
    render() {
        return (
            <img
                src={this.props.source}
                className={"scaled-image " + this.props.className}
                alt="showed upon clicking an image"
                style={{
                    filter: "blur(" + this.props.blur + "px) brightness(" + this.props.brightness + "%)",
                }}
            />
        );
    };
}
