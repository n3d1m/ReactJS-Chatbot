import React from "react";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import Clear from "@material-ui/icons/Clear";
import { Form, FormGroup } from "reactstrap";
import Support from "./support.png";
import chatbotStyles from "./chatbot.css";
import $ from "jquery";

var messageList = [];
var returnMessageList = [];
var doubleArray = ["", "Hey, ask me anything"];
var tempArray = [];
var sentMessage;
var receivedMessage;

var trigger = ["hey", "hello", "hi"];
var reply = [
  "Hi, how can I help you?",
  "Hi, how can I help you?",
  "Hi, how can I help you?"
];
var alternative = ["I'm not sure what you mean, I am just a robot :("];
let outputText = "";

export default class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      activate: false,
      count: props.count,
      indexArray: props.indexArray
    };
    this.onKeyPress = this.onKeyPress.bind(this);
    this.handleSentMessage = this.handleSentMessage.bind(this);
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
    this.outputFunction = this.outputFunction.bind(this);
    this.keyWord = this.keyWord.bind(this);
    this.similarity = this.similarity.bind(this);
    this.editDistance = this.editDistance.bind(this);
    this.indexOfMax = this.indexOfMax.bind(this);
    this.doubleAppend = this.doubleAppend.bind(this);
  }

  findOverflow = () => {
    var container = document.getElementById("container");
    var background = document.getElementById("background");

    if ($(container).height() > $(background).height()) {
      //alert("overflow");
      var height = $(container).height();
      $(background).scrollTop(height);
    } else {
      console.log("no");
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();

      this.setState({ activate: true });
    }
  }

  handleSentMessage() {
    if (this.state.activate) {
      messageList.push(this.state.message);
      this.setState({ activate: false, message: "" });
    }

    var messageIndex;

    for (var i = 0; i < messageList.length; i++) {
      if (messageList.length <= 1) {
        sentMessage = messageList[0];
      } else {
        messageIndex = messageList.length - 1;
        sentMessage = messageList[messageIndex];
      }
    }

    tempArray.push(sentMessage);
  }

  handleReceivedMessage() {
    if (this.state.activate) {
      this.outputFunction(this.state.message);
    }

    var messageIndex;

    for (var i = 0; i < returnMessageList.length; i++) {
      if (returnMessageList.length <= 1) {
        receivedMessage = returnMessageList[0];
      } else {
        messageIndex = returnMessageList.length - 1;
        receivedMessage = returnMessageList[messageIndex];
      }
    }

    tempArray.push(receivedMessage);
  }

  outputFunction(message) {
    let product;
    let text;

    try {
      // eslint-disable-next-line no-eval
      product = message + " = " + eval(message);
    } catch (e) {
      text = message.toLowerCase().replace(/[^\w\s\d]/gi, "");
      text = text
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "");
      if (this.keyWord(trigger, reply, text)) {
        product = this.keyWord(trigger, reply, text);
      } else {
        product = alternative[Math.floor(Math.random() * alternative.length)];
      }
      outputText = product;
      returnMessageList.push(outputText);
      var length = outputText.length;
    }
  }

  keyWord(trig, response, string) {
    var item;
    var status;
    var numArray = [];

    for (var i = 0; i < trig.length; i++) {
      if (trig[i] === string) {
        item = response[i];
        status = true;
        break;
      } else {
        status = false;
      }
    }

    if (status === true) {
      return item;
    } else {
      for (var j = 0; j < trig.length; j++) {
        let result = this.similarity(string, trig[j]);
        numArray.push(result);
        let maxIndex = this.indexOfMax(numArray);

        if (result >= 0.65) {
          item = reply[maxIndex];

          return item;
        } else {
        }
      }
    }
  }

  similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (
      (longerLength - this.editDistance(longer, shorter)) /
      parseFloat(longerLength)
    );
  }

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  indexOfMax(arr) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  }

  doubleAppend() {
    console.log(this.state.count);
    tempArray.splice(0, tempArray.length - 2);
    if (this.state.activate) {
      let indexMax = messageList.length;
      doubleArray.push(messageList[indexMax - 1]);
      doubleArray.push(returnMessageList[indexMax - 1]);
    }

    return doubleArray.map((messages, index) => {
      console.log(index);
      if (this.state.count == 1) {
        console.log("I am here");
        if (index == 0 || index % 2 == 0) {
          return (
            <div style={{ paddingBottom: "15px" }}>
              <div
                className="speech-bubble"
                style={{
                  fontSize: 12,
                  visibility: messages === "" ? "hidden" : "visible"
                }}
                id="messages"
              >
                {messages}
              </div>
            </div>
          );
        } else {
          if (index === 0 || index === 1) {
            return (
              <div style={{ paddingBottom: "15px" }}>
                <div
                  className="speech-bubble-reply2"
                  style={{ fontSize: 12, marginTop: "-3%" }}
                >
                  {messages}
                </div>
              </div>
            );
          } else {
            return (
              <div style={{ paddingBottom: "15px" }}>
                <div className="fb-chat ">
                  <div className="fb-chat--bubbles">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div
                  className="speech-bubble-reply"
                  style={{ fontSize: 12, marginTop: "-11%" }}
                >
                  {messages}
                </div>
              </div>
            );
          }
        }
      } else {
        var currentLength = doubleArray.length - 1;
        this.state.indexArray.push(currentLength);
        var finalIndex = this.state.indexArray[0];
        if (finalIndex >= index) {
          if (index == 0 || index % 2 == 0) {
            return (
              <div style={{ paddingBottom: "15px" }}>
                <div
                  className="speech-bubble"
                  style={{
                    fontSize: 12,
                    visibility: messages === "" ? "hidden" : "visible"
                  }}
                  id="messages"
                >
                  {messages}
                </div>
              </div>
            );
          } else {
            return (
              <div style={{ paddingBottom: "15px" }}>
                <div className="speech-bubble-reply2" style={{ fontSize: 12 }}>
                  {messages}
                </div>
              </div>
            );
          }
        } else {
          if (index == 0 || index % 2 == 0) {
            return (
              <div style={{ paddingBottom: "15px" }}>
                <div
                  className="speech-bubble"
                  style={{ fontSize: 12 }}
                  id="messages"
                >
                  {messages}
                </div>
              </div>
            );
          } else {
            return (
              <div style={{ paddingBottom: "15px" }}>
                <div className="fb-chat ">
                  <div className="fb-chat--bubbles">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div
                  className="speech-bubble-reply"
                  style={{ fontSize: 12, marginTop: "-11%" }}
                >
                  {messages}
                </div>
              </div>
            );
          }
        }
      }
    });
  }

  render() {
    {
      this.findOverflow();
    }

    return (
      <div
        style={{
          backgroundColor: "white",
          width: 300,
          height: 450,
          borderRadius: "5px",
          borderStyle: "solid",
          borderColor: "grey",
          borderWidth: "1px"
        }}
      >
        {this.handleReceivedMessage()}
        {this.handleSentMessage()}

        <Navbar
          style={{
            width: 300,
            height: 50,
            backgroundColor: "#5ec0bc",
            borderRadius: "3px"
          }}
        >
          <Navbar.Header>
            <Navbar.Brand>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    marginTop: "1%",
                    marginLeft: "2%",
                    borderRadius: "50%",
                    borderWidth: 0.5,
                    borderColor: "white",
                    borderStyle: "solid",
                    backgroundColor: "white",
                    height: 40,
                    width: 40
                  }}
                >
                  <img
                    src={Support}
                    height="30"
                    width="30"
                    style={{ padding: 4 }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "-45%",
                    marginTop: "-2.5%"
                  }}
                >
                  <p style={{ fontSize: 15 }}>Chatbot</p>

                  <div
                    style={{
                      marginTop: -12
                    }}
                  >
                    <div
                      style={{
                        borderStyle: "solid",
                        borderRadius: "50%",
                        borderWidth: 0.5,
                        backgroundColor: "#448E34",
                        borderColor: "#448E34",
                        height: 10,
                        width: 10
                      }}
                    />
                    <p
                      style={{
                        fontSize: 10,
                        marginTop: -11,
                        marginLeft: 15,
                        opacity: 0.8
                      }}
                    >
                      Online Now
                    </p>
                  </div>
                </div>

                <Clear
                  style={{
                    height: 25,
                    width: 25,
                    float: "right",
                    marginTop: "3.5%",
                    cursor: "pointer"
                  }}
                  onClick={() => this.props.closeChatbot()}
                />
              </div>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <center>
          <div
            style={{
              width: 298,
              height: 365,
              overflowY: "scroll",
              marginTop: "0%",
              backgroundColor: "#F9F9F9"
            }}
            id="background"
          >
            <div className="column" id="container">
              {this.doubleAppend()}
            </div>
          </div>
        </center>
        <hr
          style={{
            position: "absolute",
            marginTop: "0%",
            width: 300,
            height: "0px",
            border: "none",
            borderTop: " 1px solid black"
          }}
        />
        <Form
          style={{
            width: 298,
            height: 20,
            borderRadius: "3px",
            position: "absolute",
            backgroundColor: "white",
            marginTop: "0.5%"
          }}
          onKeyPress={this.onKeyPress}
        >
          <FormGroup>
            <input
              style={{
                display: "flex",
                marginTop: "0%",
                fontFamily: "Avenir Next",
                color: "black",
                float: "left",
                backgroundColor: "white",
                height: 20
              }}
              className="inputChatbot"
              type="text"
              placeholder="Type a message..."
              value={this.state.message}
              onChange={this.handleChange("message")}
            />
          </FormGroup>
        </Form>
      </div>
    );
  }
}
