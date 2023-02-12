import React from "react";
import Icon from "./Icon";

export default class About extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Props */
    }

    componentDidMount() {}

    render() {
        return (
            <div className="about-container">
                <a href="/" style={{
                    position: "absolute",
                    left: 20,
                    top: 20,
                    zIndex: 10,
                    cursor: "pointer"
                }}>
                    <Icon size={48} icon="chevron-left" />
                </a>
                <h1 className="title upward">Hugo Sjögren</h1>
                <p className="biography">
                    I am a 16-year-old photographer based in Stockholm, Sweden. <br />
                    I started photographing in the spring of 2022.
                    My photography mainly consists of photos taken in the dark forests of western Sweden.
                    Apart from nature photography I also enjoy photographing the night sky and twilight evenings.
                    You can say that I am an all-around photographer capturing everyday life from late-night summer evenings to cold dark winter nights.
                    The purpose of this website is solely to display my photos.

                    <br />
                    There is no intention to make any money from this at all as it is truly a passion of mine and it gives me great enjoyment that these photos can be shared with the public.
                    The photos can be used in whatever way you'd like but it would be a pleasure if you credit me if you use them for a commercial purpose.
                    <br /><br />
                    For business inquires, please reach out to <a href="mailto: hugosjogren06@gmail.com">hugosjogren06@gmail.com</a>
                </p>
                <img className="image" src={require("./assets/images/profile.JPG")} />
            </div>
        )
    }
}
