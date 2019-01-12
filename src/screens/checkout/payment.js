import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import CheckoutHeader from './header'
export default class CheckoutBilling extends Component {
  render() {
    return (
      <Container>
    <CheckoutHeader navigation={this.props.navigation}  backRoute='CheckoutShipping' nextRoute='CheckoutSuccess' />
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}