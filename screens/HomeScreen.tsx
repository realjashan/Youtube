import { StyleSheet, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import VideoListItem from "../components/Comp/VideoListItem";
 
import { DataStore } from "aws-amplify";
import { Video } from "../src/models";

const HomeScreen = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      const data = await DataStore.query(Video);

      setVideos(data);
    };

    fetchVideo();
  }, [videos]);

  return (
    <View>
      <FlatList
        data={videos}
        renderItem={({ item }) => <VideoListItem video={item} />}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
