import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { io } from "socket.io-client";

import HomeScreen from "./screens/HomeScreen";
import Notifications from "./components/Notifications";

const socket = io("http://localhost:5000"); // Update with deployed backend URL
const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    socket.on("notification", (message) => {
      alert(message); // Replace with a better notification system (e.g., toast)
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <NavigationContainer>
      <Notifications />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
