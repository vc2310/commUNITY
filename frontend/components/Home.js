import React from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {logout} from "../services/auth/AuthService"
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
        query: ''
    }
  }
  render () {

    return (
      <View style={{flex: 1, height: "100%", width: "100%" }}>
      <MapboxGL.MapView
        styleURL={'mapbox://styles/faisalmuh786/ck84o8v2203891irqnlxkpdi3'}
        zoomLevel={16}
        centerCoordinate={[3.3362400, 6.5790100]}
        style={{flex: 1}}>
           <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={[3.3362400, 6.5790100]}
              animationMode={'flyTo'}
              animationDuration={0}
          	>
          </MapboxGL.Camera>
      </MapboxGL.MapView>
      <View style={{position: 'absolute', justifyContent: "center", width: "75%", marginTop: "20%", marginLeft: "12.5%"}}>
        <Autocomplete
          data={['hello']}
          defaultValue={''}
          placeholder="Search for a location"
          style={styles.TextInputStyleClass}
          onChangeText={text => this.setState({ query: text })}
          renderItem={({ item, i }) => (
            <TouchableOpacity onPress={() => this.setState({ query: item })}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
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
