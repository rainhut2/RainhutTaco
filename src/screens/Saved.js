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
  Thumbnail
} from "native-base";
import styles from "./styles";

import tacoDbHelperClass from "./../db/tacoDbHelper";
const tacoDbHelper = new tacoDbHelperClass();

class Saved extends Component {
  state = {
    items: []
  };

  componentWillUnmount() {
    tacoDbHelper.destroy();
  }

  componentDidMount() {
    tacoDbHelper.setup(() => {
      tacoDbHelper.getAll((result, error) => {
        if (error) {
          this.setState({
            error: error.message
          });
        } else {
          this.setState({
            items: result
          });
        }
      });
    });
  }

  selectPressed = item => {
    global.book = item.json;
    global.bookFromSaved = true;
    alert("Loaded saved book");
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
            <Title>Saved</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <List
            dataArray={this.state.items}
            renderRow={(item, i1, index2) => (
              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={{ uri: item.thumbnail }} />
                </Left>
                <Body>
                  <Text>{item.bookid}</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() => this.selectPressed(item)}>
                    <Text>Select</Text>
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

export default Saved;
