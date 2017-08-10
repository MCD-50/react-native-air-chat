import React from 'react';
import {
	Text,
	Clipboard,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import MessageTextUI from './MessageTextUI.js';
import MessageImageUI from './MessageImageUI.js';
import TimeUI from './TimeUI.js';

import { isSameDay, isSameUser, warnDeprecated } from './UtilsUI.js';


let oldright = '#E1FFC1';

let newright = '#0086ff';
let newleft = '#f0f0f0';


const styles = {
	left: StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'flex-start',
		},
		wrapper: {
			borderRadius: 16,
			backgroundColor: newleft,
			marginRight: 60,
			minHeight: 20,
			justifyContent: 'flex-end',
		},
		containerToNext: {
			borderBottomLeftRadius: 16,
		},

		containerToPrevious: {
			borderTopLeftRadius: 0,
		},
	}),
	right: StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'flex-end',
		},
		wrapper: {
			borderRadius: 16,
			backgroundColor: newright,
			marginLeft: 60,
			minHeight: 20,
			justifyContent: 'flex-end',
		},
		containerToNext: {
			borderBottomRightRadius: 16,
		},
		containerToPrevious: {
			borderTopRightRadius: 0,
		},
	}),
	bottom: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	tick: {
		fontSize: 10,
		backgroundColor: 'transparent',
		color: 'white',
	},
	tickView: {
		flexDirection: 'row',
		marginRight: 5,
	}
};

const contextTypes = {
	actionSheet: React.PropTypes.func,
};

const defaultProps = {
	touchableProps: {},
	onLongPress: null,
	renderMessageImage: null,
	renderMessageText: null,
	renderInteractiveChat: null,
	renderInteractiveList: null,
	renderCustomView: null,
	renderTime: null,
	position: 'left',
	currentMessage: {
		text: null,
		createdAt: null,
		image: null,
	},
	nextMessage: {},
	previousMessage: {},
	containerStyle: {},
	wrapperStyle: {},
	tickStyle: {},
	containerToNextStyle: {},
	containerToPreviousStyle: {},

	isSameDay: warnDeprecated(isSameDay),
	isSameUser: warnDeprecated(isSameUser),
};

const propTypes = {
	touchableProps: React.PropTypes.object,
	onLongPress: React.PropTypes.func,
	renderMessageImage: React.PropTypes.func,
	renderMessageText: React.PropTypes.func,
	renderCustomView: React.PropTypes.func,
	renderInteractiveChat: React.PropTypes.func,
	renderInteractiveList: React.PropTypes.func,
	renderTime: React.PropTypes.func,
	position: React.PropTypes.oneOf(['left', 'right']),
	currentMessage: React.PropTypes.object,
	nextMessage: React.PropTypes.object,
	previousMessage: React.PropTypes.object,
	containerStyle: React.PropTypes.shape({
		center: View.propTypes.style,
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	wrapperStyle: React.PropTypes.shape({
		center: View.propTypes.style,
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	tickStyle: Text.propTypes.style,
	containerToNextStyle: React.PropTypes.shape({
		center: View.propTypes.style,
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	containerToPreviousStyle: React.PropTypes.shape({
		center: View.propTypes.style,
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
	//TODO: remove in next major release
	isSameDay: React.PropTypes.func,
	isSameUser: React.PropTypes.func,
};


class BubbleUI extends React.Component {
	constructor(props) {
		super(props);
		this.onLongPress = this.onLongPress.bind(this);

	}

	handleBubbleToNext() {
		if (isSameUser(this.props.currentMessage, this.props.nextMessage) && isSameDay(this.props.currentMessage, this.props.nextMessage)) {
			return StyleSheet.flatten([styles[this.props.position].containerToNext, this.props.containerToNextStyle[this.props.position]]);
		}
		return null;
	}

	handleBubbleToPrevious() {
		if (isSameUser(this.props.currentMessage, this.props.previousMessage) && isSameDay(this.props.currentMessage, this.props.previousMessage)) {
			return StyleSheet.flatten([styles[this.props.position].containerToPrevious, this.props.containerToPreviousStyle[this.props.position]]);
		}
		return null;
	}

	renderMessageText() {
		if (this.props.currentMessage.text) {
			const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
			if (this.props.renderMessageText) {
				return this.props.renderMessageText(messageTextProps);
			}
			return <MessageTextUI {...messageTextProps} />;
		}
		return null;
	}

	renderMessageImage() {
		if (this.props.currentMessage.attachments && this.props.currentMessage.attachments.length > 0) {
			const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
			if (this.props.renderMessageImage) {
				return this.props.renderMessageImage(messageImageProps);
			}
			return <MessageImageUI {...messageImageProps} />;
		}
		return null;
	}

	renderTicks() {
		const { currentMessage } = this.props;
		if (this.props.renderTicks) {
			return this.props.renderTicks(currentMessage);
		}
		if (currentMessage.user._id !== this.props.user._id) {
			return;
		}
		if (currentMessage.sent) {
			return (
				<View style={styles.tickView}>
					{currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
					{currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
				</View>
			)
		}
	}

	renderTime() {
		if (this.props.currentMessage.createdAt) {
			const { containerStyle, wrapperStyle, ...timeProps } = this.props;
			if (this.props.renderTime) {
				return this.props.renderTime(timeProps);
			}
			return <TimeUI {...timeProps} />;
		}
		return null;
	}

	renderCustomView() {
		if (this.props.renderCustomView) {
			return this.props.renderCustomView(this.props);
		}
		return null;
	}

	onLongPress() {
		if (this.props.onLongPress) {
			this.props.onLongPress(this.context);
		} else {
			if (this.props.currentMessage.text) {
				const options = [
					'Copy text',
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
								Clipboard.setString(this.props.currentMessage.text);
								break;
						}
					});
			}
		}
	}

	render() {
		return (
			<View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
				<View style={[styles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.handleBubbleToNext(), this.handleBubbleToPrevious()]}>
					<TouchableWithoutFeedback
						onLongPress={this.onLongPress}
						accessibilityTraits="text"
						{...this.props.touchableProps}>
						
						<View>
							{this.renderCustomView()}
							{this.renderMessageText()}
							{this.renderMessageImage()}
							<View style={styles.bottom}>
								{this.renderTime()}
								{this.renderTicks()}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		);
	}
}


BubbleUI.propTypes = propTypes;
BubbleUI.defaultProps = defaultProps;
BubbleUI.contextTypes = contextTypes;

export default BubbleUI;