/* Imports */
import React from "react";

/* Main */
export default class Collections extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collections: {}
        }

        /* Static */
        this.backendURL = "http://127.0.0.1:8080/";
    }
    
    componentDidMount() {
        fetch(this.backendURL + "collections").then(async res => res.json()).then(data => {
            this.setState({ collections: data.collections });
        })
    }

    /* Convert bytes into real text strings */
	convertToRealContent = (content) => {
        let newContent = "";
        let array = new Uint8Array(content);
        for (let i = 0; i < array.length; i++) {
            newContent += String.fromCharCode(array[i]);
        }

        const byteArray = Uint8Array.from(newContent.split(","), x => parseInt(x));
        const result = new TextDecoder().decode(byteArray);

        return result;
    };

    shuffleArray = (array) => {
        let arr_clone = [...array];

        for (var i = arr_clone.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr_clone[i];
            arr_clone[i] = arr_clone[j];
            arr_clone[j] = temp;
        }

        return arr_clone;
    }

    render() {
        return (
            <section id="#collections-section" className="collection-section">
                <div className="collections">
                    <img alt="pin board" className="peg-board" src={require("./assets/images/pegboard.png")} />
                    <div className="scroller">
                        {
                            Object.keys(this.state.collections)
                            .map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value)
                            .map((key, index) => {
                                const collection = this.state.collections[key];
                                const coverImage = collection.cover_image;
                                return (
                                    <div className="area" key={index}>
                                        <CoverImage _key={key} src={this.backendURL + "uploads-compressed/" + coverImage.pathname} title={this.convertToRealContent(collection.title)} date={coverImage.date} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        )
    }
}
export class CoverImage extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Props */
        this.randomRotationOffset = 5;
        this.randomRotation = (Math.random() * this.randomRotationOffset) - this.randomRotationOffset/2;
    }

    render() {
        return (
            <a rel="noreferrer" href={"/collection/" + this.props._key} target="_blank" style={{ width: "min-content", position: "relative" }}>
                <img alt="pin" className="pin" src={require("./assets/icons/pin.png")} />
                <div style={{ transform: "rotate(" + this.randomRotation + "deg)" }} className="cover-image-container">
                    <img
                        alt="note ending"
                        src={require("./assets/images/note-ending.svg").default}
                        className="note-ending"
                        style={{
                            transform: "translateY(-70%) scaleX(" + (Math.random() > 0.5 ? 1 : -1) + ")"
                        }}
                    />
                    <div className="cover-image">
                        <img alt="cover" src={this.props.src} />
                    </div>
                    <p>{this.props.title === "" ? "No title" : this.props.title}</p>
                    <p className="date">{this.props.date}</p>
                </div>
            </a>
        )
    }
}

