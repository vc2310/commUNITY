import React from "react";
import Autocomplete from 'react-native-autocomplete-input';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";

class LocationAutocomplete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: '',
      data: []
    }
  }


  render () {
    const autocompleteChanged = (text)=>{
      this.setState({ query: text })
      searchLocationAutoComplete(text).then((data)=>{
        console.log(data)
        this.setState({ data: data })
      })
    }
    const handlePress = (item) => {
        // Need to check to prevent null exception.
        this.props.onSelect(item);
        this.setState({ query: item.place_name, data: [] })
      }
    return (
      <View>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          data={this.state.data}
          defaultValue={''}
          value={this.state.query}
          placeholder="Search for a location"
          style={styles.TextInputStyleClass}
          onChangeText={(text) => autocompleteChanged(text)}
          renderItem={({ item, i }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  MainContainer :{

  // Setting up View inside content in Vertically center.
  justifyContent: 'center',
  flex:1,
  margin: 10

  },

  TextInputStyleClass:{

  // Setting up Hint Align center.
  textAlign: 'center',

  // Setting up TextInput height as 50 pixel.
  height: 50,

  // Set border width.
   borderWidth: 0,

  // Set border Radius.
   borderRadius: 10 ,

  //Set background color of Text Input.
   backgroundColor : "#FFFFFF",

 },
 inputContainer: {
    paddingTop: '25%'
  },
 textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20
  }
});
export default LocationAutocomplete
