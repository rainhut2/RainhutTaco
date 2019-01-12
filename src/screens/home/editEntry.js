import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  Switch,
  StyleSheet
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Body,
  Textarea,
  Title,
  Input,
  Icon,
  Button,
  Label,
  Left,
  Right,
  CheckBox
} from "native-base";
import FastImage from "react-native-fast-image";
import { createImageProgress } from "react-native-image-progress";
const Image = createImageProgress(FastImage);
import * as Progress from "react-native-progress";

const INDICATORS = [null, Progress.Bar, Progress.Circle, Progress.Pie];
import styles from "./../styles";

export class EditEntry extends React.Component {
  constructor(props) {
    super(props);

    var text = "";
    var title = "";
    var img = "";

    if (global.currentEntryIndex != -1) {
      text =
        global.book.pages[global.currentBookIdx].entries[
          global.currentEntryIndex
        ].content;
      title =
        global.book.pages[global.currentBookIdx].entries[
          global.currentEntryIndex
        ].title;
      img =
        global.book.pages[global.currentBookIdx].entries[
          global.currentEntryIndex
        ].image;
    }

    this.state = {
      content: text,
      title: title,
      removeImage: false,
      img: img
    };
  }

  updateSize = height => {
    this.setState({
      height
    });
  };

  updateSizeTitle = height => {
    this.setState({
      heightTitle: height
    });
  };

  backButtonPressed = () => {
    this.goBackToPage();
  };

  goBackToPage = () => {
    this.props.navigation.goBack(); //.navigate("EditPage");
  };

  removeImagePressed = () => {
    this.setState({ removeImage: !this.state.removeImage });
  };

  saveButtonPressed = () => {
    var newEntry = {};
    Object.assign(
      newEntry,
      global.book.pages[global.currentBookIdx].entries[global.currentEntryIndex]
    );
    newEntry.title = this.state.title;
    newEntry.content = this.state.content;
    newEntry.header = this.state.header;
    newEntry.isHeader = this.state.isHeader;
    if (this.state.removeImage) {
      newEntry.image = "";
    }
    global.book.pages[global.currentBookIdx].entries[
      global.currentEntryIndex
    ] = newEntry;
    this.props.navigation.state.params.callback();
    this.goBackToPage();
  };

  saveTitle = title => {
    this.setState({ title: title });
  };

  saveContent = content => {
    this.setState({ content: content });
  };

  render() {
    const { title, height, heightTitle } = this.state;

    let newStyle = {
      height: height
    };

    let newStyleTitle = {
      height: heightTitle
    };

    return (
      <Container style={styles.container}>
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
            <Title>Edit Entry</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => {
                this.saveButtonPressed();
              }}
            >
              <Icon name="checkmark-circle" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Title</Label>
              <Input value={this.state.title} onChangeText={this.saveTitle} />
            </Item>
            <Item stackedLabel last>
              <Label>Content</Label>
              <Textarea
                value={this.state.content}
                style={{
                  textAlign: "left",
                  alignSelf: "flex-start",
                  height: 100,
                  paddingLeft: 0
                }}
                onChangeText={this.saveContent}
              />
            </Item>

            {this.state.img != "" && (
              <Item>
                <Text>Show Image</Text>
                <CheckBox
                  checked={!this.state.removeImage}
                  onPress={this.removeImagePressed}
                />
              </Item>
            )}
          </Form>
        </Content>
      </Container>
    );
  }
}
export default EditEntry;
