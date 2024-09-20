import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import AuthScreen from './screens/AuthScreen'; // Écran d'authentification 
import MapScreen from './screens/MapScreen'; 

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
