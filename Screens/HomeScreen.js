import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config'; 

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItemsList: [],
    };
    this.requestRef = null;
  }

  getAllItemslist = () => {
    this.requestRef = db.collection('items').onSnapshot((snapshot) => {
      var allItemsList = [];
      snapshot.forEach((doc) => {
        allItemsList.push(doc.data());
      });
      this.setState({ allItemsList: allItemsList });
    });
  };

  componentDidMount() {
    this.getAllItemslist();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.item_description}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity
            style={styles.button} 
            onPress={() => {
              this.props.navigation.navigate('ReceiverDetails', {
                details: item,
              });
            }}>
            <Text style={styles.buttonText}>Exchange</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View
        style={{ backgroundColor: '#c4ffe4', width: '100%', height: '100%' }}>
        <MyHeader title="ITEM LIST" navigation={this.props.navigation} />
        <View>
          {this.state.allItemsList === 0 ? (
            <View style={styles.container}>
              <Text> List Of All Items To Exchange </Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allItemsList}
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
    width: '50%',
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
});
