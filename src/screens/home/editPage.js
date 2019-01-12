import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  List,
  Title,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Icon
} from "native-base";
import styles from "./../styles";

export class EditPage extends Component {
  constructor(props) {
    super(props);

  }

 

  saveButtonPressed = () => {
    var oldCount = global.book.pages[global.currentBookIdx].entries.length
    global.book.pages[global.currentBookIdx].entries = this.state.entries
    var didDelete = false
    var needsLayout = false
    if(this.state.entries.length == 0) {
      didDelete = true
    }
    if(oldCount != this.state.entries) {
      needsLayout = true
    }
    this.setCallback(needsLayout, didDelete)
    this.backButtonPressed()
  }

  setCallback = (needsLayout, didDeletePage) => {
    const { navigation } = this.props;
    navigation.state.params.callback(needsLayout, didDeletePage);
  }

  backButtonPressed = () => {
    this.props.navigation.goBack();
  };


  state = {
    entries: global.book.pages[global.currentBookIdx].entries,
    doUpdate: false
  }
  
  
  setEntriesState = () => {
    this.setState({ entries: global.book.pages[global.currentBookIdx].entries });
    this.forceUpdate();
  }

  doUpdate = () => {
    this.setState({doUpdate: false})
    this.forceUpdate();
  }
  didEditEntryCallback = () => {
    this.setEntriesState()
    this.setState({doUpdate: true})

    window.setTimeout(this.doUpdate.bind(this), 10)

  };

  editPressed = index => {
    global.currentEntryIndex = index;
    this.props.navigation.navigate("EditEntry", {
      callback: this.didEditEntryCallback.bind(this)
    });
  };

  getImageLeft = (image) => {
    if(image == '') {
      return (null)
    }
    else {
      return (<Left>
        {(image == '')?(<Thumbnail />):
        (<Thumbnail square source={{uri: image }} />)}
            </Left>)
    }
  }

  render() {
    if(this.state.doUpdate) {
      return <Container></Container>
    }
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
            <Title>Edit Entries</Title>
          </Body>
          <Right>
            <Button transparent  onPress={() => {
                this.saveButtonPressed();
              }}>
              <Icon name="checkmark-circle" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List
            dataArray={this.state.entries}
            renderRow={(item, i1, index2) => (
              <ListItem thumbnail>
                {this.getImageLeft(item.image)}
                <Body>
                  <Text>{item.title}</Text>
                  <Text note numberOfLines={1}>
                    {item.content}
                  </Text>
                </Body>
                <Right>
                  <Button transparent onPress={() => this.editPressed(index2)}>
                    <Text>Edit</Text>
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

export default EditPage;