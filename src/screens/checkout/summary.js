import React, { Component } from "react";
import {
  Container,
  Content,
  H2,
  H3,
  Text,
  Card,
  Body,
  CardItem
} from "native-base";
import CheckoutHeader from "./header";
import styles from "./../styles";

export default class CheckoutSummary extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <CheckoutHeader
          navigation={this.props.navigation}
          backRoute="goBack"
          nextRoute="CheckoutShipping"
        />
        <Content padder>
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Body>
                <H2 style={styles.mb10}>Summary</H2>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <H3>Product</H3>
                <Text style={styles.mb10}>{global.checkout.title}</Text>
                <H3>Description</H3>
                <Text style={styles.mb10}>
                  A {global.checkout.title} with {global.checkout.pageNumbers}{" "}
                  pages.
                </Text>
                <H3>Price</H3>
                <Text>${global.checkout.price}</Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
