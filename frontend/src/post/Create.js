/* Imports */
import React from "react";
import axios from "axios";
import { CoverImage } from "../Collections";

const BACKEND_URL = "http://127.0.0.1:8080/";

/* Main */
export default class Create extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            preview: null,

            title: "No title",
            date: "No date specified",
        };
    }

    componentDidMount() {
        this.checkFile();
    }
    checkFile = () => {
        if (!this.state.selectedFile) {
            this.setState({ preview: undefined })
            return;
        };

        const objectUrl = URL.createObjectURL(this.state.selectedFile)
        this.setState({ preview: objectUrl })

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }
    onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            this.setState({ selectedFile: undefined });
            return;
        }

        this.setState({ selectedFile: e.target.files[0] }, () => {
            this.checkFile();
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append(
            "image",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        
        axios.post(BACKEND_URL + "upload-single", formData, {
            headers: {
                title: this.encodeItems(this.state.title).toString(),
                date_: this.state.date,
                camera_: [],
                place_: []
            }
        });
    }
    encodeItems = (item) => {
		let utf8Encode = new TextEncoder();

        console.log(Array.from(utf8Encode.encode(item)))
        return Array.from(utf8Encode.encode(item));
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
            <div className="create">
                <div className="column">
                    <input onChange={(e) => this.setState({ title: e.target.value })} type="text" placeholder="Collection title..." />
                    <input onChange={(e) => this.setState({ date: e.target.value })} type="text" placeholder="Collection date..." />
                    
                    {/* Image input */}
                    <form className="image-upload-form" encType="multipart/form-data" method="POST" onSubmit={this.onSubmit}> 
                        <label htmlFor="file-upload" className="file-input">
                            Select cover
                        </label>
                        <input id="file-upload" onChange={this.onSelectFile} type="file" name="files[]" />
                        <button style={{ display: "block", marginBottom: 15 }} type="submit" className="create-button">Create</button>
                    </form>

                </div>
                <div className="column">
                    {this.state.selectedFile ? <CoverImage date={this.state.date} title={this.state.title} src={this.state.preview} /> : <CoverImage date={this.state.date} title={this.state.title} />}
                </div>
            </div>
        )
    }
}


