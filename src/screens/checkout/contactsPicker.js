import Contacts from "react-native-contacts";
import Geocoder from 'react-native-geocoder';
import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  List,
  Title,
  Item,
  ListItem,
  Thumbnail,
  Text,
  Input,
  Left,
  Body,
  Right,
  Button,
  Icon
} from "native-base";
import styles from "./../styles";
//import Geocoder from 'react-native-geocoder';

import { PermissionsAndroid, Platform } from 'react-native';



export default class ContactsPicker extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    contacts: [],
    searchText: ""
  };

  checkContactsIOS = () => {
    Contacts.checkPermission((err, permission) => {
      if (err) throw err;
    
     
      if (permission === 'undefined') {
        Contacts.requestPermission((err, permission) => {
          
        })
      }
      if (permission === 'authorized') {
        // yay!
      }
      if (permission === 'denied') {
        // x.x
      }
    })
  }

  getGeoCodeAddress = async(addressString) => {
    try {
      let res = await Geocoder.geocodeAddress(addressString);
      return res
  }
  catch(err) {
      console.log(err);
      return null
  }
  }
  
  checkContactsAndroid = async() => {

    const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
    if(check === PermissionsAndroid.RESULTS.GRANTED) {
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Can you grant access to contacts',
            'message': 'Contacts are used to help fill out your checkout quickly.'
          }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("yah contacts")
        } else {
          console.log("boo")
        }
      } catch (err) {
        console.warn(err)
      }
    }
    
  }

  checkContacts = () =>  {
    if(Platform.OS === 'ios') {
     // this.checkContactsIOS()
    }
    else {
      this.checkContactsAndroid()
    }
  }

  fixupContacts = async(contacts) => {
    //Geocoder.fallbackToGoogle(MY_KEY);

    if(Platform.OS != 'ios') {
      for(var i=0; i<contacts.length; i++) {
        var contact = contacts[i];
        let addressobj = await this.getGeoCodeAddress(contact.postalAddresses[0].street)
        if(addressobj != null ) {
          if(addressobj.number != null && addressobj.streetname != null) {
            contact.street = addressobj.number + " " + addressobj.streetname
          }
          contact.country = addressobj.countryCode
          contact.postalCode = addressobj.postalCode
          contact.state = addressobj.adminArea
          contact.city = addressobj.locality
        }
        else {

        }
        
      }
    }
  }

  loadContacts = () => {
this.checkContacts()
  

    if (this.state.searchText == "") {
      Contacts.getAll((err, contacts) => {
        if (err) throw err;
        this.fixupContacts(contacts)
        this.setState({
          contacts: contacts
        });
        this.forceUpdate()
      });
    } else {
      Contacts.getContactsMatchingString(
        this.state.searchText,
        (err, contacts) => {
          if (err) throw err;
          this.fixupContacts(contacts)
          this.setState({
            contacts: contacts
          });
          this.forceUpdate()
        }
      );
    }
  };

  componentDidMount() {
    this.loadContacts();
  }

  selectPressed = index => {
    this.props.navigation.state.params.callback(this.state.contacts[index], this.props.navigation.state.params.isBilling);
    this.props.navigation.navigate('CheckoutShipping')
  };
  
  backButtonPressed = () => {
    this.props.navigation.goBack();
  };
  

  render() {
    if (this.state == null) {
      return <Container style={styles.container} />;
    }
    return (
      <Container style={styles.container}>
        <Header searchBar rounded>
        <Button
            transparent
            onPress={() => {
              this.backButtonPressed();
            }}
          >
            <Icon name="arrow-back" />
          </Button>
          <Item>
            <Icon name="ios-search" />
            <Input
              onChangeText={searchText => this.setState({ searchText })}
              placeholder="Search"
            />
            <Icon name="ios-people" />
            <Button transparent onPress={()=>this.loadContacts()}>
            <Text>Search</Text>
          </Button>
          </Item>
        
        </Header>

        <Content>
          <List 
            dataArray={this.state.contacts}
            renderRow={(item, i1, index2) => (
              <ListItem thumbnail>
                <Left>
               {item.hasThumbnail ? (
                    <Thumbnail square source={{ uri: item.thumbnailPath }} />
                  ) : (<Icon name='person'/>)}
                  </Left>
                <Body>
                  <Text>
                    {item.familyName}, {item.givenName}
                  </Text>
                {(item.postalAddresses.length > 0)?(<Text>
                    {item.postalAddresses[0].street}, {item.postalAddresses[0].city}, {item.postalAddresses[0].state}
                </Text>):(<Text/>)}
                </Body>
                <Right>
                  <Button
                    transparent
                    onPress={() => this.selectPressed(index2)}
                  >
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
