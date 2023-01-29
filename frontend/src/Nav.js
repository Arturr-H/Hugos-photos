/* Imports */
import React from "react";

/* Main */
export default class Navbar extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Props */
        this.links = this.props.links;
    }

    render() {
        return (
            <nav>
                <a className="link" href="/about">Om mig</a>
                {/* <a className="link" href="/contact">Kontakt</a>
                <a className="link" href="/help">Hjälp</a> */}
            </nav>
        )
    }
}


