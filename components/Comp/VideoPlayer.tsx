import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { Video } from "expo-av";

type videoPlayerProps = {
  videoURI: string;
  thumbnailURI?: string;
};

const VideoPlayer = (props: videoPlayerProps) => {
  const { videoURI, thumbnailURI } = props;

  // const videoRef=useRef<Video>()

  return (
    <View>
      <Video
        source={{ uri: videoURI }}
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        posterSource={{uri:thumbnailURI}}
        usePoster={false}
        posterStyle={{resizeMode:'cover'}}
        useNativeControls
        resizeMode="contain"
     
      />
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({});
