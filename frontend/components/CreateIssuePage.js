import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import LocationAutocomplete from '../components/LocationAutocomplete'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

class CreateIssuePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      issue: {
        title: '',
        description: '',
        address: {
          city: '',
          province: '',
          country: ''
        },
        geometry: []
      },
      images: []
    }

  }


  render () {
    const options = {
   title: 'Load Photo',
   customButtons: [
     { name: 'button_id_1', title: 'CustomButton 1' },
     { name: 'button_id_2', title: 'CustomButton 2' }
   ],
   storageOptions: {
     skipBackup: true,
     path: 'images',
   },
   multiple: true,
 };

 const showImagePicker = (): void => {

   console.log('pressed')
   launchImageLibrary(options, (response) => {
     console.log('Response = ', response);

     if (response.didCancel) {
       console.log('User cancelled image picker');
     } else if (response.error) {
       console.log('ImagePicker Error: ', response.error);
     } else if (response.customButton) {
       console.log('User tapped custom button: ', response.customButton);
       Alert.alert(response.customButton);
     } else {
       // You can also display the image using data:
       // const source = { uri: 'data:image/jpeg;base64,' + response.data };
       var temp = this.state.images
       console.log(response)
       temp.push(response.uri)
       this.setState({images: temp});
       console.log(this.state.images)
     }
   });
 };
    return (
      <ScrollView>
        <View style={styles.inputContainer}>
        <View >
          <H1>Report Issue</H1>
        </View>
        <View stye={{backgroundColor: 'black'}}>
          <TextInput stye={styles.textInput}
            onChangeText={(title) => this.setState({issue: {title: title}})}
            placeholder="Title" />
          <TextInput stye={styles.textInput}
            onChangeText={(description) => this.setState({issue: {description: description}})}
            placeholder="Description" />
        </View>
        <View style={{
          width: '100%',
        }}>
          <ScrollView
          horizontal={true}
          >
          {this.state.images.map((img, index) => {
            return <Image source={{uri: img }} key={index} style={{width: 100, height: 100}}/>;
          })}
          </ScrollView>
          <Button onPress={(e)=>{
            showImagePicker()
          }}>
            <Text>Load Photo</Text>
          </Button>
          </View>
          <View>
            <LocationAutocomplete onSelect={(item) => {}}/>
            </View>
          <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "12.5%"}}>
            <Button>
              <Text onPress={()=> this.setState({addIssue: false})}>Back</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
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
 inputContainer: {
    paddingTop: '25%'
  },
 textInput: {
   backgroundColor: "#3f51b5",
   color: "#ffffff", //Expecting this to change input text color
  }
});

export default CreateIssuePage
