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
    render() {
        return (
            <section className="collection-section">
                <div className="collections">
                    {/* <div className="area"><CoverImage src={...} /></div> */}
                    {
                        Object.keys(this.state.collections).map((key, index) => {
                            const collection = this.state.collections[key];
                            const coverImage = collection.cover_image;
                            return (
                                <div className="area" key={index}>
                                    <CoverImage src={this.backendURL + "uploads/" + coverImage.pathname} title={this.convertToRealContent(collection.title)} date={coverImage.date} />
                                </div>
                            )
                        })
                    }
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

    componentDidMount() {}

    render() {
        return (
            <div style={{ width: "min-content", position: "relative" }}>
                <img className="pin" src={require("./assets/icons/pin.png")} />
                <div style={{ transform: "rotate(" + this.randomRotation + "deg)" }} className="cover-image-container">

                    <div className="cover-image">
                        <img src={this.props.src} />
                    </div>
                    <p>{this.props.title ?? "No title"}</p>
                    <p className="date">{new Date(this.props.date ?? 0).toISOString().slice(0, 10)}</p>
                </div>
            </div>
        )
    }
}

