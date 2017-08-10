import React from 'react';
import {
	Image,
	StyleSheet,
	View,
	Text,
	Dimensions,
} from 'react-native';

import Lightbox from 'react-native-lightbox';


const headerStyle = {
	fontSize: 14,
	marginTop: 3,
	marginLeft: 10,
	marginRight: 10,
	fontWeight: '400',
};

const imageStyle = {
	width: 150,
	height: 100,
	marginTop: 3,
	marginLeft: 10,
	marginRight: 10,
	resizeMode: 'cover',
};

const styles = {
	left: StyleSheet.create({
		container: {
		},
		header: {
			color: 'black',
			...headerStyle
		},
		image: {
			...imageStyle
		},
		imageActive: {
			resizeMode: 'contain',
		},
	}),

	right: StyleSheet.create({
		container: {
		},
		header: {
			color: 'black',
			...headerStyle
		},
		image: {
			...imageStyle
		},
		imageActive: {
			resizeMode: 'contain',
		},
	}),
};

// const styles = StyleSheet.create({
//   container: {
//   },
//   image: {
//     width: 150,
//     height: 100,
//     borderRadius: 13,
//     margin: 3,
//     resizeMode: 'cover',
//   },
//   imageActive: {
//     resizeMode: 'contain',
//   },
// });

const contextTypes = {
	actionSheet: React.PropTypes.func,
};


const defaultProps = {
	position: 'left',
	currentMessage: {
		image: null,
	},
	containerStyle: {},
	imageStyle: {},
	headerStyle: {},
	imageProps: {},
	lightboxProps: {},
};


const propTypes = {
	position: React.PropTypes.oneOf(['left', 'right']),
	currentMessage: React.PropTypes.object,
	containerStyle: React.PropTypes.shape({
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	imageStyle: React.PropTypes.shape({
		left: Image.propTypes.style,
		right: Image.propTypes.style,
	}),
	headerStyle: React.PropTypes.shape({
		left: Text.propTypes.style,
		right: Text.propTypes.style,
	}),
	imageProps: React.PropTypes.object,
	lightboxProps: React.PropTypes.object,
};


const colors = [
	'#e67e22', // carrot
	'#3498db', // peter river
	'#8e44ad', // wisteria
	'#e74c3c', // alizarin
	'#1abc9c', // turquoise
	'#2c3e50', // midnight blue
];

class MessageImageUI extends React.Component {

	constructor(props) {
		super(props);
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


	getHeader(props) {
		if (props.position.toString() == 'left') {
			return (
				<Text style={[styles[props.position].header, props.headerStyle[props.position], {
					color: this.getHeaderColor(props.currentMessage.user.name)}]}>
					{this.capitalize(props.currentMessage.user.name)}
				</Text>
			);
		}
		return null;
	}


	render() {
		const { width, height } = Dimensions.get('window');

		return (
			<View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
				{
					this.getHeader(this.props)
				}
				<Lightbox
					activeProps={{
						style: [styles[this.props.position].imageActive, { width, height }],
					}}
					
					{...this.props.lightboxProps}>
					
					<Image
						{...this.props.imageProps}
						style={[styles[this, props.position].image, this.props.imageStyle[this.props.position]]}
						source={{ uri: this.props.currentMessage.attachments[0] }} />

				</Lightbox>

			</View>
		);
	}
}


MessageImageUI.propTypes = propTypes;
MessageImageUI.contextTypes = contextTypes;
MessageImageUI.defaultProps = defaultProps;

export default MessageImageUI; 