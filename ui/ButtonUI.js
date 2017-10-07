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
		link: '',
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
		console.log(this.props);
		const buttons = this.props.currentMessage.currentMessage.options.buttons.map((x, key) => {
			return (
				<TouchableOpacity
				key={key}
				style={[styles.container, this.props.currentMessage.currentMessage.containerStyle]}
				onPress={() =>{this.props.currentMessage.onButtonClick(this.props.currentMessage.currentMessage, x)}}
				accessibilityTraits="button">
				<View style={{ marginLeft: 5, marginRight: 10, padding:10, marginBottom: 10, maxWidth:150,
					backgroundColor:'#f0f0f0', 
				borderBottomLeftRadius: 16,
				borderBottomRightRadius: 16,
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
				justifyContent:'center'}}>
					<Text style={{ color: 'black', fontWeight: 'normal', fontStyle: 'normal' }}> {x} </Text>
				</View>
			</TouchableOpacity>)
		})
		return (<View style={{flex:1, flexDirection:'column', flexWrap:'wrap'}} >{ buttons }</View>);
	}
}

ButtonUI.propTypes = propTypes;
ButtonUI.defaultProps = defaultProps;

export default ButtonUI;