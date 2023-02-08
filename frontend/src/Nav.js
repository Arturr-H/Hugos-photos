/* Imports */
import React from "react";

/* Main */
export default class Navbar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { darkMode: false };

        /* Props */
        this.links = this.props.links;

        /* Images */
        this.staticSvgs = [
            require("./assets/icons/sun.svg").default,
            require("./assets/icons/moon.svg").default,
        ];
    }

    render() {
        return (
            <nav>
                {this.props.aboutMeVisible ? <a className="link" href="/about">About Me</a> : null }
                {/* <a className="link" href="/contact">Kontakt</a>
                <a className="link" href="/help">Hjälp</a> */}
            </nav>
        )
    }
}


