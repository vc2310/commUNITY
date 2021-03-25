import React from "react";
import { View, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { IconButton, Colors, Chip } from 'react-native-paper';
import { Overlay } from 'react-native-elements';
import LocationAutocomplete from '../components/LocationAutocomplete'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { getUser, logout } from "../services/auth/AuthService";
import { getIssues, upVoteIssue, downVoteIssue } from "../services/issue/IssueService";
import ViewIssue from '../components/ViewIssue';

class Search extends React.Component {
  static navigationOptions = {
    title: 'Search',
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
      issues: [],
      center: [],
      userID: '',
      details: false,
      detailsID: '',
      address:{
        city: '',
        province: '',
        country: ''
      },
      homeAddress:{
        city: '',
        province: '',
        country: ''
      },
    }
  }
  componentDidMount() {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }
  load = () => {

    getUser().then((res) => {
      res.user.id.then((id) => {
        this.setState({ userID: id })
      })
      res.user.address.city.then((city)=> {
        res.user.address.province.then((province)=> {
          res.user.address.country.then((country)=> {
              this.setState({homeAddress: {city: city, province: province, country: country}}, ()=>{
                this.getIssues();
              })
            })
          })
        })
    })
  }
  getIssues(){
    var query = {}
    if (this.state.address.city !== '' && this.state.address.province !== '' && this.state.address.country !== ''){
      query.address = this.state.address
    }else{
      query.address = this.state.homeAddress
    }
    console.log(query, this.state.address)
    getIssues(query).then((response) => {
      var tempIssues = response.issues
      tempIssues.sort((a, b) => (a.upVotes.length > b.upVotes.length) ? -1 : (a.upVotes.length < b.upVotes.length) ? 1 : 0)
      this.setState({ issues: tempIssues })
    }).catch((err) => {
      console.log(err)
    })
  }

  upvote(issueID) {
    upVoteIssue(this.state.userID, issueID).then((response) => {
      var issues = this.state.issues
      objIndex = this.state.issues.findIndex((obj => obj.id == issueID));
      issues[objIndex].upVotes = response.issue.upVotes
      issues[objIndex].downVotes = response.issue.downVotes
      this.setState({ issues: issues })
    }).catch((err) => {
      console.log(err)
    })
  }

  status(status) {
    if (status === 'new') {
      return 'New'
    }
    else if (status === 'inProgress') {
      return 'In Progress'
    }
    else if (status === 'resolved') {
      return 'Resolved'
    }
    return ''
  }

  downvote(issueID) {
    downVoteIssue(this.state.userID, issueID).then((response) => {
      var issues = this.state.issues
      objIndex = this.state.issues.findIndex((obj => obj.id == issueID));
      issues[objIndex].upVotes = response.issue.upVotes
      issues[objIndex].downVotes = response.issue.downVotes
      this.setState({ issues: issues })
    }).catch((err) => {
      console.log(err)
    })
  }
  iconColor(item, like) {
    if (like === 1) {
      if (item.upVotes.includes(this.state.userID)) {
        return Colors.green500
      }
    } else {
      if (item.downVotes.includes(this.state.userID)) {
        return Colors.red500
      }
    }
    return Colors.grey500
  }
  render() {
    return (
      <View style={{ backgroundColor: '#1c2636' }}>
        {this.state.issues.length === 0 && <View style={{ backgroundColor: '#FFFFFF', marginTop: '25%'  }}><H1>No Issues Found.</H1></View>}
        {this.state.issues.length !== 0 && <ScrollView style={{ marginTop: '25%' }}>
          {
            this.state.issues.map((item, index) => (
              <View key={item.id} style={styles.item}>
                <TouchableOpacity 
                onPress = {() => {
                  this.setState({details: true})
                  this.setState({detailsID: item.id})
                }}>
                <View style={{ width: '75%', padding: 30 }}>
                  <View>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>{item.title}</Text>
                    <Text style={{ color: 'white' }}>{item.description}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', paddingTop: 10}}>
                    <Chip icon="information">{this.status(item.status)}</Chip>
                  </View>
                </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute', right: 0, top: '20%', width: '25%', paddingLeft: '25%'}}>
                  <View style={{ flexDirection: 'column'}}>
                    {item.address.city === this.state.homeAddress.city
                      &&
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <IconButton
                            icon="thumb-up"
                            color={this.iconColor(item, 1)}
                            size={20}
                            onPress={(e) => { this.upvote(item.id) }}
                          />
                          <Text style={{color: Colors.grey500}}>
                            {item.upVotes.length}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                          <IconButton
                            icon="thumb-down"
                            color={this.iconColor(item, 0)}
                            size={20}
                            onPress={(e) => { this.downvote(item.id) }}
                          />
                          <Text style={{color: Colors.grey500}}>
                            {item.downVotes.length}
                          </Text>
                        </View>
                      </View>}
                  </View>
                </View>
              </View>
            ))
          }
        </ScrollView>}
        <View style={{ position: 'absolute', justifyContent: "center", width: "75%", marginTop: "8%", marginLeft: "12.5%" }}>
          <LocationAutocomplete text={this.state.address.city} onSelect={(selected) => {
            var city = ''
            var province = ''
            var country = ''
            selected.context.map((item, index)=>{
              if (item.id.includes('place')){
                city = item.text
              }
              else if (item.id.includes('region')){
                province = item.text
              }
              else if (item.id.includes('country')){
                country = item.text
              }

            })
            this.setState({address: {city: city, province: province, country: country}}, ()=>{
              this.getIssues()
            })
          }} />
        </View>
        <Overlay overlayStyle={{backgroundColor: "#1c2636"}} isVisible={this.state.details} fullScreen={true} onBackdropPress={()=> this.setState({details: false, detailsID: ''})}>
        <ViewIssue close={()=> this.setState({details: false})} id={this.state.detailsID}></ViewIssue>
        </Overlay>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    position: 'relative',
    padding: 0,
    borderTopWidth: 0.3,
    borderTopColor: '#555',
    width: '100%',
  }
})

export default Search;
