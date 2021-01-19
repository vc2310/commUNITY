import React from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { logout } from "../services/auth/AuthService"
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import MapboxGL from "@react-native-mapbox-gl/maps";
import Autocomplete from 'react-native-autocomplete-input';

MapboxGL.setAccessToken("pk.eyJ1IjoiZmFpc2FsbXVoNzg2IiwiYSI6ImNrODRucXg2YjBjMnAzbW1yNjZ3ZHNqd3oifQ.-BuJJq_CEkUXCMjeypdSdg");

class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#03A9F4',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },

  };
  constructor(props) {
    super(props)
    this.state = {
        query: '',
        data: [],
        center: [3.3362400, 6.5790100],
        addIssue: false,
        issue: {
          title: '',
          description: '',
          address: {
            city: '',
            province: '',
            country: ''
          },
          geometry: []
        }
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
    const centerSelected = (item)=>{
      this.setState({ center: item.center})
      this.setState({ query: item.place_name, data: []})
      console.log(this.state.center)
    }
    return (
      <View style={{flex: 1, height: "100%", width: "100%" }}>
      <MapboxGL.MapView
        styleURL={'mapbox://styles/faisalmuh786/ck84o8v2203891irqnlxkpdi3'}
        zoomLevel={1}
        style={{flex: 1}}>
           <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={this.state.center}
              animationMode={'flyTo'}
              animationDuration={2000}
          	>
          </MapboxGL.Camera>
      </MapboxGL.MapView>
      <View style={{position: 'absolute', justifyContent: "center", width: "75%", marginTop: "20%", marginLeft: "12.5%"}}>
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
            <TouchableOpacity onPress={() => centerSelected(item)}>
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "82.5%"}}>
      <Button onPress={()=> this.setState({addIssue: true})}>
        <Text>+</Text>
      </Button>
      <Overlay isVisible={this.state.addIssue} fullScreen={true} onBackdropPress={()=> this.setState({addIssue: false})}>
        <Container>
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
            <H1>Report Issue</H1>
            <TextInput stye={{width: "75%"}}
              onChangeText={(title) => this.setState({issue: {title: title}})}
              placeholder="Title" />
            <TextInput stye={{width: "75%"}}
              onChangeText={(description) => this.setState({issue: {description: description}})}
              placeholder="Description" />
            <Button>
              <Text onPress={()=> this.setState({addIssue: false})}>Back</Text>
            </Button>
          </View>
        </Container>
      </Overlay>
      </View>
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

  }
});
export default Home;
