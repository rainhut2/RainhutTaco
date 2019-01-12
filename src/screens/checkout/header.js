import React, { Component } from "react";
import { Header, Left, Right, Button, Icon, Body, Title } from "native-base";

export default class CheckoutHeader extends Component {
  backButtonPressed = () => {
    if (this.props.backCallback != undefined) {
      this.props.backCallback();
    } else if (this.props.backRoute == "goBack") {
      this.props.navigation.goBack();
    } else if (this.props.backRoute == "goBackHome") {
      this.props.navigation.popToTop();
    } else {
      this.props.navigation.navigate(this.props.backRoute);
    }
  };

  nextButtonPressed = () => {
    if (this.props.nextCallback == undefined) {
      this.props.navigation.navigate(this.props.nextRoute);
    } else if (this.props.nextCallback == "goBackHome") {
      this.props.navigation.popToTop();
    } else {
      this.props.nextCallback();
    }
  };
  render() {
    const { items } = this.props;
    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => {
              this.backButtonPressed();
            }}
          >
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Checkout</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => this.nextButtonPressed()}>
            <Icon name="checkmark-circle" />
          </Button>
        </Right>
      </Header>
    );
  }
}
