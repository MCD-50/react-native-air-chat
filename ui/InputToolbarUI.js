import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ComposerUI from './ComposerUI.js';
import SendUI from './SendUI.js';
import ActionsUI from './ActionsUI.js';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.2,
    borderTopColor: '#111111',
    backgroundColor: '#f7f7fa',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  
  accessory: {
    height: 51,
  },
});

const defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

const propTypes = {
  renderAccessory: React.PropTypes.func,
  renderActions: React.PropTypes.func,
  renderSend: React.PropTypes.func,
  renderComposer: React.PropTypes.func,
  onPressActionButton: React.PropTypes.func,
  containerStyle: View.propTypes.style,
  primaryStyle: View.propTypes.style,
  accessoryStyle: View.propTypes.style,
};

class InputToolbarUI extends React.Component {

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <ActionsUI {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <SendUI {...this.props} />;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return (
      <ComposerUI {...this.props} />
    );
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }

 
}

InputToolbarUI.propTypes = propTypes;
InputToolbarUI.defaultProps = defaultProps;

export default InputToolbarUI;