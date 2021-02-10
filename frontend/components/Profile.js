import React from "react";
import { View, TextInput, Alert, ScrollView, StyleSheet, Image } from "react-native";
import { IconButton, Chip } from 'react-native-paper';
import { Container, Header, Content, Button, Text, H1, H2, H3 } from "native-base";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { getUser, logout } from "../services/auth/AuthService"
import { getIssues, getIssue } from "../services/issue/IssueService";
import { Avatar, Accessory } from 'react-native-elements';
import FontAwesome from "react-native-vector-icons/FontAwesome";


class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
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
      email: 'my email',
      firstName: '',
      lastName: '',
      token: '',
      address: { city: '', province: '', country: '' },
      internalId: '',
      isCM: '',
      userIssues: []
    }
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

  componentDidMount() {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }
  load = () => {
  getUser().then((res) => {
    res.user.email.then((email) => {
      this.setState({ email: email })
    })
    res.user.firstName.then((firstName) => {
      this.setState({ firstName: firstName })
    })
    res.user.lastName.then((lastName) => {
      this.setState({ lastName: lastName })
    })
    res.user.lastName.then((token) => {
      this.setState({ token: token })
    })
    res.user.address.city.then((city) => {
      res.user.address.province.then((province) => {
        res.user.address.country.then((country) => {
          console.log(city, province, country)
          this.setState({ address: { city: city, province: province, country: country } })
        })
      })
    })
    res.user.id.then((internalId) => {
      this.setState({ internalId: internalId })

      getIssues({ "createdBy": internalId }).then((response) => {
        // Most recent issues show up first
        console.log(this.state.userIssues)
        var tempIssues = response.issues.reverse()
        this.setState({ userIssues: tempIssues })
      }).catch((err) => {
        console.log(err)
      })
    })
    res.user.isCM.then((isCM) => {
      this.setState({ isCM: isCM })
    })
  })

  }

  render() {
    const profileText = (field) => {
      if (field == 'email') {
        getUser().then((res) => {
          res.user.email.then((email) => {
            console.log(email)
            return email
          })
        })
      }
    }
    return (
      <ScrollView style={{ backgroundColor: '#1c2636', padding: '5%' }} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10%"
        }}>
          <H1 style={{ color: 'white' }}>{this.state.firstName} {this.state.lastName}</H1>
        </View>
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "5%"
        }}>
          <Avatar
            placeholderStyle={{ backgroundColor: '#efd7d7' }}
            size="xlarge"
            rounded
            showAccessory
            title={this.state.firstName.charAt(0).toUpperCase() + this.state.lastName.charAt(0).toUpperCase()}>
          </Avatar>
          {this.state.isCM == 1 ? <FontAwesome name="check-circle" size={30} style={{ color: '#1DA1F2' }} /> : <H1></H1>}
        </View>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10%"
        }}>
          <H3 style={{ color: 'white' }}>Email: {this.state.email}</H3>
          <H3 style={{ color: 'white' }}>Address: {this.state.address.city + ", " + this.state.address.province + ", " + this.state.address.country}</H3>
        </View>

        <View>
          <H1 style={{ color: 'white' }}>Your Issues</H1>
          <View>
            {
              this.state.userIssues.map((item, index) => (
                <View key={item.id} style={styles.item}>
                  <View style={{ flexDirection: 'column' }}>
                    <View>
                      <Text style={{ fontWeight: 'bold', color: 'white' }}>{item.title}</Text>
                      <Text style={{ color: 'white' }}>{item.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', minWidth: '50%', maxWidth: '60%' }}>
                      <Chip icon="information">{this.status(item.status)}</Chip>
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
        </View>

        <View style={{
          // flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10%"
        }}>
          <Button danger onPress={() => { logout().then(this.props.navigation.navigate("Login")).catch((error) => { console.log(error) }) }}>
            <Text>LogOut</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    borderWidth: 0.5,
  }
})

export default Profile;
