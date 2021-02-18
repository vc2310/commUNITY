import React from "react";
import { View, TextInput, Alert, StyleSheet, Platform, PermissionsAndroid, TouchableOpacity, ScrollView } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { IconButton, Colors, Chip } from 'react-native-paper';
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MapboxGL, { Logger } from "@react-native-mapbox-gl/maps";
import LocationAutocomplete from '../components/LocationAutocomplete'
import CreateIssuePage from '../components/CreateIssuePage'
import ViewIssue from '../components/ViewIssue'
import { getIssues } from "../services/issue/IssueService"

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
        center: [-79.6665, 43.4474],
        addIssue: false,
        issues: [],
        details: false,
        detailsID: '',
        currentCoor: [],
        zoomLevel: 12,
        androidLocationPermission: false,
    }
  }

  centerChanged(event){
    var query = {"near": {"center": event.geometry.coordinates, "radius": 8}}
    // this.setState({zoomLevel: event.properties.zoomLevel})
    // this.setState({center: event.geometry.coordinates})
    console.log(event, event.properties.zoomLevel, this.state.zoomLevel, this.state.center)
    getIssues(query).then((response)=>{
      this.setState({issues: response.issues})
    }).catch((err)=>{
      console.log(err)
    })
  }
  renderAnnotations() {
   const items = [];

   for (let i = 0; i < this.state.issues.length; i++) {
     const coordinate = this.state.issues[i].geometry.coordinates;
     const title = `Longitude: ${this.state.issues[i].geometry.coordinates[0]} Latitude: ${
       this.state.issues[i].geometry.coordinates[1]
     }`;
     const id = `pointAnnotation${i}`;

     items.push(
       <MapboxGL.PointAnnotation
         key={this.state.issues[i].id}
         id={this.state.issues[i].id}
         title={this.state.issues[i].title}
         onSelected={()=>{
           this.setState({details: true})
           this.setState({detailsID: this.state.issues[i].id})
         }}
         onDeselected={()=>{
           this.setState({details: false})
           this.setState({detailsID: ''})}}
         coordinate={coordinate}
       >
       </MapboxGL.PointAnnotation>,
     );
   }
   return items;
 }

 userLocation(location){
  this.getAndroidLocationPermission();
   if (location){
     this.setState({currentCoor: [location.coords.longitude, location.coords.latitude]})
   }
 }


 focusUser = async () => {
   console.log(this.state.androidLocationPermission);
   if (Platform.OS == "android" && !this.state.androidLocationPermission) {
     await this.getAndroidLocationPermission();
     setTimeout(() => {
      if (this.state.androidLocationPermission) {
        this.focusUser();
      }
    }, 1500);
   } else {
    this.setState({center: this.state.currentCoor});
   }
 }

 //Requesting Android locations permission, if not already granted
 getAndroidLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if ( granted === PermissionsAndroid.RESULTS.GRANTED ) {
          this.setState({androidLocationPermission: true});
        }
        if(focus) {
          console.log("Focus Value: " + focus);
        }
        console.log("Android location permission");
        console.log(this.state.androidLocationPermission);
    } catch ( err ) {
      return err;
    }
  }


  render () {

    // edit logging messages
    Logger.setLogCallback(log => {
    const { message } = log;

    // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
    if (
      message.match('Request failed due to a permanent error: Canceled') ||
      message.match('Request failed due to a permanent error: Socket Closed')
    ) {
      return true;
    }
    return false;
    });
    
    return (
      <View style={{flex: 1, height: "100%", width: "100%" }}>
      <MapboxGL.MapView
        styleURL={'mapbox://styles/faisalmuh786/ck84o8v2203891irqnlxkpdi3'}
        zoomLevel={this.state.zoomLevel}
        style={{flex: 1}}
        onLongPress={(event)=>{console.log('Coords:', event)}}
        onRegionDidChange={(event)=>{this.centerChanged(event)}}>
           <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={this.state.center}
              animationMode={'flyTo'}
              animationDuration={2000}
          	>
          </MapboxGL.Camera>
          {this.renderAnnotations()}
          <MapboxGL.UserLocation onUpdate={(location) => {this.userLocation(location);}} />
      </MapboxGL.MapView>
      <View style={{position: 'absolute', justifyContent: "center", width: "75%", marginTop: "10%", marginLeft: "12.5%"}}>
        <LocationAutocomplete onSelect={(item) => {this.setState({ center: item.center})}}/>
      </View>
      <View style={{position: 'absolute', bottom: 90, right: 20}}>
        <Button style={{width: 50, height: 50, borderRadius: 25, backgroundColor: "white"}}>
          <IconButton
            icon="crosshairs-gps"
            color={Colors.blue500}
            size={25}
            onPress={(e) => { this.focusUser() }}
          />
        </Button>
      </View>
      <View style={{position: 'absolute', bottom: 25, right: 20}}>
      <Button style={{width: 50, height: 50, borderRadius: 25}}onPress={()=> this.setState({addIssue: true})}>
        <Text style={{width: "100%", textAlign: "center", fontSize: 16}}>+</Text>
      </Button>
      </View>
      <Overlay overlayStyle={{backgroundColor: "#1c2636"}} isVisible={this.state.addIssue} fullScreen={true} onBackdropPress={()=> this.setState({addIssue: false})}>
        <CreateIssuePage close={()=> this.setState({addIssue: false})}/>
      </Overlay>
      <Overlay overlayStyle={{backgroundColor: "#1c2636"}} isVisible={this.state.details} fullScreen={true} onBackdropPress={()=> this.setState({details: false, detailsID: ''})}>
        <ViewIssue close={()=> this.setState({details: false})} id={this.state.detailsID}></ViewIssue>
      </Overlay>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  annotationContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 45 / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: 45,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 45,
  },
  annotationFill: {
      width: 45 - 3,
      height: 45 - 3,
      borderRadius: (45 - 3) / 2,
      backgroundColor: 'orange',
      transform: [{scale: 0.6}],
    },
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
