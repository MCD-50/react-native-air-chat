# Air Chat
Chat UI for react native.
Inspired by Gifted chat

## Dependency
React Native minimum version `0.29.0`

## Installation
`npm install react-native-air-chat --save`

## Android installation
- Add `android:windowSoftInputMode="adjustResize"` to your Android Manifest `android/app/src/main/AndroidManifest.xml`
```xml
<!-- ... -->
<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:windowSoftInputMode="adjustResize"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
<!-- ... -->
```

- If you plan to use `AirChat` inside a `Modal`, see [#200](https://github.com/FaridSafi/react-native-gifted-chat/issues/200)


## Example
```jsx
import { AirChatUI } from 'react-native-air-chat';

class Example extends React.Component {
  constructor(props) {
    super(props);
    //pass props in route object while navigating to this page

    //isPrivate : true || false
    //isPrivate set true if in private chat else set false

    //isNotification : false || true
    //isNotification set true to display notification in middle instead of chat bubble else false

    this.state = {messages: [], 
    id: this.props.route.id, 
    isPrivate : this.props.route.isPrivate, 
    isNotification: this.props.route.isNotification, };
    this.onSend = this.onSend.bind(this);
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            isPrivate : this.state.isPrivate,
          },
          isNotification : this.props.isNotification,
        },
      ],
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: AirChatUI.append(previousState.messages, messages),
      };
    });
  }
  render() {
    return (
      <AirChatUI
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
          name : 'User',
          isPrivate : this.state.isPrivate
        }}
      />
    );
  }
}

```