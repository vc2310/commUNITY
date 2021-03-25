import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, PermissionsAndroid, TouchableOpacity, ScrollView, Image, Platform, ImageBackground } from "react-native";

import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import LocationAutocomplete from '../components/LocationAutocomplete'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getUser, logout } from "../services/auth/AuthService"
import { createIssue } from "../services/issue/IssueService"
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
        geometry: [],
        images: [],
        createdBy: '',
      },
      homeAddress: {
        city: '',
        province: '',
        country: ''
      },
      isLoading: false,
    }

  }
  componentDidMount() {
    getUser().then((res) => {
      res.user.id.then((id) => {
        this.setState({ issue: { ...this.state.issue, createdBy: id } })
      })

      res.user.address.city.then((city) => {
        res.user.address.province.then((province) => {
          res.user.address.country.then((country) => {
            this.setState({ homeAddress: { city: city, province: province, country: country } })
          })
        })
      })
    })
  }

  submit(){
    this.setState({isLoading: true})

    let formdata = new FormData();
    this.state.issue.images.map((img, index) => {
      formdata.append("multiple_images", { uri: img.uri, name: img.fileName, type: img.type })
    })
    formdata.append("issue", JSON.stringify(this.state.issue))

    createIssue(formdata).then((res)=>{
      if (res){
        this.setState({isLoading: false})
        this.props.close()
      }
    }).catch((error)=>{

      this.setState({isLoading: false})
      console.log(error)
    })
  }

  submitDisabled(){
    if (this.state.isLoading){
      return true
    }

    if (this.state.issue.address.city !== this.state.homeAddress.city ||
      this.state.issue.address.province !== this.state.homeAddress.province ||
      this.state.issue.address.country !== this.state.homeAddress.country) {
      return true
    }
    if (this.state.issue.title !== '' && this.state.issue.description !== ''
      && this.state.issue.geometry.length !== 0 && this.state.issue.images.length !== 0) {
      return false
    }
    return true
  }

  deleteImage(index) {
    this.setState({ images: this.state.issue.images.splice(index, 1) });
  }

  render() {
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

     const showImagePicker = () => {
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

    const getAndroidCameraPermissions = async () => {

      try {
        //Requesting Android location permission, if not already granted
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission granted!");
            launchCamera({
              storageOptions: {
                skipBackup: true,
                path: 'images',
                },
              }, (response) => {
              console.log('Response = ', response);

              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
              } else if (response.errorCode){
                alert("Camera Unavailable");
              } else {
                const source = { uri: response.uri };
                console.log('response', JSON.stringify(response));
                var temp = this.state.issue.images
                temp.push(response)
                this.setState({issue: {...this.state.issue, images: temp}});
              }
            })
        } else {
          console.log("Camera permission denied!");
        }
      } catch (err) {
        console.warn(err);
      }
    }

    const showCamera = () => {

      //Checking camera permissions during runtime is required for all Android versions after Marshmallow
      if (Platform.OS == 'android') {
         getAndroidCameraPermissions();
      } else {
          launchCamera({
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          }, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          }else if (response.errorCode){
            alert("Camera Unavailable");
          } else {
            const source = { uri: response.uri };
            console.log('response', JSON.stringify(response));
            var temp = this.state.issue.images
            temp.push(response)
            this.setState({issue: {...this.state.issue, images: temp}});
          }
        })
      }
    }

    return (

      <ScrollView style={{marginTop: Platform.OS === 'ios' ? 35 : 20}}>
        <View >
          <H1 style={{color: "white"}}>Report Issue</H1>
        </View>
        <View stlye={{backgroundColor: 'white'}}>
          <TextInput style={styles.textInput}
            onPress={e => console.log("Clicked")} onChangeText={(title) => this.setState({issue: {...this.state.issue, title: title}})}
            placeholder="Title" placeholderTextColor= "#bbb"
            />
          <View style={styles.textAreaContainer} >
            <TextInput style={styles.textArea}
              numberOfLines={8} multiline={true}
              onChangeText={(description) => this.setState({issue: {...this.state.issue, description: description}})}
              placeholder="Description" placeholderTextColor= "#bbb" textAlignVertical="top"/>
          </View>
        </View>
        <View style={{
          width: '100%',
        }}>
        </View>
        <View>
          <LocationAutocomplete onSelect={(selected) => {
            var city = ''
            var province = ''
            var country = ''
            selected.context.map((item, index) => {
              if (item.id.includes('place')) {
                city = item.text
              }
              else if (item.id.includes('region')) {
                province = item.text
              }
              else if (item.id.includes('country')) {
                country = item.text
              }

            })
            this.setState({
              issue: {
                ... this.state.issue,
                address: { city: city, province: province, country: country },
                geometry: selected.center
              }
            })
            this.setState({})
          }}/>
        </View>
          <ScrollView horizontal={true} style={{width:"100%", height: 110, marginTop: 20, marginBottom: 20}}>
            {this.state.issue.images.map((img, index) => {
              return (<ImageBackground
                source={{ uri: img.uri }}
                key={index}
                style={{ width: 100, height: 100 }}
              >
                <TouchableOpacity onPress={() => {
                  this.deleteImage(index);
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 1,
                    padding: 1
                  }}>
                    <FontAwesome name="times-circle" size={30} color="#0275d8" />
                  </View>
                </TouchableOpacity>
              </ImageBackground>)
            })}
          </ScrollView>
          <View style={{width: '100%', marginTop: 45}}>
          <TouchableOpacity onPress={(e)=>{ showImagePicker()}}
              style={{
                position: "absolute",
                backgroundColor: 'white',
                bottom: 10,
                left: 0,
                width: "45%",
                height: 40,
                padding: 5,
                marginRight: "5%",
                justifyContent: "center"}}
          >
              <Text style={{width: "100%", textAlign: "center"}}>Load Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={(e)=>{showCamera()}}
            style={{
              position: "absolute",
              backgroundColor: 'white',
              bottom: 10,
              right: 0,
              width: "45%",
              height: 40,
              padding: 5,
              marginLeft: "5%",
              justifyContent: "center"}}
            >
            <Text style={{width: "100%", textAlign: "center"}}>Take Photo</Text>
          </TouchableOpacity>
        </View>

          <View style={{width: "50%", marginTop: 50, marginLeft: "25%"}}>
          <Button disabled={this.submitDisabled()}  onPress={(e)=> {this.submit()}}>
              <Text style={{width: "100%", textAlign: "center"}}>Submit</Text>
            </Button>
            <Button style={{marginTop: 20}} onPress={()=> this.props.close()}>
              <Text style={{width: "100%", textAlign: "center"}}>Back</Text>
            </Button>
          </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({

  MainContainer: {

    // Setting up View inside content in Vertically center.
    justifyContent: 'center',
    flex: 1,
    margin: 10

  },
 inputContainer: {
    paddingTop: '5%',
  },
 textInput: {
   height: 40,
   padding: 0,
   fontSize: 20,
   marginTop: 30,
   marginBottom: 10,
   borderColor: 'grey',
   borderBottomWidth: 1,
   color: "#ffffff", //Expecting this to change input text color
 },

  textAreaContainer: {
    marginTop: 10,
    backgroundColor: "white",
    marginBottom: 20,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,

  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
    fontSize: 18,
    color: "black",
  },
  button: {
    height: 40,
    color: "white"
  }
});

export default CreateIssuePage
