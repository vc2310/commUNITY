import React from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { logout } from "../services/auth/AuthService"
import MapboxGL from "@react-native-mapbox-gl/maps";
import LocationAutocomplete from '../components/LocationAutocomplete'
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
        <ScrollView>
          <View style={styles.inputContainer}>
          <View >
            <H1>Report Issue</H1>
          </View>
          <View style={{
            flex: 1,
          }}>
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
            <LocationAutocomplete onSelect={(item) => {}}/>
            </View>
            <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "12.5%"}}>
              <Button>
                <Text onPress={()=> this.setState({addIssue: false})}>Back</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
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
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20
  }
});
export default Home;
