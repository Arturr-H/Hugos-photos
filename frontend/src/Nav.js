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

    toggleDarkmode = () => {
        let toggled = !this.state.darkMode;
        this.setState({ darkMode: toggled });
        this.props.onToggleDarkmode(toggled);
    }

    render() {
        return (
            <nav>
                {this.props.canToggleDarkmode ? <img alt="darkmode" onClick={this.toggleDarkmode} className="darkmode-button" size={68} src={this.staticSvgs[this.state.darkMode ? 1 : 0]} /> : null }
                {this.props.canToggleDarkmode ? <a className="link" href="/about">About Me</a> : null }
                {/* <a className="link" href="/contact">Kontakt</a>
                <a className="link" href="/help">Hjälp</a> */}
            </nav>
        )
    }
}


