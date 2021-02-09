import React from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MapboxGL from "@react-native-mapbox-gl/maps";
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
        detailsID: ''
    }
  }

  centerChanged(event){
    console.log('getting issues', event)
    getIssues().then((response)=>{
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

  render () {
    return (
      <View style={{flex: 1, height: "100%", width: "100%" }}>
      <MapboxGL.MapView
        styleURL={'mapbox://styles/faisalmuh786/ck84o8v2203891irqnlxkpdi3'}
        zoomLevel={1}
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
      </MapboxGL.MapView>
      <View style={{position: 'absolute', justifyContent: "center", width: "75%", marginTop: "20%", marginLeft: "12.5%"}}>
        <LocationAutocomplete onSelect={(item) => {this.setState({ center: item.center})}}/>
      </View>
      <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "82.5%"}}>
      <Button onPress={()=> this.setState({addIssue: true})}>
        <Text>+</Text>
      </Button>
      <Overlay isVisible={this.state.addIssue} fullScreen={true} onBackdropPress={()=> this.setState({addIssue: false})}>
        <CreateIssuePage close={()=> this.setState({addIssue: false})}/>
      </Overlay>
      <Overlay isVisible={this.state.details} fullScreen={true} onBackdropPress={()=> this.setState({details: false, detailsID: ''})}>
        <ViewIssue close={()=> this.setState({details: false})} id={this.state.detailsID}></ViewIssue>
      </Overlay>
      </View>
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
