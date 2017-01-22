import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

//import AvatarUI from './AvatarUI';
import BubbleUI from './BubbleUI.js';
import DayUI from './DayUI.js';
import NoticationUI from './NotificationUI.js';

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
  containerStyle: {},
};

const propTypes = {
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
};

class MessageUI extends React.Component {

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const {containerStyle, ...dayProps} = this.props;
      if (this.props.renderDay) {
        return this.props.renderDay({
          ...dayProps,
          //TODO: remove in next major release
          isSameUser: warnDeprecated(isSameUser),
          isSameDay: warnDeprecated(isSameDay)
        });
      }
      return <DayUI {...dayProps} />;
    }
    return null;
  }

  renderNotification() {
    if (this.props.currentMessage.isNotification) {
      return <NoticationUI currentMessage={this.props.currentMessage} />;
    }
    return null;
  }

  renderBubble() {
    if (this.props.currentMessage.isNotification) {
      return null;
    } else {
      const {containerStyle, ...bubbleProps} = this.props;
      if (this.props.renderBubble) {
        return this.props.renderBubble({
          ...bubbleProps,
          //TODO: remove in next major release
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
        {this.renderDay()}
        {this.renderNotification()}
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position], {
          marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
        }]}>

          {this.renderBubble()}

        </View>
      </View>
    );
  }
}

MessageUI.propTypes = propTypes;
MessageUI.defaultProps = defaultProps;

export default MessageUI;