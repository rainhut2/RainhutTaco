import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  CheckBox,
  Label,
  Icon,
  Button,
  H2,
  ListItem,
  Body,
  Text,
  View
} from "native-base";
import Address from "./address";
import CheckoutHeader from "./header";
import styles from "./../styles";
import Thumbnail from "../../theme/components/Thumbnail";
import RainhutTacoConfig from './../../RainhutTacoConfig'

export default class CheckoutShipping extends Component {
  state = {
    billingSame: false
  };

  componentDidMount() {

    if(global.checkout.shipping != undefined) {
      this.setState(global.checkout.shipping)
    }
    

  }

  doNonce = nonce => {
    console.log(nonce); 
    //send nonce to own api here!!!
    
    //redirect to success payment.
    this.props.navigation.navigate("CheckoutSuccess");
  };

  validateShipping = (isBilling) => {
    var types1 = ["street", "city", "state", "zip", "firstName", "lastName"]
    var shipType = "Shipping"
    if(isBilling) {
        shipType = "Billing"
    }

    var min = 2
    if(types1 == "zip") {
        min = 5
    }

    for(var i=0; i<types1.length; i++) {
      var type = types1[i] + shipType
      var strVal = this.state[type]
      if(strVal == undefined || strVal.length < min) {
        this.setState({
          [type + "Error"]: true
        });
      }
      else {
        this.setState({
          [type + "Error"]: false
        });
        this.setState({
          [type + "Success"]: true
        });
      }
  }

    for(var i=0; i<types1.length; i++) {
        var type = types1[i] + shipType
        var value = this.state[type + "Error"]
        if(value == undefined || value == true) {
            return false
        }
    }
    return true
  }

  goBack = () => {
    this.saveInfo()
    this.props.navigation.navigate('CheckoutSummary')
  }

  saveInfo = () => {
    global.checkout.shipping = Object.assign({}, this.state)
  }

  doPayment = () => { 


    var validShipping = this.validateShipping(false)
    var validBilling = this.validateShipping(true)
    this.forceUpdate()

    var validBilling2 = validBilling
    if(this.state.billingSame) {
      validBilling2 = true;
    }



    if(validShipping && validBilling2) {

      this.saveInfo();
    var BTClient = require("react-native-braintree-xplat");
    let braintreeToken = RainhutTacoConfig.braintreeToken
    BTClient.setup(braintreeToken);
    BTClient.showPaymentViewController({})
      .then(this.doNonce)
      .catch(function(err) {
        alert(err);
      });
    }
  };

  contactsPickerCallback = (p1, isBilling) => {
    if (p1 != undefined) {
      var address1 = null;
      if (p1.postalAddresses.length > 0) {
        address1 = p1.postalAddresses[0];
      }

      var type = "Shipping";
      if (isBilling) {
        type = "Billing";
      }

      this.setState({
        ["firstName" + type]: p1.givenName
      });

      this.setState({
        ["lastName" + type]: p1.familyName
      });
      
      if (address1 != null) {
        this.setState({
          ["street" + type]: address1.street,
          ["city" + type]: address1.city,
          ["state" + type]: address1.state,
          ["zip" + type]: address1.postCode
        });
      }
      
      this.forceUpdate(()=> {
        this.validateShipping(isBilling)
      })
    }
  };

  openContacts = isBilling => {
    this.props.navigation.navigate("ContactsPicker", {
      callback: this.contactsPickerCallback,
      isBilling: isBilling
    });
  };

  render() {
    return (
      <Container style={styles.container}>
        <CheckoutHeader
          navigation={this.props.navigation}
          backRoute="CheckoutSummary"
          backCallback={this.goBack}
          nextRoute="CheckoutBilling"
          nextCallback={this.doPayment}
        />
        <Content padder>
          <H2 style={styles.mb20}>Shipping Address</H2>
          <Button style={styles.mb20}
            block
            light
            onPress={() => {
              this.openContacts(false);
            }}
          >
            <Icon name="person" />
            <Text>Select from Contacts</Text>
          </Button>
          <Address parent={this} state={this.state} isShipping={true} />
          <ListItem>
            <CheckBox
              checked={this.state.billingSame}
              onPress={() => {
                this.setState({ billingSame: !this.state.billingSame });
              }}
            />
            <Body>
              <Text>Is Billing Same as Shipping?</Text>
            </Body>
          </ListItem>
          {this.state.billingSame ? (
            <Content />
          ) : (
            <Content style={{ marginTop: 40 }}>
              <H2 style={styles.mb20}>Billing Address</H2>
              <Button style={styles.mb20}
                block
                light
                onPress={() => {
                  this.openContacts(true);
                }}
              >
                <Icon name="person" />
                <Text>Select From Contacts</Text>
              </Button>
              <Address parent={this}  state={this.state} isShipping={false} />
            </Content>
          )}
          <Button onPress={() => this.doPayment()} block>
            <Text>Next</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
