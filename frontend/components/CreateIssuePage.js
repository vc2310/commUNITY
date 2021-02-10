import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from "react-native";
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import LocationAutocomplete from '../components/LocationAutocomplete'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getUser, logout } from "../services/auth/AuthService"
import { createIssue } from "../services/issue/IssueService"
import FontAwesome from "react-native-vector-icons/FontAwesome";

class CreateIssuePage extends React.Component {
  constructor(props) {
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

  submit() {
    let formdata = new FormData();
    this.state.issue.images.map((img, index) => {
      formdata.append("multiple_images", { uri: img.uri, name: img.fileName, type: img.type })
    })
    formdata.append("issue", JSON.stringify(this.state.issue))
    createIssue(formdata).then((res) => {
      if (res) {
        this.props.close()
      }
    }).catch((error) => { console.log(error) })
  }

  submitDisabled() {
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
          this.setState({ issue: { ...this.state.issue, images: temp } });
          console.log(this.state.images)
        }
      });
    };

    const showCamera = (): void => {
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
        } else {
          const source = { uri: response.uri };
          console.log('response', JSON.stringify(response));
          var temp = this.state.issue.images
          temp.push(response)
          this.setState({ issue: { ...this.state.issue, images: temp } });
        }
      })
    }

    return (
      <ScrollView>
        <View style={styles.inputContainer}>
          <View >
            <H1>Report Issue</H1>
          </View>
          <View stye={{ backgroundColor: 'black' }}>
            <TextInput stye={styles.textInput}
              onChangeText={(title) => this.setState({ issue: { ...this.state.issue, title: title } })}
              placeholder="Title" />
            <View style={styles.textAreaContainer} >
              <TextInput stye={styles.textArea}
                numberOfLines={9}
                onChangeText={(description) => this.setState({ issue: { ...this.state.issue, description: description } })}
                placeholder="Description" />
            </View>
          </View>
          <View style={{
            width: '100%',
          }}>
            <ScrollView
              horizontal={true}
            >
              <TouchableOpacity onPress={(e) => {
                showImagePicker()
              }} style={{ backgroundColor: 'grey', width: 100, height: 100, justifyContent: "center" }}>
                <Text>Load Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={(e) => {
                showCamera()
              }} style={{ backgroundColor: 'grey', width: 100, height: 100, justifyContent: "center" }}>
                <Text>Take Photo</Text>
              </TouchableOpacity>
              {this.state.issue.images.map((img, index) => (
                <ImageBackground
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
                </ImageBackground>
                // <View>
                //   <Image source={{ uri: img.uri }} key={index} style={{ width: 100, height: 100 }} />
                //   <Button
                //     onPress={() => {
                //       this.deleteImage(index);
                //     }}
                //     title="Press Me"
                //   >
                //     <Text>Delete</Text>
                //   </Button>
                // </View>
              ))}
            </ScrollView>
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
            }} />
          </View>
          <View style={{ position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "12.5%" }}>
            <Button onPress={() => this.props.close()}>
              <Text>Back</Text>
            </Button>
            <Button disabled={this.submitDisabled()} onPress={(e) => { this.submit() }}>
              <Text>Submit</Text>
            </Button>
          </View>
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
    paddingTop: '25%'
  },
  textInput: {
    height: '40%',
    backgroundColor: "#3f51b5",
    color: "#ffffff", //Expecting this to change input text color
  },
  textAreaContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  }
});

export default CreateIssuePage
