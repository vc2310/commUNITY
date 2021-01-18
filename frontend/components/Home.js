import React from "react";
import { View, TextInput, Alert } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {logout} from "../services/auth/AuthService"
import MapboxGL from "@react-native-mapbox-gl/maps";

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
  }
  render () {
    return (
      // <Container>
      //   <View style={{
      //     flex: 1,
      //     justifyContent: "center",
      //     alignItems: "center",
      //   }}>
      //     <Button danger onPress={()=> {logout().then(this.props.navigation.navigate("Login")).catch((error)=>{console.log(error)})}}>
      //       <Text>LogOut</Text>
      //     </Button>
      //   </View>
      // </Container>
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
    </View>
    );
  }
}

export default Home;
