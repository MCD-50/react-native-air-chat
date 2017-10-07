import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from 'react-native';


const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-end',
		alignItems: 'stretch'
	},
});

const defaultProps = {
	text: '',
	onButtonClick: () => { },
	label: 'Send',
	containerStyle: {},
	options: {
		link:'',
		hasButton: false,
		buttons: [],
	},
	textStyle: {},
};

const propTypes = {
	text: React.PropTypes.string,
	onButtonClick: React.PropTypes.func,
	label: React.PropTypes.string,
	containerStyle: View.propTypes.style,
	options: React.PropTypes.object,
	textStyle: Text.propTypes.style,
};

class ButtonUI extends React.Component {
	render() {
		const buttons = this.props.currentMessage.options.buttons.map(x => {
			return (<TouchableOpacity
				style={[styles.container, this.props.containerStyle]}
				onPress={() => { this.props.currentMessage.onButtonClick(this.props.currentMessage); }}
				accessibilityTraits="button">
				<View style={{ marginLeft: 5, marginRight: 10, marginBottom: 10 }}>
					<Text style={{ fontSize: 25, color: '#527DA3', fontWeight: 'normal', fontStyle: 'normal' }}></Text>
				</View>
			</TouchableOpacity>)
		})
		return buttons;
	}
}

ButtonUI.propTypes = propTypes;
ButtonUI.defaultProps = defaultProps;

export default ButtonUI;