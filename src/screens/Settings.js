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
  Form,
  Item,
  Picker,
  Input,
  Label,
  Text
} from "native-base";
import { Dimensions, Slider, View } from "react-native";
import styles from "./styles";

class Settings extends Component {
  state = {
    selected2: false,
    setup: global.book.setup
  };

  dimensionsChangedHandler = ({ window: { width, height } }) => {
    this.setState({ viewPortWidth: width });
  };

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.dimensionsChangedHandler);
  }

  componentDidMount() {
    const { width, height } = Dimensions.get("window");
    this.setState({ viewPortWidth: width });
    Dimensions.addEventListener("change", this.dimensionsChangedHandler);
    this.forceUpdate();
  }

  updateVariable = (obj, path, value) => {
    var schema = obj;
    var pList = path.split(".");
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
  };

  changedText = (p1, text, update) => {
    this.updateVariable(this.state, p1, text);
    global.book.setup = this.state.setup;
    global.bookNeedsUpdate = true;
    if (update) {
      this.forceUpdate();
    }
  };

  settingsInputItem = (title, value, prop) => {
    return (
      <Item floatingLabel>
        <Label>{title}</Label>
        <Input
          value={value}
          onChangeText={text => this.changedText(prop, text)}
        />
      </Item>
    );
  };

  settingSliderItem = (title, value, prop, min, max, stepAmount) => {
    if (stepAmount == undefined) {
      stepAmount = 1.0;
    }
    return (
      <Item>
        <View
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        >
          <Label>{title}</Label>
          <Text>{String(value)}</Text>
          <Slider
            value={value}
            step={stepAmount}
            onValueChange={text => this.changedText(prop, text)}
            onSlidingComplete={() => this.forceUpdate()}
            minimumValue={min}
            maximumValue={max}
          />
        </View>
      </Item>
    );
  };

  getOptions = options => {
    var layouts = [];
    for (var i = 0; i < options.length; i++) {
      layouts.push(
        <Picker.Item
          key={i}
          label={options[i].label}
          value={options[i].value}
        />
      );
    }
    return layouts;
  };

  settingsPickerItem = (title, value, prop, options) => {
    return (
      <Item picker>
        <Label>{title}</Label>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="ios-arrow-round-down" />}
          style={{ width: this.state.viewPortWidth }}
          placeholderStyle={{ color: "#bfc6ea" }}
          placeholderIconColor="#007aff"
          selectedValue={value}
          onValueChange={text => this.changedText(prop, text, true)}
        >
          {this.getOptions(options)}
        </Picker>
      </Item>
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
            <Title>Settings</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            {this.settingSliderItem(
              "Minimum Image DPI",
              this.state.setup.minimumDpi,
              "setup.minimumDpi",
              50,
              300
            )}
            {this.settingSliderItem(
              "High Res DPI",
              this.state.setup.highResDpi,
              "setup.highResDpi",
              90,
              500
            )}
            {this.settingsInputItem(
              "Background Image",
              this.state.setup.backgroundImage,
              "setup.backgroundImage"
            )}
            {this.settingSliderItem(
              "Image Rotate Amount",
              this.state.setup.rotateAmount,
              "setup.rotateAmount",
              -15,
              15
            )}
            {this.settingSliderItem(
              "Min Text For Full Page",
              this.state.setup.minTextFullPage,
              "setup.minTextFullPage",
              100,
              2000
            )}

            {this.settingsPickerItem(
              "Images Count",
              this.state.setup.fitImagesRule,
              "setup.fitImagesRule",
              [{ label: "Few", value: "few" }, { label: "Many", value: "many" }]
            )}
            {this.settingsPickerItem(
              "Crop Image",
              this.state.setup.cropImage,
              "setup.cropImage",
              [{ label: "Yes", value: "true" }, { label: "No", value: "false" }]
            )}

            {this.settingsInputItem(
              "Title Font",
              this.state.setup.titleStyle.fontFamily,
              "setup.titleStyle.fontFamily"
            )}
            {this.settingsInputItem(
              "Title Color",
              this.state.setup.titleStyle.textColor,
              "setup.titleStyle.textColor"
            )}
            {this.settingSliderItem(
              "Title Size",
              this.state.setup.titleStyle.size,
              "setup.titleStyle.size",
              0.1,
              3.0
            )}
            {this.settingsInputItem(
              "Title Font Weight",
              this.state.setup.titleStyle.weight,
              "setup.titleStyle.weight"
            )}

            {this.settingsInputItem(
              "Content Font",
              this.state.setup.contentStyle.fontFamily,
              "setup.contentStyle.fontFamily"
            )}
            {this.settingsInputItem(
              "Content Color",
              this.state.setup.contentStyle.textColor,
              "setup.contentStyle.textColor"
            )}
            {this.settingSliderItem(
              "Content Size",
              this.state.setup.contentStyle.size,
              "setup.contentStyle.size",
              0.1,
              3.0,
              0.1
            )}
            {this.settingsInputItem(
              "Content Font Weight",
              this.state.setup.contentStyle.weight,
              "setup.contentStyle.weight"
            )}

            {this.settingsInputItem(
              "Footer Font",
              this.state.setup.footerStyle.fontFamily,
              "setup.footerStyle.fontFamily"
            )}
            {this.settingsInputItem(
              "Footer Color",
              this.state.setup.footerStyle.textColor,
              "setup.footerStyle.textColor"
            )}
            {this.settingSliderItem(
              "Footer Size",
              this.state.setup.footerStyle.size,
              "setup.footerStyle.size",
              0.1,
              3.0,
              0.1
            )}
            {this.settingsInputItem(
              "Footer Font Weight",
              this.state.setup.footerStyle.weight,
              "setup.footerStyle.weight"
            )}

            {this.settingsInputItem(
              "Header Font",
              this.state.setup.headerStyle.fontFamily,
              "setup.headerStyle.fontFamily"
            )}
            {this.settingsInputItem(
              "Header Color",
              this.state.setup.headerStyle.textColor,
              "setup.headerStyle.textColor"
            )}
            {this.settingSliderItem(
              "Header Size",
              this.state.setup.headerStyle.size,
              "setup.headerStyle.size",
              0.1,
              3.0,
              0.1
            )}
            {this.settingsInputItem(
              "Header Font Weight",
              this.state.setup.headerStyle.weight,
              "setup.headerStyle.weight"
            )}

            {this.settingsInputItem(
              "Date Font",
              this.state.setup.dateStyle.fontFamily,
              "setup.dateStyle.fontFamily"
            )}
            {this.settingsInputItem(
              "Date Color",
              this.state.setup.dateStyle.textColor,
              "setup.dateStyle.textColor"
            )}
            {this.settingSliderItem(
              "Date Size",
              this.state.setup.dateStyle.size,
              "setup.dateStyle.size",
              0.1,
              3.0,
              0.1
            )}
            {this.settingsInputItem(
              "Date Font Weight",
              this.state.setup.dateStyle.weight,
              "setup.dateStyle.weight"
            )}
          </Form>
        </Content>
      </Container>
    );
  }
}

export default Settings;
