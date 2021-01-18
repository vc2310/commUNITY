import React from "react";
import { View } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./components/Login"
import Home from "./components/Home"
import Profile from "./components/Profile"
import {isLoggedIn} from "./services/auth/AuthService"
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const Main = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" size={30} color={tintColor} />
        )
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }
);

const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      Home: { screen: Main },
      Login: { screen: Login },
    },
    {
      initialRouteName: signedIn ? "Home" : "Login"
    }
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    isLoggedIn()
      .then(res => {
        console.log(res)
        this.setState({ signedIn: res, checkedSignIn: true })
      })
      .catch(err => alert("An error occurred"));
  }

  render () {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createAppContainer(createRootNavigator(signedIn));
    return <Layout />;
  }
}

export default App;
