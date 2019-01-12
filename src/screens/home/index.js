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
  View
} from "native-base";
import styles from "./../styles";
import style from "./style";
import Carousel from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import { createImageProgress } from "react-native-image-progress";
const Image = createImageProgress(FastImage);
import * as Progress from "react-native-progress";
const INDICATORS = [null, Progress.Bar, Progress.Circle, Progress.Pie];
import { RainhutCreateBook, RainhutUpdateBook, RainhutUploadBook } from "./../../api/index";
import tacoDbHelperClass from "./../../db/tacoDbHelper"
const tacoDbHelper = new tacoDbHelperClass()
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";

import {
  State,
  LongPressGestureHandler,
  TapGestureHandler
} from "react-native-gesture-handler";
import PickLayouts from "./PickLayouts";
import PickThemes from "./PickThemes";
import {checkoutObjectInit} from './../checkout/checkoutObject'
var sliderWidth, itemWidth = 0;

class Home extends Component {
  state = {
    pages: [],
    isLoading: true,
    editIndex: 0,
    leftImageHighlighted: true
  };

  createBookSuccess = json => {
    if(json.message != undefined) {

      alert(json.message)
    }
    else {
    global.book = json;
    console.log(json.pages[15])
    this.setGroupPages(json.pages);
    this.setCurrentBookIndex(true);
    this.forceUpdate();
    }
  };

  createBookError = err => {
    this.setState({
      error: true
    });
  };

  constructor(props) {
    super(props);
  }

  setCurrentOtherLayoutOptions = () => {
   
    var currentPage = global.book.pages[global.currentBookIdx];
    if(currentPage == undefined) {return;}
    var options = currentPage.otherLayoutOptions;
    var optionsToSet = [];
    for (var i = 0; i < options.length; i++) {
      if (currentPage.layout != options[i]) {
        optionsToSet.push(options[i]);
      }
    }
    this.state.currentOtherLayoutOptions = optionsToSet;
  };

  editPage = () => {
    this.setCurrentBookIndex(this.state.leftImageHighlighted);
    var page = global.book.pages[global.currentBookIdx];
    this.props.navigation.navigate("EditPage", {
      page: page,
      callback: this.callbackFromEdit
    });
  };

  callbackfromEditSuccess = json => {
    global.book.pages[global.currentBookIdx] = json.pages[0];
    this.setGroupPages(global.book.pages);
  }

  callbackFromEdit = (needsLayout, didDeletePage) => {
    if (didDeletePage == false) {
      RainhutUpdateBook(
        global.book,
        global.currentBookIdx,
        false,
        needsLayout, this.callbackfromEditSuccess,
        err => {}
      );
    } else {
      this.setGroupPages(global.book.pages);
    }
  };

  closeEdit = () => {
    this.setState({
      editIndex: 0
    });
  };

  editLayouts = () => {
    this.state.editIndex = 1;

    this.forceUpdate();
  };
  editThemes = () => {
    this.state.editIndex = 2;
    this.forceUpdate();
  };
  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.dimensionsChangedHandler)
    tacoDbHelper.destroy()
  }

  dimensionsChangedHandler = ({ window: { width, height } }) => {
    this.setDimensionsForSlider(width, height);
    this.forceUpdate();
  }

  componentDidMount() {
    console.log("component did mount")
    tacoDbHelper.setup()
    Dimensions.addEventListener("change", this.dimensionsChangedHandler);
    const { width, height } = Dimensions.get("window");
    this.setDimensionsForSlider(width, height);
    if (global.book == undefined) {
      global.currentBookIdx = 0;
      global.currentSnapIndex = 0;
      RainhutCreateBook(
        undefined,
        this.createBookSuccess,
        this.createBookError
      );
    } 
    else if(global.bookNeedsUpdate) {
      this.updateBookFromGlobal();
      global.bookNeedsUpdate = false;
    }
    else {
      this.setGroupPages(global.book.pages);
    }
  }

  setGroupPagesGlobal = () => {
    if(global.book != undefined) {
      this.setGroupPages(global.book.pages)
    }
  }

  setDimensionsForSlider(viewportWidth, viewportHeight) {
    if (viewportWidth > viewportHeight) {
      sliderWidth = viewportWidth - 100;
      this.setState({ isLandscape: true }, () => {
        this.setGroupPagesGlobal()
      });
    } else {
      sliderWidth = viewportWidth;
      this.setState({ isLandscape: false }, () => {
        this.setGroupPagesGlobal()
      });
    }
    itemWidth = sliderWidth;
  }

  setCurrentBookIndex = _leftImageHighlighted => {
    if(this._carousel == undefined) {
      return;
    }

    if(this.state.groupPages == 0) {
      return;
    }

    var idx = this._carousel.currentIndex;
    global.currentSnapIndex = idx;
    var idx1 = this.state.groupPages[idx].pageIndex1 - 1;
   
    if (_leftImageHighlighted == false) {
      idx1 = this.state.groupPages[idx].pageIndex2 - 1;
    }
   
    global.currentBookIdx = idx1;
    this.setCurrentOtherLayoutOptions();
  };

  setGroupPages = pages => {
    if(pages == undefined) {
      return;
    }
    //split pages into page numbers...
    if(pages.length == 0) {
      return;
    }
    var groupPages = [];
    for (var i = 0; i < pages.length; i++) {
      var obj = {};
      var page = pages[i];
      obj.page1Image = page.sampleImage2;
      obj.pageIndex1 = i + 1;

      if (i + 1 < pages.length && this.state.isLandscape) {
        obj.page2Image = pages[i + 1].sampleImage2;
        i++;
        obj.pageIndex2 = i + 1;
      }
      groupPages.push(obj);
    }
    this.setState({
      groupPages: groupPages,
      isLoading: false
    });
  };

  handleRightImageTouched = () => {
      this.setState({ leftImageHighlighted: false });
      this.setCurrentBookIndex(false);
      console.log("right one touched...");
  };

  handleLeftImageTouched = () => {
      this.setState({ leftImageHighlighted: true });
      this.setCurrentBookIndex(true);
      console.log("left one touched...");
  };

  _handleStateChange = (event) => {

  }

  _handleStateChange2 = (event) => {
    
  }

  incrementErrorImageCount = (page, isLeft) => {
    if(isLeft) {
      if(page.errorImageCountL == undefined) {
        page.errorImageCountL = 1
      }
      else {
        page.errorImageCountL += 1
      }
    
    }
    else {
    if(page.errorImageCountR == undefined) {
      page.errorImageCountR = 1
    }
    else {
      page.errorImageCountR += 1
    }
    
  }
  
  }

  onImageLoad = (index, isLeft) => {
    const imageErrorRetryCount = 3
    var page = this.state.groupPages[index]
    var errorCount = (isLeft)?page.errorImageCountL:page.errorImageCountR
    if(errorCount != undefined && errorCount <= imageErrorRetryCount) {
      var needsUpdate = false
      if(isLeft && page.original1Image != undefined) {
        page.page1Image = page.original1Image
        needsUpdate = true
      }
      else if (page.original2Image != undefined)  {
        page.page2Image = page.original2Image
        needsUpdate = true
      }

      if(needsUpdate) {
        var pages = this.state.groupPages
        pages[index] = page
        this.setState({groupPages: pages})  
      }
    }
  }

  onImageError  = (index, isLeft) => {
    var page = this.state.groupPages[index]
    this.incrementErrorImageCount(page, isLeft)
      if(isLeft) {
        page.original1Image = page.page1Image
        page.page1Image = "https://s3.amazonaws.com/rainhut/404Error.png"
      }
      else {
        page.original2Image = page.page2Image
        page.page2Image = "https://s3.amazonaws.com/rainhut/404Error.png"
      }
      var pages = this.state.groupPages
      pages[index] = page
      this.setState({groupPages: pages})  
  }

  getCarouselImageItem = (source, isLeft, index) => {
    return(
    <TouchableOpacity style={{ flex: 1 }}
      onPress={isLeft?this.handleLeftImageTouched:this.handleRightImageTouched}
    >
      <View style={{ flex: 1 }}>
        <Image
          onLoad={()=>this.onImageLoad(index, isLeft)}
          onError={()=>this.onImageError(index, isLeft)}
          source={{ uri: source }}
          indicator={Progress.Pie}
          resizeMode="contain"
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: "rgba(150, 150, 150, 1)",
            unfilledColor: "rgba(200, 200, 200, 0.2)"
          }}
          style={style.image}
        />
      </View>
    </TouchableOpacity>)
  }

  _renderItem = ({ item, index }) => {
      return (
        <View
          style={{ flex: 1 }}
          shouldComponentUpdate="true"
        >
          <View style={style.imageContainer}>
            {this.getCarouselImageItem(item.page1Image, true, index)}
            {(item.page2Image == undefined)?(<View/>):(
              this.getCarouselImageItem(item.page2Image, false, index)
            )}
          </View>
          <View style={{ height: 30, flexDirection: "row" }}>
            <Text
              style={[
                style.text,
                (this.state.leftImageHighlighted && this.state.isLandscape ) ? style.textHightlighted : ""
              ]}
            >
              Page {item.pageIndex1}
            </Text>
            {(item.page2Image == undefined)?(<View/>):(
            <Text
              style={[
                style.text,
                this.state.leftImageHighlighted ? "" : style.textHightlighted
              ]}
            >
              Page {item.pageIndex2}
            </Text>)}
          </View>
        </View>
      );
  };

  didPickLayout = newLayout => {
    var copyBook = JSON.parse(JSON.stringify(global.book));
    var idx = global.currentBookIdx == undefined ? 0 : global.currentBookIdx;
    var page = copyBook.pages[idx];
    page.layout = newLayout;
    global.book = copyBook;

    RainhutUpdateBook(
      global.book,
      global.currentBookIdx,
      false,
      false,
      (json) => {
        this._updateBookComplete(json, this.state.leftImageHighlighted, 0);
      },
      err => {}
    );
  };

  didClickTheme = themeId => {
    const setupTheme1 = {
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 50,
      paddingBottom: 50,
      headerHeight: 50,
      footerHeight: 50,
      columnSpacing: 10,
      entrySpacing: 5,
      width: 1000,
      height: 800,
      isCommon: true,
      questionStyle: {
        textColor: "#ff2000",
        fontFamily: "Lato",
        size: 1,
        weight: "bold"
      },
      answerStyle: {
        textColor: "#ff2000",
        fontFamily: "Lato",
        size: 0.9,
        weight: ""
      },
      footerStyle: {
        textColor: "#5F6772",
        fontFamily: "LucidaSans",
        size: 1,
        weight: ""
      },
      dateStyle: {
        textColor: "#999999",
        fontFamily: "LucidaSans",
        size: 0.4,
        weight: ""
      },
      headerStyle: {
        textColor: "#5F6772",
        fontFamily: "LucidaSans",
        size: 1,
        weight: ""
      },
      headerPageStyle: {
        textColor: "#33495D",
        fontFamily: "LucidaSans",
        size: 2,
        weight: ""
      },
      fixForReturn: true,
      boldFirstAnswer: true,
      fitImagesRule: "few",
      fitTextRule: "many",
      imageClass: "imageBorderShadow1",
      cropImage: false,
      backgroundImage: "./../img/swish.svg",
      rotateAmount: 7,
      borderColor: "#e2e2e2",
      borderWidth: 4
    };

    const setupTheme2 = {
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 50,
      paddingBottom: 50,
      headerHeight: 50,
      footerHeight: 50,
      columnSpacing: 10,
      entrySpacing: 5,
      width: 1000,
      height: 800,
      isCommon: true,
      fixForReturn: true,
      questionStyle: {
        textColor: "#844896",
        fontFamily: "Roboto",
        size: 1,
        weight: "bold"
      },
      answerStyle: {
        textColor: "#5F6772",
        fontFamily: "Roboto",
        size: 0.8,
        weight: ""
      },
      footerStyle: {
        textColor: "#5F6772",
        fontFamily: "Roboto",
        size: 1,
        weight: ""
      },
      dateStyle: {
        textColor: "#999999",
        fontFamily: "Roboto",
        size: 0.4,
        weight: ""
      },
      headerStyle: {
        textColor: "#5F6772",
        fontFamily: "LucidaSans",
        size: 1,
        weight: ""
      },
      headerPageStyle: {
        textColor: "#33495D",
        fontFamily: "LucidaSans",
        size: 2,
        weight: ""
      },
      boldFirstAnswer: true,
      fitImagesRule: "few",
      fitTextRule: "many",
      imageClass: "",
      randomImageEffect: true,
      cropImage: true,
      backgroundImage: "",
      rotateAmount: 0,
      borderColor: "#e2e2e2",
      borderWidth: 4
    };

    var idx = 0
    this._carousel._snapToItem(this.state.groupPages[0])
    global.currentSnapIndex = idx;
    
    var copyBook = JSON.parse(JSON.stringify(global.book));
    if (themeId == 1) {
      copyBook.setup = setupTheme1;
    } else if (themeId == 2) {
      copyBook.setup = setupTheme2;
    }
    global.book = copyBook;
    this.updateBookFromGlobal()
  };

  updateBookFromGlobal = () => {
    RainhutUpdateBook(
      global.book,
      global.currentBookIdx,
      true,
      false,
      json => {
        this._updateBookComplete(
          json,
          this.state.leftImageHighlighted,
          0,
          true
        );
      },
      err => {
        console.err(err)
      });
  }

  _updateBookComplete = (json, isFirstIndex, currentOtherIndex, allPages) => {
    var idx2 = global.currentBookIdx;
    var idx = global.currentSnapIndex;
    if (this.state.groupPages[idx] == undefined) {
      console.log("shouldn not happen");
      this.setState({ isUpdateLayout: false });
      return;
    }
    if (allPages) {
      global.book = json;
    } else {
      global.book.pages[idx2] = json.pages[0];
      global.book.pages[idx2].currentOtherLayoutIndex = currentOtherIndex;
    }

    this.setGroupPages(global.book.pages);
    this.setCurrentOtherLayoutOptions();
    this.forceUpdate();
    this.setState({ isUpdateLayout: false });
  };
  
  gotoCheckout = () => {
    this.props.navigation.navigate("CheckoutSummary");
  }




  saveBook = () => {
    RainhutUploadBook(global.book, ()=> {
      console.log("uploaded...")
    })
    global.checkout = checkoutObjectInit()
    tacoDbHelper.insertCurrentBook(() => {
      this.gotoCheckout()
    })
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Container style={styles.container}>
          <Header />
          <Body style={styles.container}>
            <Text style={{marginTop: 20}}>Creating Book</Text>
            <ActivityIndicator style={{marginTop: 40}} size="large" />
          </Body>
        </Container>
      );
    }

    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Error creating book.</Text>
        </View>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => {
                  console.log(this.props);
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Book</Title>
            </Body>
            <Right>
              <Button
                transparent 
                onPress={() => {
                  this.saveBook();
                }}
              >
                <Icon name="checkmark-circle" />
                <Text></Text>
              </Button>
            </Right>
          </Header>
            <View
              style={
                this.state.isLandscape
                  ? [styles.container, styles.flexRow]
                  : [styles.container, styles.flex, {flexDirection: "column"}]
              }
            >
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.state.groupPages}
                  renderItem={this._renderItem.bind(this)}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  initialNumToRender={3}
                  maxToRenderPerBatch={4}
                  onSnapToItem={index => {
                    this.setState({ leftImageHighlighted: true });
                    this.setCurrentBookIndex(true);
                  }}
                />
              {this.state.editIndex == 0 && (
                <View
                  style={
                    this.state.isLandscape
                      ? style.iconsLandscape
                      : style.iconsPortrait
                  }
                >
                  <Button light
                    style={style.rightButton}
                    onPress={() => {
                      this.editPage();
                    }}
                  >
                    <Icon name="create" />
                  </Button>
                  <Button light
                     style={style.rightButton}
                    
                    onPress={this.editThemes}
                  >
                    <Icon name="color-palette" />
                  </Button>
                  <Button light style={style.rightButton} onPress={this.editLayouts}>
                    <Icon name="grid" />
                  </Button>
                </View>
              )}

              {this.state.editIndex == 1 && (
                <View
                  style={
                    this.state.isLandscape
                      ? style.iconsLandscape
                      : style.iconsPortrait
                  }
                >
                  <Button 
                    style={this.state.isLandscape?style.closeButtonL:style.closeButtonP}
                     transparent
                    onPress={() => {
                      this.closeEdit();
                    }}
                  >
               
                    <Icon name="close-circle" />
           
                  </Button>
                  <PickLayouts
                    isHorizontal={!this.state.isLandscape}
                    direction={this.state.isLandscape?"column":"row"}
                    items={this.state.currentOtherLayoutOptions}
                    didClickLayout={this.didPickLayout}
                  />
                </View>
              )}
              {this.state.editIndex == 2 && (
                <View
                  style={
                    this.state.isLandscape
                      ? style.iconsLandscape
                      : style.iconsPortrait
                  }
                >
                  <Button
                  style={this.state.isLandscape?style.closeButtonL:style.closeButtonP}
                    transparent
                    onPress={() => {
                      this.closeEdit();
                    }}
                  >
                
                    <Icon name="close-circle" />
                 
                  </Button>
                  <PickThemes
                     isHorizontal={!this.state.isLandscape}
                     direction={this.state.isLandscape?"column":"row"}
                    didClickTheme={this.didClickTheme}
                  />
                </View>
              )}
           
          </View>
        </Container>
      );
    }
  }
}

export default Home;
