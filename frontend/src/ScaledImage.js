/* Imports */
import React  from "react";

/* Main */
export default class ScaledImage extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <img
                src={this.props.source}
                className={"scaled-image " + this.props.className}
                style={{
                    filter: "blur(" + this.props.blur + "px) brightness(" + this.props.brightness + "%)",
                }}
            />
        );
    };
}
