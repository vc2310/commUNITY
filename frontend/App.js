import React from "react";
import { View } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Login from "./components/Login"
import Home from "./components/Home"
import {isLoggedIn} from "./services/auth/AuthService"

const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      Home: { screen: Home },
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
