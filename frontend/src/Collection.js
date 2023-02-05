/* Imports */
import React from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import Icon from "./Icon";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

/* Main */
class Collection extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collection: {},
            showImage: {
                active: false,
                info: {
                    src: "",
                    ort: "",
                    datum: "",
                    kamera: ""
                }
            }
        }

        /* Static */
        this.backendURL = "http://127.0.0.1:8080/";
        this.id = this.props.router.params.id;

        this.imageShow = React.createRef();
    }

    componentDidMount() {
        /* Remove active if click item not have className="TARGETABLE" */
        document.addEventListener("click", (e) => {
            if (e.target.className.indexOf("TARGETABLE") === -1) {
                this.closeShowImage();
            }
        });

        fetch(this.backendURL + "get-collection/" + this.id).then(async res => res.json()).then(data => {
            if (data == null) {
                alert("Collection not found");
            } else {
                this.setState({ collection: data });
            }
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

    showImage = (src, ort, datum, kamera) => {
        this.setState({
            showImage: {
                active: true,
                info: {
                    src: src,
                    ort: ort,
                    datum: datum,
                    kamera: kamera
                }
            }
        })
    }
    closeShowImage = () => {
        this.setState({
            showImage: {
                active: false,
                info: {
                    src: "",
                    ort: "",
                    datum: "",
                    kamera: ""
                }
            }
        })
    }

    /* Download image from <a> tag */
    download = (e) => {
        e.preventDefault();
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image-" + Date.now() + ".jpg");
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <section className="collection-with-images">
                <div className="collection-navbar">
                    <a href="/"><img className="icon" src={require("./assets/icons/x.svg").default} alt="Close" /></a>
                    <h2 className="title">{this.convertToRealContent(this.state.collection.title)}</h2>
                    <h2 className="collection-size">{this.state.collection.images && this.state.collection.images.length} images</h2>
                </div>
                <div className="images TARGETABLE">
                    {
                        this.state.collection.images && this.state.collection.images
                            .map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value)
                            .map((image, index) => {
                                let src = this.backendURL + "uploads/" + image.pathname;
                                return (
                                    <div key={index} className="image TARGETABLE" onClick={() => this.showImage(src, "Icke definerat", image.date, "Nikon")}>
                                        <img className="TARGETABLE" key={index} src={src} alt="Cover" />
                                        <div className="gradient TARGETABLE"></div>
                                        <p className="title TARGETABLE">{this.convertToRealContent(image.title)}</p>
                                        <p className="date TARGETABLE">{image.date}</p>
                                    </div>
                                )
                            })
                    }
                </div>

                {/* On image click */}
                {this.state.showImage.active ? <div className="image-show-background" ref={this.imageShow}>
                    <div className="TARGETABLE container">
                        <Icon className="close" size={24} icon="x" onClick={this.closeShowImage} />
                        <img alt="backg" src={this.state.showImage.info.src} className="TARGETABLE image-show" />
                        <div className="TARGETABLE info">
                            <div className="TARGETABLE bit">
                                <Icon size={24} icon="calendar" />
                                <p className="TARGETABLE">Datum: </p>
                                <p className="TARGETABLE">{this.state.showImage.info.datum}</p>
                            </div>
                            <div className="TARGETABLE bit">
                                <Icon size={24} icon="map-pin" />
                                <p className="TARGETABLE">Ort: </p>
                                <p className="TARGETABLE">{this.state.showImage.info.ort}</p>
                            </div>
                            <div className="TARGETABLE bit">
                                <Icon size={24} icon="camera" />
                                <p className="TARGETABLE">Kamera: </p>
                                <p className="TARGETABLE">{this.state.showImage.info.kamera}</p>
                            </div>
                        </div>
                        <a
                            href={this.state.showImage.info.src}
                            className="TARGETABLE download"
                            download
                            onClick={e => this.download(e)}
                        >
                            <p className="TARGETABLE">Download</p>
                            <Icon className="TARGETABLE" size={24} icon="download" />
                        </a>
                    </div>
                    {/* <img alt="blur" src={this.images[0]} className="TARGETABLE image-show-blur" /> */}
                </div> : null}
            </section>
        )
    }
}

export default withRouter(Collection);
