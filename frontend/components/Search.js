import React from "react";
import { View, TextInput, Alert, StyleSheet, ScrollView } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import LocationAutocomplete from '../components/LocationAutocomplete'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { getUser, logout } from "../services/auth/AuthService"
import { getIssues, upVoteIssue } from "../services/issue/IssueService"

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
    this.state =  {
      issues: [],
      center: [],
      userID: '',
      userCity: ''
    }
  }
  componentDidMount() {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }
  load = () => {

    getUser().then((res)=> {
      res.user.id.then((id)=> {
        this.setState({userID: id})
      })
      res.user.address.city.then((city)=> {
        this.setState({userCity: city})
      })
    })
    getIssues().then((response)=>{
      var tempIssues = response.issues
      tempIssues.sort((a,b)=> (a.upVotes.length > b.upVotes.length) ? -1 : (a.upVotes.length < b.upVotes.length) ? 1 : 0)
      this.setState({issues: tempIssues})
    }).catch((err)=>{
      console.log(err)
    })
    }
  upvote(issueID){
    console.log(this.state.userID, issueID)
    upVoteIssue(this.state.userID, issueID).then((response)=>{
      var issues = this.state.issues
      objIndex = this.state.issues.findIndex((obj => obj.id == issueID));
      issues[objIndex].upVotes = response.issue.upVotes
      issues.sort((a,b)=> (a.upVotes.length > b.upVotes.length) ? -1 : (a.upVotes.length < b.upVotes.length) ? 1 : 0)
      this.setState({issues: issues})
    }).catch((err)=>{
      console.log(err)
    })
  }
  render () {
    return (
      <View style={{backgroundColor: '#1c2636'}}>
        <ScrollView style={{marginTop: '25%'}}>
               {
                  this.state.issues.map((item, index) => (
                     <View key = {item.id} style = {styles.item}>
                       <View>
                          <Text style={{fontWeight: 'bold', color: 'white'}}>{item.title}</Text>
                          <Text  style={{color: 'white'}}>{item.description}</Text>
                      </View>
                      <View>
                        <View style={{flexDirection: 'column'}}>
                          {item.address.city === this.state.userCity && <Button onPress={(e)=> {this.upvote(item.id)}}>
                              <Text>
                                ^
                              </Text>
                          </Button>}
                          <Text>
                            {item.upVotes.length}
                          </Text>
                        </View>
                      </View>
                     </View>
                  ))
               }
        </ScrollView>
        <View style={{position: 'absolute', justifyContent: "center", width: "75%", marginTop: "10%", marginLeft: "12.5%"}}>
          <LocationAutocomplete onSelect={(item) => {this.setState({ center: item.center})}}/>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
   item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 30,
      borderWidth: 0.5,
   }
})

export default Search;
