import React, { Component } from "react";
import { TouchableHighlight, Text } from "react-native";
import { Content, View } from "native-base";
//import FastImage from "react-native-fast-image";
export default class PickThemes extends Component {
  render() {
    var themes = [
      { id: 1, title: "blue", url: "", color: "#00ff00" },
      { id: 2, title: "red", url: "", color: "#ff0000" }
    ];
    var layouts = [];
    for (var i = 0; i < themes.length; i++) {
      layouts.push(
        <View key={i} style={{ width: 100, height: 100 }}>
          <TouchableHighlight
            style={{
              width: 100,
              height: 100,
              backgroundColor: themes[i].color
            }}
            onPress={this.props.didClickTheme.bind(this, themes[i].id)}
          >
            <Text>Theme</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <Content
        scrollEnabled={true}
        horizontal={this.props.isHorizontal}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, flexDirection: this.props.direction }}>
          {layouts}
        </View>
      </Content>
    );
  }
}
