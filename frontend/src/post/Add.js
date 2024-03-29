/* Imports */
import React from "react";
import axios from "axios";
import Globals from "../Globals";

const BACKEND_URL = Globals.backendUrl;

/* Main */
export default class Add extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedFiles: [],
            preview: [],
            images: [],
            postToCollectionHash: "",

            title: "No title",
            date: new Date(),
            camera: "",

            collections: {}
        };
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
    componentDidMount() {
        this.checkFile();

        fetch(BACKEND_URL + "collections").then(async res => res.json()).then(data => {
            let coll = data.collections;
            this.setState({ collections: coll });
            this.setState({ postToCollectionHash: Object.keys(coll)[0]  })
        });
    }
    checkFile = () => {
        // if (!this.state.selectedFile) {
        //     this.setState({ preview: undefined })
        //     return;
        // };
        let newPreview = [];
        this.state.selectedFiles.forEach((file) => {
            const objectUrl = URL.createObjectURL(file);

            newPreview.push(objectUrl);

            // free memory when ever this component is unmounted
            return () => URL.revokeObjectURL(objectUrl)
        })

        this.setState({ preview: [...newPreview] });
    }
    onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            // this.setState({ selectedFile: [undefined] });
            return;
        }

        let newImages = [];
        for (let i = 0; i < e.target.files.length; i++) {
            newImages.push({ title: "", uploaded: false });
        }

        this.setState({
            images: [
                ...this.state.images,
                ...newImages
            ],
            selectedFiles: [
                ...this.state.selectedFiles,
                ...e.target.files
            ]
        }, () => {
            this.checkFile();
        });
    };
    submitImage = (index) => {
        const formData = new FormData();
        formData.append(
            "image",
            this.state.selectedFiles[index],
            this.state.selectedFiles[index].name
        );

        axios.post(BACKEND_URL + "upload-single", formData, {
            headers: {
                title: this.encodeItems(this.state.images[index].title).toString(),
                date_: new Date().getUTCMilliseconds(),
                _token: this.getCookie("_token"),
                camera_: [],
                place_: [],
                collection: this.state.postToCollectionHash
            }
        }).then(() => {
            let imgs = this.state.images;
            imgs[index].uploaded = true;

            this.setState({ images: [...imgs] });
        });
    }
    submitAllImages = (e) => {
        e.preventDefault();

        if (this.state.postToCollectionHash === "") return alert("No collection selected!");
        for (let i = 0; i < this.state.selectedFiles.length; i++) {
            this.submitImage(i);
        };
    }
    encodeItems = (item) => {
        let utf8Encode = new TextEncoder();
        return Array.from(utf8Encode.encode(item));
    }
    getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    render() {
        return (
            <div className="add">
                <div className="row ontop">
                    {/* Select collection input */}
                    <select className="collection-select" onChange={(e) => this.setState({ postToCollectionHash: e.target.value })}>
                        {Object.keys(this.state.collections).map(key => <option value={key}>{this.convertToRealContent(this.state.collections[key].title)}</option>)}
                    </select>

                    {/* Image input */}
                    <form className="image-upload-form" encType="multipart/form-data" method="POST" onSubmit={this.onSubmit}>
                        <label htmlFor="file-upload" className="file-input">
                            Select images
                        </label>
                        <input id="file-upload" onChange={this.onSelectFile} type="file" name="files[]" multiple />
                        <button onClick={this.submitAllImages} className="create-button">Add</button>
                    </form>

                </div>
                <div className="row">
                    {this.state.preview.map((e, index) =>
                        <EditableCoverImage
                            date={new Date()}
                            value={this.state.images[index].title}
                            onValueChange={(e) => {
                                let newImages = this.state.images;
                                newImages[index].title = e.target.value;
                                this.setState({ images: [...newImages] });
                            }}
                            isUploaded={this.state.images[index].uploaded}
                            src={e}
                        />
                    )}
                </div>

                <p className="bottom-text">
                    Hejsan hugo välkommen till sidan där du lägger till bilder i kollektioner du skapar 🤯.
                    Först å främst, välj rätt kollektion högst uppe bland kollektionsväljaren 🌄. Efter det
                    så klickar du <b>Select Images</b>, som öppnar upp ditt filsystem 📁 där du kan välja flera
                    bilder samtidigt. Men välj helst max 10 bilder åt gången, och för att få bilderna att se
                    bäst ut, använd JPG:s istället för PNG:s (bilderna du tar med din kamera är automatiskt JPG 👍).
                    Om du exempelvis vill lägga upp screenshots från din dator, skulle jag rekommendera att du 
                    använder en sida som ex <a rel="noreferrer" target="_blank" href="https://png2jpg.com/">https://png2jpg.com/</a> för att
                    göra om dem till JPG:s, då screenshots oftast sparas som PNG:s. Om du har frågor är det såklart
                    bara att ställa dem!
                </p>
            </div>
        )
    }
}

export class EditableCoverImage extends React.PureComponent {
    constructor(props) {
        super(props);

        /* Props */
        this.randomRotationOffset = 5;
        this.randomRotation = (Math.random() * this.randomRotationOffset) - this.randomRotationOffset / 2;
    }

    componentDidMount() { }

    render() {
        return (
            <div style={{ width: "min-content", position: "relative" }}>
                <img alt="pin" className="pin" src={require("../assets/icons/pin.png")} />
                <div style={{ transform: "rotate(" + this.randomRotation + "deg)" }} className="cover-image-container">

                    <div className="cover-image">
                        <img alt="cover" src={this.props.src} />
                    </div>
                    <input value={this.props.value} onChange={this.props.onValueChange} type="text" placeholder="Title..." />
                    <p className="date">{new Date(this.props.date ?? 0).toISOString().slice(0, 10)}</p>
                </div>

                {this.props.isUploaded && <div className="uploaded">Uploaded ✔</div>}
            </div>
        )
    }
}


