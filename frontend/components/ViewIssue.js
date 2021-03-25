import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, ScrollView, Platform } from "react-native";
import { searchLocationAutoComplete } from "../services/mapbox/MapboxService"
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { Chip, Colors, IconButton } from 'react-native-paper';
import { SliderBox } from "react-native-image-slider-box";
import LocationAutocomplete from '../components/LocationAutocomplete'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { getUser, logout } from "../services/auth/AuthService"
import { createIssue, getIssue, commentIssue, changeStatus } from "../services/issue/IssueService"
import DropDownPicker from 'react-native-dropdown-picker';
import { constants } from '../services/constants/constants'

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
      <ScrollView style={{marginTop: Platform.OS === 'ios' ? 50 : 10}}>
        <SliderBox dotColor="#90A4AE" images={this.state.issue.images.map((img, index) => {
            return constants.commUNITY_URI+'/v1/' + img + '/image'
        })}
        />
        <Chip style={{marginTop: 10}} icon="information">{this.status()}</Chip>
        <View style={styles.inputContainer}>
        <H1 style={{color: "white"}}>{this.state.issue.title}</H1>
        </View>
        <Text style={{paddingTop: 10, marginBottom: 15, color: "white"}}>{this.state.issue.description}</Text>
        {this.state.isCM === '1' && this.state.userCity === this.state.issue.address.city &&
          <View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <DropDownPicker
                items={[
                    {label: 'New', value: 'new'},
                    {label: 'In Progress', value: 'inProgress'},
                    {label: 'Resolved', value: 'resolved'},
                ]}
                defaultValue={this.state.issue.status}
                containerStyle={{height: 40, width: "70%", marginRight: 10}}
                style={{backgroundColor: '#FFFFFF'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#FFFFFF'}}
                placeholder="Status"
                onChangeItem={item => this.setState({changedStatus: item.value})}
            />
            <Button style={{marginTop: 0, height: 38}} disabled={this.state.changedStatus === this.state.issue.status} onPress={()=> this.statusChange()}>
              <Text>Update</Text>
            </Button>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
              <TextInput style={styles.textArea}
                numberOfLines={5}
                multiline={true}
                value={this.state.comment}
                onChangeText={(description) => {this.setState({comment: description})}}
                placeholder="Comment description"
                textAlignVertical="top"
                />
                <Button style={{marginTop: 0, height: 38, paddingLeft: 9, paddingRight: 9}} disabled={this.state.comment === ''} onPress={()=> this.comment()}>
                  <Text>Post</Text>
                </Button>
            </View>
          </View>
        }
        { this.state.issue.comments.length > 0 &&
        <Text style={{color: "white", marginTop: 20, marginBottom: 10}}>
          Comments
        </Text>
        }
        <View>
          {this.state.issue.comments.map((comment, index) => {
            return (<View style={{backgroundColor: '#ececec', borderWidth: 1, borderRadius: 5}}>
                      <View style={{flexDirection: 'row',alignItems: "center", paddingLeft: 10, paddingRight: 10}}>
                        <Text style={{fontWeight: "bold",}}>{comment[1]}</Text>
                        <IconButton
                          icon={{ uri: 'http://simpleicon.com/wp-content/uploads/ok_1.png' }}
                          color={Colors.blue500}
                          size={20}
                          onPress={(e) => {}}
                        />
                      </View>
                      <Text style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>{comment[0]}</Text>
                    </View>)
          })}
        </View>
        <View style={{position: 'absolute', top: 0, right: 0, padding: 0}}>
          <IconButton
            icon="undo-variant"
            color="white"
            size={40}
            style={{margin: 0, padding: 0}}
            onPress={(e) => { this.props.close() }}
          />
        </View>
      </ScrollView>
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
    marginTop: 10,
  },
 textInput: {
   backgroundColor: "#3f51b5",
   color: "#ffffff", //Expecting this to change input text color
  },
  textArea: {
    backgroundColor: "white",
    borderColor: "grey",
    justifyContent: "flex-start",
    marginRight: 10,
    borderRadius: 5,
    width: "70%"
  }
});

export default ViewIssue
