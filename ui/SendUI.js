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
  onSend: () => { },
  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

const propTypes = {
  text: React.PropTypes.string,
  onSend: React.PropTypes.func,
  label: React.PropTypes.string,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};

class SendUI extends React.Component {
  render() {
    if (this.props.text.trim().length > 0) {
      return (<TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => { this.props.onSend({ text: this.props.text.trim() }, true); } }
        accessibilityTraits="button">
        <View style={{ marginLeft: 5, marginRight: 10, marginBottom: 10 }}>
          <Text style={{
            fontSize: 25,
            color: '#527DA3',
            fontWeight: 'normal',
            fontStyle: 'normal',
          }}>Send</Text>
        </View>
      </TouchableOpacity>);
    }
    else {

      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => { } }
          accessibilityTraits="button">
          <View style={{ marginLeft: 5, marginRight: 10, marginBottom: 10 }}>
            <Text style={{
              fontSize: 25,
              color: '#B8B8B8',
              fontWeight: 'normal',
              fontStyle: 'normal',
            }}>File</Text>
          </View>
        </TouchableOpacity>);
    }

  }
}

SendUI.propTypes = propTypes;
SendUI.defaultProps = defaultProps;

export default SendUI;