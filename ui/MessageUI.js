import React from 'react';
import {
	View,
	StyleSheet
} from 'react-native';

//import AvatarUI from './AvatarUI';
import BubbleUI from './BubbleUI.js';
import DayUI from './DayUI.js';
import NoticationUI from './NotificationUI.js';
import ButtonUI from './ButtonUI.js';


import { isSameUser, isSameDay, warnDeprecated } from './UtilsUI.js';
const styles = {
	left: StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'flex-start',
			marginLeft: 8,
			marginRight: 0,
		},
	}),
	right: StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
			marginLeft: 0,
			marginRight: 8,
		},
	}),
};

const defaultProps = {
	renderAvatar: null,
	renderBubble: null,
	renderDay: null,
	position: 'left',
	currentMessage: {},
	nextMessage: {},
	previousMessage: {},
	user: {},
	options: {
		link:'',
		hasButton: true,
		buttons: []
	},
	containerStyle: {},
};

const propTypes = {
	renderAvatar: React.PropTypes.func,
	renderBubble: React.PropTypes.func,
	renderDay: React.PropTypes.func,
	renderNotification: React.PropTypes.func,
	position: React.PropTypes.oneOf(['left', 'right']),
	currentMessage: React.PropTypes.object,
	nextMessage: React.PropTypes.object,
	previousMessage: React.PropTypes.object,
	user: React.PropTypes.object,
	options: React.PropTypes.object,
	containerStyle: React.PropTypes.shape({
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
};

class MessageUI extends React.Component {

	renderDay() {
		if (this.props.currentMessage.createdAt) {
			const { containerStyle, ...dayProps } = this.props;
			if (this.props.renderDay) {
				return this.props.renderDay({
					...dayProps,
					isSameUser: warnDeprecated(isSameUser),
					isSameDay: warnDeprecated(isSameDay)
				});
			}
			return <DayUI {...dayProps} />;
		}
		return null;
	}

	renderNotification() {
		if (this.props.currentMessage.alert) {
			return <NoticationUI currentMessage={this.props.currentMessage} />;
		}
		return null;
	}


	renderButtons() {
		if (this.props.currentMessage.options.buttons.length > 0) {
			return <ButtonUI currentMessage={this.props.currentMessage} />;
		}
		return null;
	}

	renderBubble() {
		if (this.props.currentMessage.alert) {
			return null;
		} else {
			const { containerStyle, ...bubbleProps } = this.props;
			if (this.props.renderBubble) {
				return this.props.renderBubble({
					...bubbleProps,
					isSameUser: warnDeprecated(isSameUser),
					isSameDay: warnDeprecated(isSameDay)
				});
			}
			return <BubbleUI {...bubbleProps} />;
		}

	}


	render() {
		return (
			<View>
				{this.renderNotification()}
				{this.renderDay()}
				<View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position], {
					marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
				}]}>
					{this.renderBubble()}
				</View>
				{this.renderButtons()}
			</View>
		);
	}
}

MessageUI.propTypes = propTypes;
MessageUI.defaultProps = defaultProps;

export default MessageUI;