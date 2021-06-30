import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase'; 
import db from '../config';
import { ListItem, Icon } from 'react-native-elements'; 

export default class MyBartersScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allBarters: [],
      userId: firebase.auth().currentUser.email,
      exchangerName: '',
    };
    this.requestRef = null;
  }

  getExchangerName(exchangerId) {
    db.collection('users')
      .where('email_id', '==', exchangerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            exchangerName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  }

  getAllBarters = () => {
    this.requestRef = db
      .collection('all_barters')
      .where('exchager_user_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allBarters = snapshot.docs.map((doc) => doc.data());
        this.setState({
          allBarters: allBarters,
        });
      });
  };

  sendNotification = (itemDetails, requestStatus) => {
    var exchangeId = itemDetails.exchange_id;
    var exchangerUserId = itemDetails.exchanger_user_id;
    db.collection('all_notifications')
      .where('exchange_id', '==', exchangeId)
      .where('exchanger_user_id', '==', exchangerUserId)
      
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = '';
          if (requestStatus == 'Item Sent') {
            message = this.state.exchangerName + 'Sent Your Item';
          } else {
            message =
              this.state.exchangerName +
              'Has shown interest in donating the book';
          }
          db.collection('all_notifications').doc(doc.id).update({
            message: message,
            notification_status: 'unread',
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendItem = (itemDetails) => {
    if (itemDetails.request_status === 'Item Sent') {
      var requestStatus = 'Exchanger Interested';
      db.collection('all_barters').doc(itemDetails.doc.id).update({
        request_status: 'Exchanger Interested',
      });
      this.sendNotification(itemDetails, requestStatus);
    } else {
      var requsetStatus = 'Item Sent';
      db.collection('all_barters').doc(itemDetails.doc.id).update({
        request_status: 'Item Sent',
      });
      this.sendNotification(itemDetails, requestStatus);
    }
  };

  componentDidMount() {
    this.getAllBarters();
    this.getExchangerName(this.state.userId);
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.item_name}
      subtitle={'Requested By : ' + item.receiver_id + ' ' + item.request_status}
      leftElement={<Icon name="tag" type="simple-line-icon" />}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
        <TouchableOpacity style={styles.button} onPress={()=>{this.sendItem(item)}}>
          <Text style={styles.buttonText}>Exchange</Text> 
        </TouchableOpacity>
      }
      bottomDivider
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="MY BARTERS" navigation={this.props.navigation} />
        <View style={styles.container}>
          {this.state.allBarters.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all Barters</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allBarters}
              renderItem={this.renderItem}
            />
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
    backgroundColor: '#c4ffe4',
  },

  button: {
    borderRadius: 10,
    backgroundColor: 'orange',
    borderBottomWidth: 5,
    borderBottomColor: 'black',
    width: '35%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    alignSelf: 'center',
  },

  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
