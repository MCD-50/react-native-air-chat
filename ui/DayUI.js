import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import moment from 'moment';
import { isSameDay, isSameUser, warnDeprecated } from './UtilsUI.js';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    wrapper: {
        backgroundColor: '#B1BEC6',
        borderRadius: 4,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
    },
    text: {
        backgroundColor: 'transparent',
        color: '#ababab',
        fontSize: 12,
        fontWeight: '300',
    },
});


const contextTypes = {
    getLocale: React.PropTypes.func,
};

const defaultProps = {
    currentMessage: {
        // TODO test if crash when createdAt === null
        createdAt: null,
    },
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    isSameDay: warnDeprecated(isSameDay),
    isSameUser: warnDeprecated(isSameUser),
};

const propTypes = {
    currentMessage: React.PropTypes.object,
    previousMessage: React.PropTypes.object,
    containerStyle: View.propTypes.style,
    wrapperStyle: View.propTypes.style,
    textStyle: Text.propTypes.style,
    isSameDay: React.PropTypes.func,
    isSameUser: React.PropTypes.func,
};

class DayUI extends React.Component {

    render() {
        if (this.props.previousMessage.createdAt === undefined || !isSameDay(this.props.currentMessage, this.props.previousMessage)) {
            return (<View style={[styles.container, this.props.containerStyle]}>
                <Text style={[styles.text, this.props.textStyle]}>
                    {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('ll')}
                </Text>
            </View>);
        } else {
            return null;
        }
    }
}

DayUI.propTypes = propTypes;
DayUI.defaultProps = defaultProps;
DayUI.contextTypes = contextTypes;

export default DayUI;