import React from 'react';
import {
	Animated,
	InteractionManager,
	Platform,
	StyleSheet,
	View,
	Image,
} from 'react-native';

import ActionSheet from '@exponent/react-native-action-sheet';
import moment from 'moment';

import { isSameDay, isSameUser, warnDeprecated } from './UtilsUI.js';

import ActionsUI from './ActionsUI.js';
import BubbleUI from './BubbleUI.js';
import MessageImageUI from './MessageImageUI.js';
import MessageTextUI from './MessageTextUI.js';
import ComposerUI from './ComposerUI.js';
import DayUI from './DayUI.js';
import InputToolbarUI from './InputToolbarUI.js';
import LoadEarlierUI from './LoadEarlierUI.js';
import MessageUI from './MessageUI.js';
import MessageContainerUI from './MessageContainerUI.js';
import SendUI from './SendUI.js';
import TimeUI from './TimeUI.js';
import Communication from './Communication.js';

// Min and max heights of ToolbarInput and Composer
// Needed for Composer auto grow and ScrollView animation
// TODO move these values to Constants.js (also with used colors #b2b2b2)
const MIN_COMPOSER_HEIGHT = Platform.select({
	ios: 45,
	android: 45,
});

const MAX_COMPOSER_HEIGHT = 100;
const MIN_INPUT_TOOLBAR_HEIGHT = 51;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		width: null,
		height: null,
		resizeMode: 'cover'
	}
});

const childContextTypes = {
	actionSheet: React.PropTypes.func,
	getLocale: React.PropTypes.func,
};

const defaultProps = {
	messages: [],
	onSend: () => { },
	onRespond: () => { },
	onLoadEarlier: () => { },
	loadEarlier: false,
	locale: null,
	isAnimated: Platform.select({
		ios: true,
		android: false,
	}),
	keyboardShouldPersistTaps: Platform.select({
		ios: 'never',
		android: 'always',
	}),
	renderAccessory: null,
	renderActions: null,
	renderBubble: null,
	renderFooter: null,
	renderChatFooter: null,
	renderMessageText: null,
	renderInteractiveChat: null,
	renderInteractiveList: null,
	renderMessageImage: null,
	renderComposer: null,
	renderCustomView: null,
	renderDay: null,
	renderInputToolbar: null,
	renderLoadEarlier: null,
	renderLoading: null,
	renderMessage: null,
	renderSend: null,
	renderTime: null,
	user: {
		_id: null,
		name: null
	},
	attachments: [],
	communication: null,
	alert:false,
	bottomOffset: 0,
	isLoadingEarlier: false,
};

const propTypes = {
	messages: React.PropTypes.array,
	onSend: React.PropTypes.func,
	onRespond: React.PropTypes.func,
	onLoadEarlier: React.PropTypes.func,
	loadEarlier: React.PropTypes.bool,
	locale: React.PropTypes.string,
	isAnimated: React.PropTypes.bool,
	renderAccessory: React.PropTypes.func,
	renderActions: React.PropTypes.func,
	renderBubble: React.PropTypes.func,
	renderFooter: React.PropTypes.func,
	renderChatFooter: React.PropTypes.func,
	renderMessageText: React.PropTypes.func,
	renderInteractiveChat: React.PropTypes.func,
	renderInteractiveList: React.PropTypes.func,
	renderMessageImage: React.PropTypes.func,
	renderComposer: React.PropTypes.func,
	renderCustomView: React.PropTypes.func,
	renderDay: React.PropTypes.func,
	renderInputToolbar: React.PropTypes.func,
	renderLoadEarlier: React.PropTypes.func,
	renderLoading: React.PropTypes.func,
	renderMessage: React.PropTypes.func,
	renderSend: React.PropTypes.func,
	renderTime: React.PropTypes.func,
	user: React.PropTypes.object,
	attachments:React.PropTypes.array,
	communication: React.PropTypes.object,
	alert:React.PropTypes.bool,
	bottomOffset: React.PropTypes.number,
	isLoadingEarlier: React.PropTypes.bool,
	keyboardShouldPersistTaps: React.PropTypes.oneOf(['always', 'never', 'handled']),
};


class AirChatUI extends React.Component {
	constructor(props) {
		super(props);

		// default values
		this._isMounted = false;
		this._keyboardHeight = 0;
		this._bottomOffset = 0;
		this._maxHeight = null;
		this._touchStarted = false;
		this._isFirstLayout = true;
		this._isTypingDisabled = false;
		this._locale = 'en';
		this._messages = [];

		this.state = {
			isInitialized: false, // initialization will calculate maxHeight before rendering the chat
		};

		this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
		this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
		this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
		this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
		this.onType = this.onType.bind(this);
		this.onSend = this.onSend.bind(this);
		this.onRespond = this.onRespond.bind(this);
		this.getLocale = this.getLocale.bind(this);


		this.invertibleScrollViewProps = {
			inverted: true,
			keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
			onKeyboardWillShow: this.onKeyboardWillShow,
			onKeyboardWillHide: this.onKeyboardWillHide,
			onKeyboardDidShow: this.onKeyboardDidShow,
			onKeyboardDidHide: this.onKeyboardDidHide,
		};
	}

	static append(currentMessages = [], messages) {
		if (!Array.isArray(messages)) {
			messages = [messages];
		}
		return messages.concat(currentMessages);
	}

	static prepend(currentMessages = [], messages) {
		if (!Array.isArray(messages)) {
			messages = [messages];
		}
		return currentMessages.concat(messages);
	}

	getChildContext() {
		return {
			actionSheet: () => this._actionSheetRef,
			getLocale: this.getLocale,
		};
	}

	componentWillMount() {
		this.setIsMounted(true);
		this.initLocale();
		this.initMessages(this.props.messages);
	}

	componentWillUnmount() {
		this.setIsMounted(false);
	}


	componentWillReceiveProps(nextProps = {}) {
		this.initMessages(nextProps.messages);
	}

	initLocale() {
		if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
			this.setLocale('en');
		} else {
			this.setLocale(this.props.locale);
		}
	}

	initMessages(messages = []) {
		this.setMessages(messages);
	}

	setLocale(locale) {
		this._locale = locale;
	}

	getLocale() {
		return this._locale;
	}

	setMessages(messages) {
		this._messages = messages;
	}

	getMessages() {
		return this._messages;
	}

	setMaxHeight(height) {
		this._maxHeight = height;
	}

	getMaxHeight() {
		return this._maxHeight;
	}

	setKeyboardHeight(height) {
		this._keyboardHeight = height;
	}

	getKeyboardHeight() {
		return this._keyboardHeight;
	}

	setBottomOffset(value) {
		this._bottomOffset = value;
	}

	getBottomOffset() {
		return this._bottomOffset;
	}

	setIsFirstLayout(value) {
		this._isFirstLayout = value;
	}

	getIsFirstLayout() {
		return this._isFirstLayout;
	}

	setIsTypingDisabled(value) {
		this._isTypingDisabled = value;
	}

	getIsTypingDisabled() {
		return this._isTypingDisabled;
	}

	setIsMounted(value) {
		this._isMounted = value;
	}

	getIsMounted() {
		return this._isMounted;
	}

	// TODO
	// setMinInputToolbarHeight
	getMinInputToolbarHeight() {
		if (this.props.renderAccessory) {
			return MIN_INPUT_TOOLBAR_HEIGHT * 2;
		}
		return MIN_INPUT_TOOLBAR_HEIGHT;
	}

	prepareMessagesContainerHeight(value) {
		if (this.props.isAnimated === true) {
			return new Animated.Value(value);
		}
		return value;
	}

	onKeyboardWillShow(e) {
		this.setIsTypingDisabled(true);
		this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
		this.setBottomOffset(this.props.bottomOffset);
		const newMessagesContainerHeight = (this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT))) - this.getKeyboardHeight() + this.getBottomOffset();
		if (this.props.isAnimated === true) {
			Animated.timing(this.state.messagesContainerHeight, {
				toValue: newMessagesContainerHeight,
				duration: 50,
			}).start();
		} else {
			this.setState((previousState) => {
				return {
					messagesContainerHeight: newMessagesContainerHeight,
				};
			});
		}
	}

	onKeyboardWillHide() {
		this.setIsTypingDisabled(true);
		this.setKeyboardHeight(0);
		this.setBottomOffset(0);
		const newMessagesContainerHeight = this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT));
		if (this.props.isAnimated === true) {
			Animated.timing(this.state.messagesContainerHeight, {
				toValue: newMessagesContainerHeight,
				duration: 50,
			}).start();
		} else {
			this.setState((previousState) => {
				return {
					messagesContainerHeight: newMessagesContainerHeight,
				};
			});
		}
	}

	onKeyboardDidShow(e) {
		if (Platform.OS === 'android') {
			this.onKeyboardWillShow(e);
		}
		this.setIsTypingDisabled(false);
	}

	onKeyboardDidHide(e) {
		if (Platform.OS === 'android') {
			this.onKeyboardWillHide(e);
		}
		this.setIsTypingDisabled(false);
	}

	scrollToBottom(animated = true) {
		this._messageContainerRef.scrollTo({
			y: 0,
			animated,
		});
	}

	renderMessages() {
		const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
		const props = {
			...this.props,
			onRespond: this.onRespond,
		}

		return (
			<AnimatedView style={{
				height: this.state.messagesContainerHeight,
			}}>
				<MessageContainerUI
					{...props}

					invertibleScrollViewProps={this.invertibleScrollViewProps}
					messages={this.getMessages()}
					ref={component => this._messageContainerRef = component}
				/>
				{this.renderChatFooter()}
			</AnimatedView>
		);
	}



	onSend(messages = [], shouldResetInputToolbar = false) {
		if (!Array.isArray(messages)) {
			messages = [messages];
		}

		messages = messages.map((message) => {
			return {
				...message,
				user: this.props.user,
				communication: this.props.communication,
				attachments: this.props.attachments,
				alert:this.props.alert,
				createdAt: new Date(),
				_id: Math.round(Math.random() * 1000000),
			};
		});

		if (shouldResetInputToolbar === true) {
			this.setIsTypingDisabled(true);
			this.resetInputToolbar();
		}

		this.props.onSend(messages);
		this.scrollToBottom();

		if (shouldResetInputToolbar === true) {
			setTimeout(() => {
				if (this.getIsMounted() === true) {
					this.setIsTypingDisabled(false);
				}
			}, 50);
		}
	}

	onRespond(message) {
		this.props.onRespond(message);
	}

	/*
	What about row height * item index? Let's say you want to scroll to 20th element in your ListView. Each row has height: 50. We calculate an offset at 20th element by using formula I mentioned above: 50 * 20 = 1000. Then use scrollTo(0, 1000) and you'll scroll to the desired element.

	To be able to scroll back, you need to store an offset before you apply a scrollTo function:

	var scrollProperties = this.refs.listView.scrollProperties;
	var scrollOffset = scrollProperties.contentLength - scrollProperties.visibleLength;
	After you hook up on keyboard's event (keyboardWillHide from the DeviceEventEmitter), you can do scrollTo to the previous offset.
	*/

	resetInputToolbar() {
		this.setState((previousState) => {
			return {
				text: '',
				composerHeight: MIN_COMPOSER_HEIGHT,
				messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - this.getKeyboardHeight() + this.getBottomOffset()),
			};
		});
	}

	calculateInputToolbarHeight(newComposerHeight) {
		return newComposerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT);
	}

	onType(e) {
		if (this.getIsTypingDisabled() === true) {
			return;
		}

		let newComposerHeight = null;
		if (e.nativeEvent && e.nativeEvent.contentSize) {
			newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, e.nativeEvent.contentSize.height));
		} else {
			newComposerHeight = MIN_COMPOSER_HEIGHT;
		}

		const newMessagesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight() + this.getBottomOffset();
		const newText = e.nativeEvent.text;
		this.setState((previousState) => {
			return {
				text: newText,
				composerHeight: newComposerHeight,
				messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
			};
		});
	}

	renderInputToolbar() {
		const inputToolbarProps = {
			...this.props,
			text: this.state.text,
			composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
			onChange: this.onType,
			onSend: this.onSend,
		};

		if (this.props.renderInputToolbar) {
			return this.props.renderInputToolbar(inputToolbarProps);
		}
		return (
			<InputToolbarUI
				{...inputToolbarProps}
			/>
		);
	}




	renderChatFooter() {
		if (this.props.renderChatFooter) {
			const footerProps = {
				...this.props,
			};
			return this.props.renderChatFooter(footerProps);
		}
		return null;
	}

	renderLoading() {
		if (this.props.renderLoading) {
			return this.props.renderLoading();
		}
		return null;
	}

	render() {
		if (this.state.isInitialized === true) {
			return (
				<ActionSheet ref={component => this._actionSheetRef = component}>
					<View
						style={[styles.container, { backgroundColor: '#fefefe' }]}
						onLayout={(e) => {
							if (Platform.OS === 'android') {
								// fix an issue when keyboard is dismissing during the initialization
								const layout = e.nativeEvent.layout;
								if (this.getMaxHeight() !== layout.height && this.getIsFirstLayout() === true) {
									this.setMaxHeight(layout.height);
									this.setState({
										messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight()),
									});
								}
							}
							if (this.getIsFirstLayout() === true) {
								this.setIsFirstLayout(false);
							}
						}}
					>
						{this.renderMessages()}
						{this.renderInputToolbar()}
					</View>
				</ActionSheet>
			);
		}

		return (
			<View
				style={[styles.container, { backgroundColor: '#fefefe' }]}
				onLayout={(e) => {
					const layout = e.nativeEvent.layout;
					this.setMaxHeight(layout.height);
					InteractionManager.runAfterInteractions(() => {
						this.setState({
							isInitialized: true,
							text: '',
							composerHeight: MIN_COMPOSER_HEIGHT,
							messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight()),
						});
					});
				}}
			>
				{this.renderLoading()}
			</View>
		);
	}
}

AirChatUI.propTypes = propTypes;
AirChatUI.defaultProps = defaultProps;
AirChatUI.childContextTypes = childContextTypes;

export {
	AirChatUI,
	ActionsUI,
	BubbleUI,
	MessageImageUI,
	MessageTextUI,
	ComposerUI,
	DayUI,
	InputToolbarUI,
	LoadEarlierUI,
	MessageUI,
	SendUI,
	TimeUI,
	Communication,
	isSameDay,
	isSameUser,
	warnDeprecated,
};
