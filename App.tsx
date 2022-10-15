import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import React, { useState, useEffect } from "react";

import VideoScreenWithRecommendation from "./screens/VideoScreen";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "./navigation";
import { Amplify, Auth, DataStore } from "aws-amplify";
import config from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import { User } from "./src/models";

Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const saveUserToDB = async () => {
      // get user  from cognito
      const userInfo = await Auth.currentAuthenticatedUser();

      if (!userInfo) {
        return;
      }
      const userId = userInfo.attributes.sub;

      // check if user exists in DB
      const user = (await DataStore.query(User)).find(
        (user) => user.sub === userId
      );
      if (!user) {
        // if not, save user to db.
        await DataStore.save(
          new User({
            sub: userId,
            name: userInfo.attributes.email,
            subscribers: 0,
          })
        );
      } else {
        console.warn("User already exists in DB");
      }
    };

    saveUserToDB();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Navigation colorScheme={"dark"} />

          <StatusBar />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
}

export default withAuthenticator(App);
