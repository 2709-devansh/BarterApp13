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

export default class ExchangeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      itemName: '',
      itemDescription: '',
      userID: firebase.auth().currentUser.email,
      requestedItemName: '',
      exchangeId: '',
      itemStatus: '',
      docId: '',
      isExchangeRequestActive: false,
      userDocId: '',
      currencyCode: '',
      itemValue:''
    };
  }

  createUniqueId() {
    return Math.random().toString(30).substring(8);
  }

  addItem = async (itemName, itemDescription) => {
    var randomRequestId = this.createUniqueId();
    db.collection('items').add({
      item_name: itemName,
      item_description: itemDescription,
      user_id: this.state.userID,
      exchange_id: randomRequestId,
      item_status: 'requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
      item_value:this.state.itemValue
    });

    await this.getExchangeRequest();
    db.collection('users')
      .where('email_id', '==', this.state.userID)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isExchangeRequestActive: true,
          });
        });
      });

    this.setState({
      itemName: '',
      itemDescription: '',
      itemValue:''
    });

    return Alert.alert('Item Added Successfully!');
  };

  getIsExchangeRequestActive() {
    db.collection('users')
      .where('email_id', '==', this.state.userID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            isExchangeRequestActive: data.isExchangeRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getExchangeRequest = () => {
    var exchangeRequest = db
      .collection('items')
      .where('user_id', '==', this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().item_status !== 'received') {
            this.setState({
              exchangeId: doc.data().exchangeId,
              requestedItemName: doc.data().item_name,
              itemStatus: doc.data().item_status,
              docId: doc.id,
              itemValue:doc.data().item_value
            });
          }
        });
      });
  };

  getData() {
    fetch(
      'http://data.fixer.io/api/latest?access_key=4dca8512533fa850d051e31e95170eeb'
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currencyCode;
        var currency = responseData.rates.INR;
        var value = 69 / currency;
        console.log(value);
      });
  }

  componentDidMount() {
    this.getExchangeRequest();
    this.getIsExchangeRequestActive();
    this.getData();
  }

  receivedItem = (itemName) => {
    var userId = this.state.userID;
    var exchangeId = this.state.exchangeId;
    db.collection('received_items').add({
      user_id: userId,
      item_name: itemName,
      exchange_id: exchangeId,
      item_status: 'received',
    });
  };

  updateExchangeRequestStatus = () => {
    db.collection('items').doc(this.state.docId).update({
      item_status: 'received',
    });

    db.collection('users')
      .where('email_id', '==', this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isExchangeRequestActive: false,
          });
        });
      });
  };

  sendNotification = () => {
    db.collection('users')
      .where('user_id', '==', this.state.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          db.collection('all_notifications')
            .where('exchange_id', '==', this.state.exchangeId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var data = doc.data();

                db.collection('all_notifications').add({
                  targeted_user_id: this.state.userID,
                  message:
                    data.first_name +
                    ' ' +
                    data.last_name +
                    ' Received the Item ' +
                    this.state.itemName,
                  notification_status: 'unread',
                  item_name: this.state.itemName,
                });
              }); 
            });
        });
      });
  };

  render() {
    if (this.state.isExchangeRequestActive === true) {
      return (
        <View style={{justifyContent:'center', flex:1}}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
              
            }}>
            <Text>Item Name</Text>
            <Text>{this.state.itemName}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Value</Text>
            <Text>{this.state.itemValue}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text> Item Status </Text>
            <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateExchangeRequestStatus();
              this.receivedItem(this.state.requestedItemName);
            }}>
            <Text>Recieved The Item </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: '#c4ffe4',
            width: '100%',
            height: '100%',
          }}>
          <MyHeader title="ADD ITEM" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.container}>
            <TextInput
              style={styles.addtextInput}
              placeholder={'Item Name'}
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
              value={this.state.itemName}
            />

            <TextInput
              style={styles.reasontextInput}
              placeholder={'Item Description'}
              multiline={true}
              onChangeText={(text) => {
                this.setState({
                  itemDescription: text,
                });
              }}
              value={this.state.itemDescription}
            /> 

             <TextInput
              style={styles.valuetextInput}
              maxLength={8}  
              placeholder={'Item Value'}
              onChangeText={(text) => {
                this.setState({
                  itemValue: text,
                });
              }}
              value={this.state.itemValue}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                this.addItem(this.state.itemName, this.state.itemDescription);
              }}>
              <Text style={styles.addButtonText}> ADD ITEM </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4ffe4',
    width: '100%',
    height: '100%',
  },

  addtextInput: {
    width: '80%',
    height: 40,
    alignSelf: 'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },

  valuetextInput: {
    width: '80%',
    height: 40,
    alignSelf: 'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1, 
    padding: 10,
    marginTop:20
  },

  reasontextInput: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },

  addButton: {
    borderRadius: 10,
    backgroundColor: 'red',
    borderBottomWidth: 5,
    borderBottomColor: 'yellow',
    marginTop: 30,
    width: '50%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
});
