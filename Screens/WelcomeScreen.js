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
} from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();  
    this.state = {
      emailId: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      contactNumber: '',
      confirmPassword: '',
      isModalVisible: 'false',
      currencyCode:''
    };
    console.log(this.state.address);
  }

  userSignUp = (emailId, password, confirmPassword) => {
    if (confirmPassword !== password) {
      var passIncorrectMessage = "Passwords Don't Match";
      return Alert.alert(passIncorrectMessage);
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection('users').add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contactNumber,
            address: this.state.address,
            email_id: this.state.emailId,
            currency_code: this.state.currencyCode
          });
          return Alert.alert('User Added Successfully')[
            {
              text: 'OK',
              onPress: () => this.setState({ isModalVisible: false }),
            }
          ];
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('HomeScreen');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
              <Text style={styles.modalTitle}> DETAILS FORM </Text>

              <TextInput
                style={styles.modalTextInput}
                placeholder={'First Name'}
                maxLength={15}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Last Name'}
                maxLength={15}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Contact Number'}
                maxLength={10}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  this.setState({
                    contactNumber: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Address'}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Email ID'}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Confirm Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder={'Country Currency Code'}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    currencyCode: text,
                  });
                }}
              />

              <View>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() =>
                    this.userSignUp(
                      this.state.emailId,
                      this.state.password,
                      this.state.confirmPassword
                    )
                  }>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isModalVisible: false })}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <SafeAreaProvider>
        <View>
          <Header
            backgroundColor={'#00bdf2'}
            centerComponent={{
              text: 'BARTER APP',
              style: { color: '#fcff4f', fontSize: 20 },
            }}
          />
        </View>

        {this.showModal()}

        <View style={styles.container}>
          <TextInput
            style={styles.loginBox}
            placeholder="abc@barterapp.com"
            keyboardType={'email-address'}
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
          />
          <TextInput
            style={styles.loginBox}
            secureTextEntry={true}
            placeholder="Enter Your Password"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
            onPress={() => {
              this.userLogin(this.state.emailId, this.state.password);
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ isModalVisible: true })}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8BE85',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: '#ff8a65',
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },

  button: {
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
  },

  buttonText: {
    color: '#ffff',
    fontWeight: '200',
    fontSize: 20,
  },

  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTextInput: {
    width: '85%',
    height: 40,
    alignSelf: 'center',
    borderColor: '#ff8c8c',
    borderRadius: 10,
    borderBottomWidth: 1,
    marginTop: 10,
    padding: 10,
  },

  modalTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    color: '#ff5722',
    margin: 30,
    marginBottom: 7,
  },

  registerButton: {
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  registerButtonText: {
    color: '#00c1f7',
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
  },

  cancelButtonText: {
    color: '#00c1f7',
    fontStyle: 'italic',
    fontWeight: 'bold', 
  },

  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 70,
    marginBottom: 20,
    backgroundColor: '#c4ffdf',
  },
});
