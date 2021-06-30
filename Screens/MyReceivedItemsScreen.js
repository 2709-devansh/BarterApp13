import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class MyReceivedItemsScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      receivedItemList: [],
    };
    this.requestRef = null;
  }

  getReceivedItemList = () => {
    this.requestRef = db.collection('items')
      .where('user_id', '==', this.state.userId)
      .where('item_status', '==', 'received')
      .onSnapshot((snapshot) => {
        var receivedItemList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          receivedItemList: receivedItemList,
        });
      });
  };

  componentDidMount() {
    this.getReceivedItemList();
  }

  componentWillUnmount(){
    this.requestRef()
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.item_status}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        leftElement={<Icon name="tag" type="simple-line-icon" />}
        bottomDivider
      />
    );
  }; 

  render() {
    return (
      <View style={{flex:1}}>
        <MyHeader title="Received Books" navigation={this.props.navigation}/>

        {this.state.receivedItemList.length == 0 ? (
          <View style={styles.container}>
            <Text style={{fontSize:20}}> List Of All Received Books </Text>
          </View>
        ) : (
          <View style={styles.subContainer}>
            <FlatList
              data={this.state.receivedItemList}
              renderItem={this.renderItem}  
              keyExtractor={this.keyExtractor}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4ffe4',
    width:"100%",
    height:"100%"
  },

  subContainer: {
    flex: 1,
    fontSize: 20,
    width:"100%",
    height:"100%",
    backgroundColor: '#c4ffe4',
  },
})