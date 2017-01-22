import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import Lightbox from 'react-native-lightbox';

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    resizeMode: 'contain',
  },
});


const defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
};

const propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,
  lightboxProps: React.PropTypes.object,
};

class MessageImageUI extends React.Component {
  render() {
    const { width, height } = Dimensions.get('window');

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Lightbox
          activeProps={{
            style: [styles.imageActive, { width, height }],
          }}
          {...this.props.lightboxProps}
          >
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{ uri: this.props.currentMessage.image }}
            />
        </Lightbox>
      </View>
    );
  }
}


MessageImageUI.propTypes = propTypes;
MessageImageUI.defaultProps = defaultProps;

export default MessageImageUI; 