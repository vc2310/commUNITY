import React from "react";
import { View } from "react-native";
import { Container, Header, Content, Button, Text, H1 } from "native-base";

const App = () => {
  return (
    <Container style={{ backgroundColor: "skyblue" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <H1>commUNITY</H1>
      </View>
      <View
        style={{
          height: "20%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button>
          <Text>Login</Text>
        </Button>
      </View>
      <View
        style={{
          height: "20%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button danger>
          <Text>Sign Up</Text>
        </Button>
      </View>
    </Container>
  );
};

export default App;
