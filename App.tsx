import './gesture-handler'
import React, { useState } from 'react'
import { DatabaseProvider } from './src/services/db-context'
import { useColorScheme, StatusBar } from 'react-native'
import PotteryItemList from './src/components/PotteryItemsList'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import MyTabBar, { RootStackParamList, RootTabParamList } from './src/components/MyTabBar'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import GlazesList from './src/components/GlazesList'
import ClaysList from './src/components/ClaysList'
import { Ionicons } from '@expo/vector-icons'
import SettingsModal from './src/components/Settings'
import { createStackNavigator } from '@react-navigation/stack'
import PotteryItemView from './src/components/PotteryItemView'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import {
  useFonts,
  MontserratAlternates_400Regular,
  MontserratAlternates_700Bold,
} from '@expo-google-fonts/montserrat-alternates'
import { Aladin_400Regular } from '@expo-google-fonts/aladin'
import { AveriaLibre_400Regular, AveriaLibre_700Bold } from '@expo-google-fonts/averia-libre'

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#B7CBB5',
    primary: '#88A78C',
    card: '#CBB5C2',
    text: '#3C413C',
    border: '#727E78',
    notification: '#975F32',
  },
}
const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#2e2e2e',
    primary: '#778360',
    card: '#464745',
    text: '#E8EBE6',
    border: '#504A3D',
    notification: '#E85E00',
  },
}

const Tab = createBottomTabNavigator<RootTabParamList>()
const Stack = createStackNavigator<RootStackParamList>()

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const myTheme = isDarkMode ? MyDarkTheme : MyLightTheme
  let [fontsLoaded] = useFonts({
    title: Aladin_400Regular,
    heading: AveriaLibre_400Regular,
    headingBold: AveriaLibre_700Bold,
    text: MontserratAlternates_400Regular,
    textBold: MontserratAlternates_700Bold,
  })

  const TabNavigator = () => (
    <Tab.Navigator
      initialRouteName="PotteryItemsList"
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: myTheme.colors.background,
          borderBottomWidth: 2,
          borderBottomColor: myTheme.colors.border,
        },
        headerTintColor: myTheme.colors.text,
        headerTitleStyle: {
          color: myTheme.colors.text,
          fontFamily: 'title',
          fontSize: 28,
        },
        headerTitleAlign: 'center',
        headerRight: () => <SettingsModal isDarkMode={isDarkMode} setDarkMode={setIsDarkMode} />,
      }}
    >
      <Tab.Screen
        name="ClaysList"
        component={ClaysList}
        key="ClaysList"
        options={{
          title: 'My Clays',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PotteryItemsList"
        component={PotteryItemList}
        key="PotteryItemsList"
        options={{
          title: 'Pocket Pottery',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="cafe" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="GlazesList"
        component={GlazesList}
        key="GlazesList"
        options={{
          title: 'My Glazes',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="water" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
  return (
    <DatabaseProvider>
      <NavigationContainer theme={myTheme}>
        <StatusBar />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: myTheme.colors.background,
              borderWidth: 1,
              borderColor: myTheme.colors.border,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: myTheme.colors.text,
              fontFamily: 'title',
              fontSize: 28,
            },
            headerBackTitleStyle: {
              color: myTheme.colors.text,
            },
          }}
        >
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }} // Hide the stack header for tabs
          />
          <Stack.Screen
            name="PotteryItemView"
            component={PotteryItemView}
            initialParams={{ id: '123' }}
            options={{
              title: 'PotteryItemView', // Header title for this screen
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  )
}

export default App
