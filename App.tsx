import React from 'react';
import { DatabaseProvider } from './src/services/db-context';
import { useColorScheme, StatusBar } from 'react-native';
import PotteryItemList from './src/components/PotteryItemsList';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import MyTabBar, { RootTabParamList } from './src/components/MyTabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const MyLightTheme = {
	...DefaultTheme,
	colors: {
	  ...DefaultTheme.colors,
	  background: '#E8EBE6',
	  primary: '#778360',
	  card: '#C9CBC6',
	  text: '#302B2F',
	  border: '#D6D1C3',
	  notifican: '#A6B39B',
	  warning: '#E85E00'
	},
  };
 const MyDarkTheme = {
	...DarkTheme,
	colors: {
	  ...DarkTheme.colors,
	  background: '#E8EbE6',
	  primary: '#778360',
	  card: '#464745',
	  text: '#E8EBE6',
	  border: '#504A3D',
	  notifican: '#4F5547',
	  warning: '#E85E00'
	},
  };
  

  const Tab = createBottomTabNavigator<RootTabParamList>();

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';
	const myTheme = isDarkMode ? MyDarkTheme : MyLightTheme
	return (
			<DatabaseProvider>
				<NavigationContainer theme={myTheme}>
					<StatusBar/>
					<Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
						<Tab.Screen name="PotteryItemsList" component={PotteryItemList} 
							options={{
								headerShown: false,
							}}
						/>
					</Tab.Navigator>
				</NavigationContainer>
			</DatabaseProvider>
  );
};

export default App;
