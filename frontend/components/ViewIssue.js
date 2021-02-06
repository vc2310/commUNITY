import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import LocationAutocomplete from '../components/LocationAutocomplete'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { getUser, logout } from "../services/auth/AuthService"
import { createIssue, getIssue } from "../services/issue/IssueService"

class ViewIssue extends React.Component {
  constructor(props){
    super(props);
    id: props.id
    this.state = {
      issue: {
        title: '',
        description: '',
        address: {
          city: '',
          province: '',
          country: ''
        },
        geometry: [],
        images: [],
        createdBy: '',
      },
    }

  }
  componentDidMount() {
    console.log(this.props.id)
    getIssue(this.props.id).then((res)=> {
        this.setState({issue: res.issue});
        console.log("here"+res.issue)
    })
  }

  submit(){
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
           var temp = this.state.issue.images
           console.log(response)
           temp.push(response)
           this.setState({issue: {...this.state.issue, images: temp}});
           console.log(this.state.images)
         }
       });
    };

    return (
      <ScrollView>
        <View style={styles.inputContainer}>
        <H1 style={{paddingTop: '25%'}}>{this.state.issue.title}</H1>
        </View>
        <ScrollView horizontal={true}>
        {this.state.issue.images.map((img, index) => {
          return <Image source={{uri: 'http://localhost:3000/v1/'+img+'/image'}} key={index} style={{width: 100, height: 100}}/>;
        })}
        </ScrollView>
        <Text>{this.state.issue.description}</Text>
        <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "12.5%"}}>
          <Button>
            <Text onPress={()=> this.props.close()}>Back</Text>
          </Button>
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

export default ViewIssue
