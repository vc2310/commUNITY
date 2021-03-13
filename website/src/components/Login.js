import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { login, signup } from "../services/auth/AuthService";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  submit() {
    console.log("submit pressed");
    /*
    login(this.state.email, this.state.password)
      .then((res) => {
        if (res) {
          console.log("success");
        }
      })
      .catch((error) => {
        alert("Wrong");
      });*/
    const body_content = JSON.stringify({
      user: { email: "A@gmail.com", password: "abc" },
    });
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: body_content,
    };
    fetch("http://localhost:3000/v1/login", requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ postId: data.id }));
  }

  render() {
    return (
      <div>
        <div style={{ alignContent: "center" }}>
          <h1>commUNITY</h1>
        </div>
        <div>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(event) =>
                  this.setState({ email: event.target.value })
                }
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event) =>
                  this.setState({ password: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" onClick={this.submit.bind(this)}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
