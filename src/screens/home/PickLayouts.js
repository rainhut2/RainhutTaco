import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Content, View } from "native-base"
import FastImage from "react-native-fast-image";
import RainhutTacoConfig from "./../../RainhutTacoConfig"

export default class PickLayouts extends Component {
    didTouchItem = (layout) => {
        console.log(layout)
    }

    render() {
        var { items } = this.props;
        var urls = []
        if (items == undefined) {
            items = []
        }
        for (var i = 0; i < items.length; i++) {
            urls.push({ url: "https://s3.amazonaws.com/rainhut/" + RainhutTacoConfig.layoutFolder + "/" + items[i] + ".png", layout: items[i] })            
        }
        var layouts = [];

        for (var i = 0; i < urls.length; i++) {
            layouts.push(
                <View key={i}  style={{ width: 90, height: 70 }} >
                    <TouchableOpacity onPress={this.props.didClickLayout.bind(this, urls[i].layout)}>
                        <FastImage source={{ uri: urls[i].url }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{ width: 90, height: 70 }} />
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <Content scrollEnabled={true} horizontal={this.props.isHorizontal}  style={{flex: 1}} >
                <View style={{flex: 1, flexDirection: this.props.direction}}>
                {layouts}
                </View>
            </Content>
        );
    }
}