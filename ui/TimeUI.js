import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import moment from 'moment';


const containerStyle = {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 1,
    marginBottom: 3
};

const textStyle = {
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'right',
};

const styles = {
    left: StyleSheet.create({
        container: {
            ...containerStyle,
        },
        text: {
            color: '#ababab',
            ...textStyle,
        },
    }),
    right: StyleSheet.create({
        container: {
            ...containerStyle,
        },
        text: {
            color: '#f7f8fa',
            ...textStyle,
        },
    }),
};

const contextTypes = {
    getLocale: React.PropTypes.func,
};

const defaultProps = {
    position: 'left',
    currentMessage: {
        createdAt: null,
    },
    containerStyle: {},
    textStyle: {},
};

const propTypes = {
    position: React.PropTypes.oneOf(['left', 'right']),
    currentMessage: React.PropTypes.object,
    containerStyle: React.PropTypes.shape({
        left: View.propTypes.style,
        right: View.propTypes.style,
    }),
    textStyle: React.PropTypes.shape({
        left: Text.propTypes.style,
        right: Text.propTypes.style,
    }),
};

class TimeUI extends React.Component {
    render() {
        return (
            <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
                <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}>
                    {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
                </Text>
            </View>
        );
    }
}

TimeUI.propTypes = propTypes;
TimeUI.defaultProps = defaultProps;
TimeUI.contextTypes = contextTypes;

export default TimeUI;
