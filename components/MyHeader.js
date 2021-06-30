import React, { Component } from 'react';
import { Header, Icon, Badge, withBadge } from 'react-native-elements';
import { View, Text, StyeSheet, Alert } from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      value: '',
    };
  }

  getNumberOfNotifications() {
    db.collection('all_notifications')
      .where('notification_status', '==', 'unread')
      .where('receiver_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var unreadNotifications = snapshot.docs.map((doc) => doc.data());
        this.setState({
          value: unreadNotifications.length,
        });
      });
  }

  componentDidMount() {
    this.getNumberOfNotifications();
  }

  bellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="simple-line-icon"
          onPress={() => this.props.navigation.navigate('Notifications')}
        />
        <Badge
          value={this.state.value}
          containerStyle={{
            position: 'absolute',
            top: '-4',
            right: '0',
            width: 2,
            height: 2,
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="menu"
            type="simple-line-icon"
            onPress={() => this.props.navigation.toggleDrawer()}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: { color: '#90A5A9', fontSize: 20, fontWeight: 'bold' },
        }}
        rightComponent={<this.bellIconWithBadge {...this.props} />}
        backgroundColor="#eaf8fe"
      />
    );
  }
}
