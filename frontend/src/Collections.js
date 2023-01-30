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
            <section className="collections">
                <h1 className="colllections-title">My Collections {this.props.scroll}</h1>
            </section>
        )
    }
}


