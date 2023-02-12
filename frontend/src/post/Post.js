/* Imports */
import React from "react";
import Globals from "../Globals";
import axios from "axios";

/* Main */
export default class Post extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener("dragover", function(e) {
            e.preventDefault();
        }, false);
        window.addEventListener("drop",function(e){
            e.preventDefault();
        }, false);
    }

    onEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            let selectedFile = e.dataTransfer.files[0];
            const formData = new FormData();
        
            formData.append(
                "image",
                selectedFile,
                selectedFile.name
            );
            
            axios.post(Globals.backendUrl + "check-auth", formData, {}).then(e => {
                if (e.data.status === 200) {
                    this.setCookie("_token", e.data.token, 7);
                }
                alert(e.data.message);
            });
        }
    }

    setCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    render() {
        return (
            <div className="post">
                <div className="row">
                    <a target="_blank" href="/create"><button>Skapa kollektion</button></a>
                    <a target="_blank" href="/add"><button>Lägg till i kollektion</button></a>
                </div>
                <form className="row" onDrop={this.onDrop} onDragEnter={this.onEnter} onSubmit={(e) => e.preventDefault()}>
                <input type="file" id="input-file-upload" multiple={false} />
                    <div className="upload">
                        <h1>Upload</h1>
                    </div>
                </form>
            </div>
        )
    }
}


