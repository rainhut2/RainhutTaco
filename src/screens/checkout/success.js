import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Text } from 'native-base';
import CheckoutHeader from './header'
import styles from "./../styles";
export default class CheckoutSuccess extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <CheckoutHeader navigation={this.props.navigation}  backRoute='goBackHome' nextRoute='goBackHome' />
        <Content>
         <Text style={{paddingBottom: 10, paddingLeft: 10, paddingTop: 10, paddingRight: 10}}>Success! You have ordered your book.</Text>
        </Content>
      </Container>
    );
  }
}