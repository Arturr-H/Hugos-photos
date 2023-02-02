/* Imports */
import React from "react";

/* Main */
export default class Post extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="post">
                <a target="_blank" href="/create"><button>Skapa kollektion</button></a>
                <a target="_blank" href="/add"><button>Lägg till i kollektion</button></a>
            </div>
        )
    }
}


