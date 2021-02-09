import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Chip } from 'react-native-paper';
import LocationAutocomplete from '../components/LocationAutocomplete'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { getUser, logout } from "../services/auth/AuthService"
import { createIssue, getIssue, commentIssue, changeStatus } from "../services/issue/IssueService"
import DropDownPicker from 'react-native-dropdown-picker';

class ViewIssue extends React.Component {
  constructor(props){
    super(props);
    id: props.id
    this.state = {
      userID: '',
      userCity: '',
      isCM: '',
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
        comments:[],
        status: ''
      },
      comment: '',
      changedStatus: ''
    }

  }
  componentDidMount() {
    console.log(this.props.id)
    getUser().then((res)=> {
      res.user.id.then((id)=> {
        this.setState({userID: id})
      })
      res.user.address.city.then((city)=> {
        this.setState({userCity: city})
      })
      res.user.isCM.then((isCM)=> {
        this.setState({isCM: isCM})
      })
    })
    this.getIssues()
  }

  getIssues = () => {
    getIssue(this.props.id).then((res)=> {
        this.setState({issue: res.issue});
        this.setState({changedStatus: this.state.issue.status})
    })
  }

  comment(){
    commentIssue(this.state.userID, this.props.id, this.state.comment).then((res)=> {
        this.getIssues()
        this.setState({comment: ''})
    })
  }

  statusChange(){
    changeStatus(this.props.id, this.state.changedStatus).then((res)=> {
        this.getIssues()
    })
  }
  status(){
    if (this.state.issue.status === 'new'){
      return 'New'
    }
    else if (this.state.issue.status === 'inProgress'){
      return 'In Progress'
    }
    else if (this.state.issue.status === 'resolved'){
      return 'Resolved'
    }
    return ''
  }

  render () {
    return (
      <View>
        <View style={styles.inputContainer}>
        <H1 style={{paddingTop: '25%'}}>{this.state.issue.title}</H1>
        </View>
        <ScrollView horizontal={true}>
        {this.state.issue.images.map((img, index) => {
          return <Image source={{uri: 'http://localhost:3000/v1/'+img+'/image'}} key={index} style={{width: 100, height: 100}}/>;
        })}
        </ScrollView>
        <Text>{this.state.issue.description}</Text>
        <Chip icon="information">{this.status()}</Chip>
        <Text>
          Comment
        </Text>
        <ScrollView vertical={true}>
          {this.state.issue.comments.map((comment, index) => {
            return <View style={{backgroundColor: '#1c2636', borderWidth: 0.5}}><Text>{comment[0]}</Text></View>
          })}
        </ScrollView>
        {this.state.isCM === '1' &&
          <View>
            <View style={{flexDirection: 'row'}}>
              <TextInput stye={styles.textArea}
                numberOfLines={9}
                value={this.state.comment}
                onChangeText={(description) => {this.setState({comment: description})}}
                placeholder="Comment description" />
                <Button disabled={this.state.comment === ''} onPress={()=> this.comment()}>
                  <Text>Post</Text>
                </Button>
            </View>
            <View style={{flexDirection: 'row'}}>
              <DropDownPicker
                items={[
                    {label: 'New', value: 'new'},
                    {label: 'In Progress', value: 'inProgress'},
                    {label: 'Resolved', value: 'resolved'},
                ]}
                defaultValue={this.state.issue.status}
                containerStyle={{height: 40, width: 150}}
                style={{backgroundColor: '#FFFFFF'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#FFFFFF'}}
                placeholder="Status"
                onChangeItem={item => this.setState({changedStatus: item.value})}
            />
            <Button disabled={this.state.changedStatus === this.state.issue.status} onPress={()=> this.statusChange()}>
              <Text>Change Status</Text>
            </Button>
          </View>
          </View>
        }
        <View style={{position: 'absolute', width: "75%", marginTop: "180%", marginLeft: "12.5%"}}>
          <Button onPress={()=> this.props.close()}>
            <Text>Back</Text>
          </Button>
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

export default ViewIssue
