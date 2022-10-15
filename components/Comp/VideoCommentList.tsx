import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
// import comments from '../../assets/data/comments.json'
import VideoComment from "./VideoComment";
import { TextInput } from "react-native-gesture-handler";
import { Auth, DataStore } from "aws-amplify";
import { Feather } from "@expo/vector-icons";
import { Comment, User } from "../../src/models";

interface VideoCommentProps{
  comments:Comment[],
  videoID:string,
}


const VideoCommentList = ({ comments,videoID }:VideoCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const sendComment = async () => {

const userInfo=await Auth.currentAuthenticatedUser();

const userSub=userInfo.attributes?.sub;

const user= (await DataStore.query(User)).find(u=>u.sub===userSub)
 
if(!user){
  console.warn("User Not Found")
}
    await DataStore.save(
      new Comment({
        comment: newComment,
        likes: 120,
        dislikes: 110,
        replies: 20,
        videoID,
        commentUserId:user?.id,
      })
    );
    setNewComment('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#141414" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable onPress={sendComment}>
            <TextInput
              placeholder="Add a comment.."
              value={newComment}
              onChangeText={setNewComment}
              placeholderTextColor="gray"
              style={{
                backgroundColor: "#010101",
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
                color:'white',
              }}
            />
          </Pressable>
        </View>

        <View style={{marginLeft:10}}>
          <Pressable onPress={sendComment}>
            <Feather name="send" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <BottomSheetFlatList
        data={comments}
        renderItem={({ item }) => <VideoComment comment={item} type="likes" />}
      />
    </View>
  );
};

export default VideoCommentList;

const styles = StyleSheet.create({});
