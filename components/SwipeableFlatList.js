import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';
import firebase from 'firebase';

export default class SwipeableFlatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications,
    };
  }

  updateMarkAsRead = (notifications) => {
    db.collection('all_notifications').doc(notifications.doc_id).update({
      notification_status: 'read',
    });
  };

  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get('window').width) {
      const newData = [...allNotifications];
      const prevIndex = allNotifications.findIndex(item => item.key === key)
      this.updateMarkAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({allNotifications: newData});
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = (data) => {
    return (
      <ListItem
        title={data.item.book_name}
        subtitle={data.item.message}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        leftElement={<Icon name="book-open" type="simple-line-icon" />}
        bottomDivider
      />
    );
  };

  renderHiddenItem = () => {
    <View>
      <Text></Text>
    </View>;
  };

  render() {
    return (
      <View>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
