import React from "react";

export default class Icon extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};

		/* Static */
		this.icons = {
            "user"       : require("./assets/icons/user.svg").default,
            "calendar"   : require("./assets/icons/calendar.svg").default,
            "camera"     : require("./assets/icons/camera.svg").default,
            "expand"     : require("./assets/icons/expand.svg").default,
            "help-circle": require("./assets/icons/help-circle.svg").default,
            "map-pin"    : require("./assets/icons/map-pin.svg").default,
            "info"       : require("./assets/icons/info.svg").default,
            "maximize"   : require("./assets/icons/maximize.svg").default,
            "x"          : require("./assets/icons/x.svg").default,
            "chevron-down": require("./assets/icons/chevron-down.svg").default,
            "download": require("./assets/icons/download.svg").default,
		};
	}

	render() {
		return (
			<img style={{
                width: this.props.size,
                height: this.props.size,
            }} {...this.props} alt={"icon " + this.props.icon} src={this.icons[this.props.icon]} />
		)
	}
}
