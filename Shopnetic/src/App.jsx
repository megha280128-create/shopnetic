import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CartProvider } from './CartContext.jsx';

// Screens
import HomeScreen from './Screen/HomeScreen.jsx';
import SearchScreen from './Screen/SearchScreen.jsx';
import CartScreen from './Screen/CartScreen.jsx';
import UserScreen from './Screen/UserScreen.jsx';
import ProductDetails from './Screen/ProductDetails.jsx';
import LoginScreen from './Screen/LoginScreen.jsx';
import SignupScreen from './Screen/SignupScreen.jsx';

// Navigator instances
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Notification Screen
const NotificationScreen = () => (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Notifications</Text>
  </SafeAreaView>
);

// Bottom Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Cart') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'User') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e91e63',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="User" component={UserScreen} />
  </Tab.Navigator>
);

// Stack Navigator
const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Notifications" component={NotificationScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Drawer Navigator (Main App Navigation)
const App = () => (
  <CartProvider>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Shopnetic">
        <Drawer.Screen name="Shopnetic" component={MainStack} />
        <Drawer.Screen name="Profile" component={UserScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Signup" component={SignupScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  </CartProvider>
);

export default App;
