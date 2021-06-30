import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Button,
} from 'react-native';
import { Header, Card } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class ReceiverDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverName: '',
      receiverContact: '',
      receiverAddress: '',
      itemExchangeId: this.props.navigation.getParam('details')['exchange_id'],
      requestedItemDescription: this.props.navigation.getParam('details')[
        'item_description'
      ],
      requestedItemName: this.props.navigation.getParam('details')['item_name'],
      userId: firebase.auth().currentUser.email,
      receiverId: this.props.navigation.getParam('details')['user_id'],
      requestDocId: '',
      userName: '',
      itemValue: this.props.navigation.getParam('details')['item_value'],
    };
  }

  getUserDetails = (userId) => {
    db.collection('users')
      .where('email_id', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data().first_name);
          this.setState({
            userName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  };

  getReceiverDetails() {
    db.collection('users')
      .where('email_id', '==', this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            receiverName: data.first_name,
            receiverContact: data.contact,
            receiverAddress: data.address,
          });
        });
      });

    db.collection('items')
      .where('exchange_id', '==', this.state.itemExchangeId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            requestDocId: doc.id,
          });
        });
      });
  }

  addBarters = () => {
    db.collection('all_barters').add({
      item_name: this.state.requestedItemName,
      item_description: this.state.requestedItemDescription,
      exchange_id: this.state.itemExchangeId,
      exchager_user_id: this.state.userId,
      receiver_name: this.state.receiverName,
      receiver_contact: this.state.receiverContact,
      receiver_address: this.state.receiverAddress,
      receiver_id: this.state.receiverId,
      request_status: 'Exchanger Interested',
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + ' Has Shown Interest in Exchanging The Item';
    db.collection('all_notifications').add({
      receiver_id: this.state.receiverId,
      exchager_user_id: this.state.userId,
      exchange_id: this.state.exchangeId,
      item_name: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: 'unread',
      message: message,
    });
  };

  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ backgroundColor: '#c4ffe4', flex: 1 }}>
        <MyHeader title="Receiver Details" navigation={this.props.navigation} />

        <Card>
          <Text
            style={{ fontWeight: 'bold', fontSize: 17, textAlign: 'center' }}>
            ITEM INFORMATION
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Item Name : {this.state.requestedItemName}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Item Description : {this.state.requestedItemDescription}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Item Value : {this.state.itemValue}
          </Text>
        </Card>

        <Card>
          <Text
            style={{ fontWeight: 'bold', fontSize: 17, textAlign: 'center' }}>
            RECEIVER INFORMATION
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Name : {this.state.receiverName}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Contact : {this.state.receiverContact}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Address : {this.state.receiverAddress}
          </Text>
        </Card>

        {this.state.receiverId !== this.state.userId ? (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addBarters();
                this.addNotification();
                this.props.navigation.navigate('MyBarters');
              }}>
              <Text style={styles.buttonText}> Exchange </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: 'orange',
    borderBottomWidth: 5,
    borderBottomColor: 'black',
    width: '50%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  buttonText: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
});
