/* eslint-disable import/no-unresolved, import/extensions */
import React, { PropTypes, PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
/* eslint-enable import/no-unresolved, import/extensions */
const propTypes = {
	text: PropTypes.string,
	size: PropTypes.number,
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 5,
		marginTop:5, 
		width: 38,
		height: 38,
		borderRadius: 38,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		color: 'white',
		fontSize : 16
	},
})


const colors = [
	'#e67e22', // carrot
	'#3498db', // peter river
	'#8e44ad', // wisteria
	'#e74c3c', // alizarin
	'#1abc9c', // turquoise
	'#2c3e50', // midnight blue
];

class AvatarUI extends PureComponent {

	renderAvatar(content, text) {
		return(<View style={[styles.container, { backgroundColor: this.getColor(text) }]} >
			{content}
		</View>);
	}

	getColor(name) {
		const length = name.length;
		return colors[length % colors.length];
	}

	render() {
		const { size, text } = this.props;
		let content = null;
		if (text && text.length > 0) {
			const newText = text.length > 1 ? text[0] + text[1] : text[0]
			if (size)
				content = <Text style={[styles.content, { fontSize: size }]}>{newText}</Text>;
			else
				content = <Text style={styles.content}>{newText}</Text>;
			return (
				<View style={{ flexGrow: 1 }}>
					{this.renderAvatar(content, text)}
				</View>
			);
		}
		console.log('null');
		return null;
	}
}

AvatarUI.propTypes = propTypes;
export default AvatarUI;