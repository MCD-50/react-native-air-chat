import React from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';


const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 10,
	},
	wrapper: {
		backgroundColor: '#f0f0f0',
		borderRadius: 4,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 3,
		paddingBottom: 3,
	},
	text: {
		backgroundColor: 'transparent',
		color: '#ababab',
		fontSize: 12,
		fontWeight: '300',
	},
});


const contextTypes = {
	getLocale: React.PropTypes.func,
};

const defaultProps = {
	currentMessage: {
		// TODO test if crash when createdAt === null
		createdAt: null,
	},
	previousMessage: {},
	containerStyle: {},
	wrapperStyle: {},
	textStyle: {},
};

const propTypes = {
	currentMessage: React.PropTypes.object,
	previousMessage: React.PropTypes.object,
	containerStyle: View.propTypes.style,
	wrapperStyle: View.propTypes.style,
	textStyle: Text.propTypes.style,
};

class NotificationUI extends React.Component {

	constructor(params) {
		super(params);
		this.capitalizeAndStrip = this.capitalizeAndStrip.bind(this);
	}

	capitalizeAndStrip(str) {
		let pieces;
		if (str.length > 40) {
			pieces = str.substring(0, 41).split(" ");
		} else {
			pieces = str.split(" ");
		}

		for (var i = 0; i < pieces.length; i++) {
			var j = pieces[i].charAt(0).toUpperCase();
			pieces[i] = j + pieces[i].substr(1);
		}
		return pieces.join(" ")
	}

	render() {
		return (
			<View style={[styles.container]}>
				<View style={[styles.wrapper]}>
					<Text style={[styles.text]}>
						{this.capitalizeAndStrip(this.props.currentMessage.text)}
					</Text>
				</View>
			</View>);
	}
}

NotificationUI.propTypes = propTypes;
NotificationUI.defaultProps = defaultProps;
NotificationUI.contextTypes = contextTypes;

export default NotificationUI;