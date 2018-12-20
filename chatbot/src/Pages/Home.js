import React, { Component } from "react";
import Clear from "@material-ui/icons/Clear";
import { Button } from "@material-ui/core";
import Chatbot from "./Chatbot";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chatbot: false, count: 0, reset: false, indexArray: [] };
  }

  handleChatbotClick = () => {
    this.setState({
      chatbot: !this.state.chatbot,
      count: this.state.count + 1
    });
    if (this.state.count > 1) {
      this.setState({ reset: true });
    }
  };

  closeChatbot = () => {
    this.setState({ chatbot: false, reset: false, indexArray: [] });
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "AntiqueWhite",
          height: "100%",
          width: "100%",
          position: "fixed",
          zIndex: 1000
        }}
      >
        {this.state.chatbot ? (
          <div
            style={{
              display: "flex",
              marginTop: "5%",
              justifyContent: "center"
            }}
          >
            <Chatbot
              closeChatbot={this.closeChatbot}
              indexArray={this.state.indexArray}
              count={this.state.count}
            />
          </div>
        ) : null}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            backgroundColor: "#5ec0bc",
            width: "100%",
            height: "15%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Button
            style={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "black",
              backgroundColor: "white",
              borderRadius: "15%",
              width: "20%",
              height: "50%"
            }}
            onClick={() => this.handleChatbotClick()}
          >
            Toggle Chatbot
          </Button>
        </div>
      </div>
    );
  }
}
