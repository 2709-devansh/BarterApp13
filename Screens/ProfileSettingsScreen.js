import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';
 
export default class ProfileSettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      emailId: '',
      docId: '',
    };
  }

  getProfileDetails() {
    var user = firebase.auth().currentUser;
    var userEmail = user.email;
    db.collection('users')
      .where('email_id', '==', userEmail)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            contact: data.contact,
            emailId: data.email_id,
            docId: doc.id,
          });
        });
      });
  }

  componentDidMount() {
    this.getProfileDetails();
  }

  updateProifleDetails() {
    db.collection('users').doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
    });
    Alert.alert('Profile Details Updated Successfully!');
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="MY PROFILE" navigation={this.props.navigation} />
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder={'First Name'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />

          <TextInput
            style={styles.textInput}
            placeholder={'Last Name'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />

          <TextInput
            style={styles.textInput}
            placeholder={'Address'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />

          <TextInput
            style={styles.textInput}
            placeholder={'Contact'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({
                contact: text,
              });
            }}
            value={this.state.contact}
          />

          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => {
              this.updateProifleDetails();
            }}>
            <Text> UPDATE </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: '#ff8a65',
    fontSize: 20,
    margin: 10,
    marginTop: 50,
    paddingLeft: 10,
    alignSelf: 'center',
  },

  updateButton: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#ff9800',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32, 
    elevation: 16,
    padding: 10,
    alignSelf: 'center',
    marginTop: 100,
  },

  container: {
    flex: 1,
    backgroundColor: '#c4ffe4',
  },
});
