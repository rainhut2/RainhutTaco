import React, { Component } from "react";
import { Form, Item, Input, Label } from "native-base";
import Icon from "../../theme/components/Icon";

export default class Address extends Component {
  componentDidMount() {}

  changedText = (type1, text) => {
    var min = 2;
    if (type == "zip") {
      min = 5;
    }

    var type = type1;
    if (this.props.isShipping) {
      type += "Shipping";
    } else {
      type += "Billing";
    }
    if (text == undefined || text.length < min) {
      this.props.parent.setState({
        [type + "Error"]: true
      });
    } else {
      this.props.parent.setState({
        [type + "Error"]: false
      });
      this.props.parent.setState({
        [type + "Success"]: true
      });
    }

    this.props.parent.setState({
      [type]: text
    });

    this.forceUpdate();
  };

  getTypeValue = id => {
    var shipping = "Shipping";
    if (this.props.isShipping == false) {
      shipping = "Billing";
    }
    return this.props.state[id + shipping];
  };

  getTypeValueStatus = (id, statusStr) => {
    var shipping = "Shipping";
    if (this.props.isShipping == false) {
      shipping = "Billing";
    }
    return this.props.state[id + shipping + statusStr];
  };

  shippingItem = (text, id) => {
    //var test = this.getTypeValueStatus(id, "Error")
    var isSuccess = this.getTypeValueStatus(id, "Success") ? true : false;
    var isError = this.getTypeValueStatus(id, "Error") ? true : false;

    return (
      <Item stackedLabel success={isSuccess} error={isError}>
        <Label>{text}</Label>
        <Input
          value={this.getTypeValue(id)}
          onChangeText={textStr => this.changedText(id, textStr)}
        />
      </Item>
    );
  };

  render() {
    if (this.props.state == null) {
      return <Form />;
    }
    return (
      <Form>
        {this.shippingItem("First Name", "firstName")}
        {this.shippingItem("Last Name", "lastName")}
        {this.shippingItem("Street", "street")}
        {this.shippingItem("City", "city")}
        {this.shippingItem("State", "state")}
        {this.shippingItem("Zip", "zip")}
      </Form>
    );
  }
}
