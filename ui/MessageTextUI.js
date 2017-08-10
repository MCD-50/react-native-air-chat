import React from 'react';
import {
	Linking,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import Communications from './Communication.js';

const textStyle = {
	fontSize: 15,
};

const headerStyle = {
	fontSize: 14,
	fontWeight: '400',
};

const viewStyle = {
	marginTop: 3,
	marginLeft: 10,
	marginRight: 10,
}


const styles = {
	left: StyleSheet.create({
		container: {
			...viewStyle
		},
		view: {
			...viewStyle
		},
		header: {
			color: 'black',
			...headerStyle
		},
		text: {
			color: 'black',
			...textStyle,
		},
		link: {
			color: 'black',
			textDecorationLine: 'underline',
		},
	}),

	right: StyleSheet.create({
		container: {
			...viewStyle
		},
		view: {
			...viewStyle
		},
		header: {
			color: 'black',
			...headerStyle
		},
		text: {
			color: 'white',
			...textStyle,
		},

		link: {
			color: 'white',
			textDecorationLine: 'underline',
		},
	}),

};

const contextTypes = {
	actionSheet: React.PropTypes.func,
};

const defaultProps = {
	position: 'left',
	currentMessage: {
		text: '',
	},
	containerStyle: {},
	textStyle: {},
	viewStyle: {},
	headerStyle: {},
	linkStyle: {},
};

const propTypes = {
	position: React.PropTypes.oneOf(['left', 'right']),
	currentMessage: React.PropTypes.object,
	containerStyle: React.PropTypes.shape({
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	textStyle: React.PropTypes.shape({
		left: Text.propTypes.style,
		right: Text.propTypes.style,
	}),
	viewStyle: React.PropTypes.shape({
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	headerStyle: React.PropTypes.shape({
		left: Text.propTypes.style,
		right: Text.propTypes.style,
	}),
	linkStyle: React.PropTypes.shape({
		left: Text.propTypes.style,
		right: Text.propTypes.style,
	}),
};

const colors = [
	'#e67e22', // carrot
	'#3498db', // peter river
	'#8e44ad', // wisteria
	'#e74c3c', // alizarin
	'#1abc9c', // turquoise
	'#2c3e50', // midnight blue
];

class MessageTextUI extends React.Component {
	constructor(props) {
		super(props);
		this.onUrlPress = this.onUrlPress.bind(this);
		this.onPhonePress = this.onPhonePress.bind(this);
		this.onEmailPress = this.onEmailPress.bind(this);
		this.capitalize = this.capitalize.bind(this);
		this.getHeaderColor = this.getHeaderColor.bind(this);
		this.getHeader = this.getHeader.bind(this);
	}

	capitalize(str) {
		var pieces = str.split(" ");
		for (var i = 0; i < pieces.length; i++) {
			var j = pieces[i].charAt(0).toUpperCase();
			pieces[i] = j + pieces[i].substr(1);
		}
		return pieces.join(" ");
	}

	getHeaderColor(headerText) {
		const length = headerText.length;
		return colors[length % colors.length];
	}

	onUrlPress(url) {
		Linking.openURL(url);
	}

	onPhonePress(phone) {
		const options = [
			'Call',
			'Text',
			'Cancel',
		];
		const cancelButtonIndex = options.length - 1;
		this.context.actionSheet().showActionSheetWithOptions({
			options,
			cancelButtonIndex,
		},
			(buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						Communications.phonecall(phone, true);
						break;
					case 1:
						Communications.text(phone);
						break;
				}
			});
	}

	onEmailPress(email) {
		Communications.email([email], null, null, null, null);
	}

	getHeader(props) {
		if (props.position.toString() == 'left') {
			return (
				<View>
					<Text style={[styles[props.position].header, props.headerStyle[props.position], { color: this.getHeaderColor(props.currentMessage.user.name) }]}>
						{this.capitalize(props.currentMessage.user.name)}
					</Text>
					<Text style={{ marginTop: 5, fontSize: 12 }}>Subject - {props.currentMessage.communication.subject}</Text>
				</View>
			);
		}
		return null;
	}

	render() {
		return (
			<View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
				{
					this.getHeader(this.props)
				}

				<ParsedText
					style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}
					parse={[
						{ type: 'url', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onUrlPress },
						{ type: 'phone', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onPhonePress },
						{ type: 'email', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onEmailPress },
					]}>
					{this.props.currentMessage.text}
				</ParsedText>

			</View>
		);
	}
}


MessageTextUI.propTypes = propTypes;
MessageTextUI.defaultProps = defaultProps;
MessageTextUI.contextTypes = contextTypes;

export default MessageTextUI;