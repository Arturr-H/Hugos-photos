/* Imports */
import React from "react";
import Globals from "../Globals";
import axios from "axios";

/* Main */
export default class Post extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            hovering: false,
        }
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

        this.setState({ hovering: true });
    }
    onDrop = (e) => {
        this.setState({ hovering: false });
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
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
    }

    render() {
        return (
            <div className="post">
                <div className="row">
                    <a target="_blank" href="/create"><button>Skapa kollektion</button></a>
                    <a target="_blank" href="/add"><button>Lägg till i kollektion</button></a>
                </div>
                <form
                    className={"row" + (this.state.hovering ? " row-hover" : "")}
                    onDrop={this.onDrop}
                    onDragEnter={this.onEnter}
                    onSubmit={(e) => e.preventDefault()}
                    onDragLeave={() => this.setState({ hovering: false })}
                >
                    <input type="file" id="input-file-upload" multiple={false} />
                    <div className="upload" style={{ flexDirection: "column" }}>
                        <h1 style={{ margin: 0, padding: 0, pointerEvents: "none" }}>
                            {
                                this.state.hovering
                                ? "SLÄPPPP!!!"
                                : "Upload"
                            }
                        </h1>
                        <p style={{ margin: 0, padding: 0, pointerEvents: "none" }}>
                            {
                                this.state.hovering
                                    ? "Nu är det bara att släppa filen. Brrrrr skipiti dop dop dop yes yes yes 🎉🎉🎉"
                                    : "Drag & Droppa din AUTH fil hitåt. Det borde stå på skärmen sen att det gick bra 👍😨"
                            }
                        </p>
                    </div>
                </form>
            </div>
        )
    }
}


