import React from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { logout } from "../services/auth/AuthService"
import MapboxGL from "@react-native-mapbox-gl/maps";
import LocationAutocomplete from '../components/LocationAutocomplete'
import CreateIssuePage from '../components/CreateIssuePage'

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
        <LocationAutocomplete onSelect={(item) => {this.setState({ center: item.center})}}/>
      </View>
      <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "82.5%"}}>
      <Button onPress={()=> this.setState({addIssue: true})}>
        <Text>+</Text>
      </Button>
      <Overlay isVisible={this.state.addIssue} fullScreen={true} onBackdropPress={()=> this.setState({addIssue: false})}>
        <CreateIssuePage/>
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
 inputContainer: {
    paddingTop: '25%'
  },
 textInput: {
   backgroundColor: "#3f51b5",
   color: "#ffffff", //Expecting this to change input text color
  }
});
export default Home;
