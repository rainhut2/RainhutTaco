import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,
  List,
  ListItem,
  ActionSheet
} from "native-base";
import styles from "./styles";

var BUTTONS = [
  { text: "Order Again", icon: "checkmark", iconColor: "#999999" },
  { text: "Close", icon: "close", iconColor: "#25de5b" }
];
var BUTTONSCANCANCEL = [
  BUTTONS[0],
  { text: "Cancel Order", icon: "stopwatch", iconColor: "#ff2000" },
  BUTTONS[1]
];

var sampleItems = [
  {
    orderId: 1,
    title: "Book",
    description: "",
    date: "1/11/2018",
    orderStatus: "shipped"
  },
  {
    orderId: 2,
    title: "Book",
    description: "",
    date: "5/19/2018",
    orderStatus: "processing"
  },
  {
    orderId: 3,
    title: "Book",
    description: "",
    date: "1/1/2018",
    orderStatus: "shipped"
  }
];

class Orders extends Component {
  state = {
    items: sampleItems
  };

  selectOrder = index => {
    //do cancel order here...
    var order = this.state.items[index];
    var cancelIndex = 1;
    var buttons = BUTTONS;

    if (order.orderStatus == "processing") {
      cancelIndex = 2;
      buttons = BUTTONSCANCANCEL;
    }

    ActionSheet.show(
      {
        options: buttons,
        cancelButtonIndex: cancelIndex,
        title: "Order Options"
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          alert("order again");
        } else if (cancelIndex != buttonIndex) {
          alert("cancel order");
        }
      }
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Orders</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <List
            dataArray={this.state.items}
            renderRow={(item, i1, index2) => (
              <ListItem>
                <Body>
                  <Text>
                    {item.title}
                    {item.description}
                  </Text>
                  <Text>{item.date}</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() => this.selectOrder(index2)}>
                    <Icon name="checkmark-circle" />
                  </Button>
                </Right>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

export default Orders;
