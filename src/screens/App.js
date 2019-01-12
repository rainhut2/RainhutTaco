import React from "react";
import { Root } from "native-base";
import { StackNavigator, createDrawerNavigator } from "react-navigation";
import Home from "./home/index";
import Orders from "./Orders";
import Saved from "./Saved";
import Settings from "./Settings";
import SideBar from "./sidebar";
import EditPage from "./home/editPage";
import EditEntry from "./home/editEntry";

import CheckoutSummary from "./checkout/summary";
import CheckoutBilling from "./checkout/payment";
import CheckoutSuccess from "./checkout/success";
import CheckoutShipping from "./checkout/shipping";
import ContactsPicker from "./checkout/contactsPicker";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    Orders: { screen: Orders },
    Settings: { screen: Settings },
   Saved: {screen: Saved}
    
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = StackNavigator(
  {   
    Drawer: { screen: Drawer },
    EditPage: { screen: EditPage },
    EditEntry: { screen: EditEntry },
    CheckoutSummary: { screen: CheckoutSummary },
    CheckoutShipping: { screen: CheckoutShipping },
    CheckoutBilling: { screen: CheckoutBilling },
    CheckoutSuccess: { screen: CheckoutSuccess },
    ContactsPicker: { screen: ContactsPicker }
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);



export default () => (
  <Root>
     <AppNavigator />
  </Root>
);


/* + (BOOL)requiresMainQueueSetup {
  return YES; braintree.m ios file
}*/