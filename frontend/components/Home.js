import React from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Overlay } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MapboxGL from "@react-native-mapbox-gl/maps";
import LocationAutocomplete from '../components/LocationAutocomplete'
import CreateIssuePage from '../components/CreateIssuePage'
import { getIssues } from "../services/issue/IssueService"

MapboxGL.setAccessToken("pk.eyJ1IjoiZmFpc2FsbXVoNzg2IiwiYSI6ImNrODRucXg2YjBjMnAzbW1yNjZ3ZHNqd3oifQ.-BuJJq_CEkUXCMjeypdSdg");
const featureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'example',
      },
      geometry: {
        type: 'Point',
        coordinates: [-117.20611157485, 52.180961084261],
      },
    },
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'airport-15',
      },
      geometry: {
        type: 'Point',
        coordinates: [-117.205908, 52.180843],
      },
    },
    {
      type: 'Feature',
      id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
      properties: {
        icon: 'pin',
      },
      geometry: {
        type: 'Point',
        coordinates: [-117.206562, 52.180797],
      },
    },
  ],
};
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
        issues: []
    }
  }

  centerChanged(){
    console.log(this.state.center)
    getIssues().then((response)=>{
      console.log(response)
      var featuresObject = []
      response.map((item, index)=>{
        featuresObject.push({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: item.geometry.coordinates
                }
            })
      })
      this.setState({issues: featuresObject})
    }).catch((err)=>{
      console.log(err)
    })
  }
   renderAnnotations() {
     const items = [];
     for (let i = 0; i < this.state.issues.length; i++) {
       const id = `pointAnnotation${i}`;
       items.push(
          // <MapboxGL.PointAnnotation
          //   key={id}
          //   id={id}
          //   coordinate={this.state.issues[i].geometry.coordinates}
          //   title={this.state.issues[i].title}>
          //   <View style={styles.annotationContainer} />
          //   <MapboxGL.Callout title="This is a sample with image" />
          // </MapboxGL.PointAnnotation>,

          <MapboxGL.PointAnnotation
             key="key1"
             id="id1"
             title="Test"
             coordinate={this.state.center}>
          </MapboxGL.PointAnnotation>,
        );
     }
     return items
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
              onRegionDidChange={this.centerChanged()}
          	>
          </MapboxGL.Camera>
          <MapboxGL.ShapeSource
            id="exampleShapeSource"
            shape={featureCollection}
          >
            <MapboxGL.SymbolLayer id="icon" style={styles.icon} />
          </MapboxGL.ShapeSource>
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
