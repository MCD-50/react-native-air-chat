import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
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
        color: '#FDFDFD',
        fontSize: 11,
        fontWeight: '400',
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
};

const propTypes = {
    currentMessage: React.PropTypes.object,
    previousMessage: React.PropTypes.object,
    containerStyle: View.propTypes.style,
    wrapperStyle: View.propTypes.style,
    textStyle: Text.propTypes.style,
};

class NotificationUI extends React.Component {

    constructor(params) {
        super(params);
        this.capitalizeAndStrip = this.capitalizeAndStrip.bind(this);
    }

    capitalizeAndStrip(str) {
        let pieces;
        if (str.length > 40) {
            pieces = str.substring(0, 41).split(" ");
        } else {
            pieces = str.split(" ");
        }

        for (var i = 0; i < pieces.length; i++) {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1);
        }
        return pieces.join(" ") + ' ...';
    }

    render() {

        if (this.props.currentMessage.isNotification) {
            return (<View style={[styles.container]}>
                <View style={[styles.wrapper]}>
                    <Text style={[styles.text]}>
                        {this.capitalizeAndStrip(this.props.currentMessage.text)}
                    </Text>
                </View>
            </View>)
        } else {
            return null;
        }


    }
}

NotificationUI.propTypes = propTypes;
NotificationUI.defaultProps = defaultProps;
NotificationUI.contextTypes = contextTypes;

export default NotificationUI;