/* Imports */
import React from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

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
            collection: {}
        }

        /* Static */
        this.backendURL = "http://127.0.0.1:8080/";
        this.id = this.props.router.params.id;
    }

    componentDidMount() {
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
    render() {
        return (
            <section className="collection-with-images">
                <div className="images">
                    {
                        this.state.collection.images && this.state.collection.images.map((image, index) => {
                            return (
                                <img key={index} src={this.backendURL + "uploads/" + image.pathname} alt="Cover" />
                            )
                        })
                    }
                </div>
            </section>
        )
    }
}

export default withRouter(Collection);
