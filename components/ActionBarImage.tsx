// 3 Ways to Add Image Icon Inside Navigation Bar in React Native
// https://aboutreact.com/react-native-image-icon-inside-navigation-bar/

import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";

import { View, Image,SafeAreaView } from "react-native";

const ActionBarImage = () => {
  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
   alignItems:'center',
      }}
    >
<View style={{justifyContent:'space-between',}}>

      <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: 120,
          height: 25,

          marginHorizontal: 5,
          marginVertical:15,
          resizeMode: "contain",
          
        }}
      />

</View>

      <View
        style={{
          flexDirection: "row",
          width: 200,
          justifyContent: "space-between",
        }}
      >
        <Feather name="cast" size={24} color="white" />
        <AntDesign name="bells" size={24} color="white" />
        <AntDesign name="search1" size={24} color="white" />
        <FontAwesome name="user-circle-o" size={24} color="white" />
      </View>
    </SafeAreaView>
  );
};

export default ActionBarImage;
