import React from 'react';
import {
	Platform,
	StyleSheet,
	TextInput,
} from 'react-native';

const styles = StyleSheet.create({
	textInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 18,
		marginTop: 3,
		marginBottom: 3,
	},
});


const defaultProps = {
	onChange: () => { },
	composerHeight: Platform.select({
		ios: 45,
		android: 45,
	}),
	text: '',
	placeholder: 'Your message',
	placeholderTextColor: '#b8b8b8',
	textInputProps: null,
	multiline: true,
	textInputStyle: {},
};

const propTypes = {
	onChange: React.PropTypes.func,
	composerHeight: React.PropTypes.number,
	text: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	placeholderTextColor: React.PropTypes.string,
	textInputProps: React.PropTypes.object,
	multiline: React.PropTypes.bool,
	textInputStyle: TextInput.propTypes.style,
};

class ComposerUI extends React.Component {
	render() {
		return (
			<TextInput
				placeholder={this.props.placeholder}
				placeholderTextColor={this.props.placeholderTextColor}
				multiline={this.props.multiline}
				onChange={(e) => {
					this.props.onChange(e);
				}}
				style={[styles.textInput, this.props.textInputStyle, {
					height: this.props.composerHeight
				}]}
				autoCapitalize='sentences'
				value={this.props.text}
				accessibilityLabel={this.props.text || this.props.placeholder}
				enablesReturnKeyAutomatically={true}
				underlineColorAndroid="transparent"
				{...this.props.textInputProps}
				/>
		);
	}
}

ComposerUI.propTypes = propTypes;
ComposerUI.defaultProps = defaultProps;

export default ComposerUI;