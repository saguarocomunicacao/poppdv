import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import { Root } from "native-base";
import { NetworkProvider, NetworkConsumer  } from 'react-native-offline';

import metrics from './config/metrics'
import Drawer from "./Drawer";
import Offline from './screens/Util/offline.js'

Drawer.navigationOptions = ({ navigation }) => ({
	swipeEnabled: false,
	gesturesEnabled: false,
	drawerLockMode: 'locked-closed',
	drawerWidth: 0,
	header: null
});

const AppNavigator = StackNavigator(
	{
		Drawer: { screen: ({ navigation }) => <Drawer screenProps={{ rootNavigation: navigation, swipeEnabled: false }} /> }

	},
	{
		index: 0,
		initialRouteName: "Drawer",
		swipeEnabled: false,
		gesturesEnabled: false,
		drawerLockMode: 'locked-closed',
		drawerWidth: 0,
		headerMode: "none",
	}
);

export default class App extends Component {

	render() {
		return (
			<Root>
				{(() => {
					if (metrics.metrics.SOH_ONLINE === 'NAO') {
						return (
							<AppNavigator />
						)
					} else {
						return (
							<NetworkProvider>
								<NetworkConsumer>
								{({ isConnected }) => (
									isConnected ? (
										<AppNavigator />
									) : (
										<Offline/>
									)
								)}
								</NetworkConsumer>
							</NetworkProvider>
						)
					}
				})()}
			</Root>
		)
	}
}
