import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import SwipeableFlatList from '../components/SwipeableFlatList';
  
export default class NoificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  getNotifications = () => {
    this.notificationRef = db
      .collection('all_notifications')
      .where('notification_status', '==', 'unread')
      .where('receiver_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification['doc_id'] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.message}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        leftElement={<Icon name="tag" type="simple-line-icon" />}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#c4ffe4' }}>
        <MyHeader title="Notifications" navigation={this.props.navigation} />

        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length == 0 ? (
            <View style={styles.container}>
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                You Do Not Have Any New Notifications
              </Text>
            </View>
          ) : (
            <SwipeableFlatList allNotifications={this.state.allNotifications}/>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
