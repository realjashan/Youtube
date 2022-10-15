import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { AntDesign, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Comment } from "../../src/models";

interface VideoCommentProps {
  comment: Comment;
}

const VideoComment = ({ comment, type }: VideoCommentProps) => {
  return (
    <View
      style={{
        marginTop: 10,
        alignItems: "flex-start",
        marginHorizontal: 5,
        borderColor: "#3d3d3d",
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={{
              uri:comment.User?.image || 'https://www.unsw.edu.au/content/unsw-sites/au/en/business/our-schools/banking-finance/our-people/phd-students/_jcr_content/root/responsivegrid-layout-fixed-width/responsivegrid-full-bottom/column_layout_copy_1/par_2_1_50/column_layout_copy_1/par_2_1_50/image.coreimg.82.1170.jpeg/1637125245090/2021-07-blank-avatar.jpeg',
            }}
            style={styles.commentavatar}
          />
        </View>

        <View style={{ marginHorizontal: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "grey", fontSize: 12 }}>
              {comment.User?.name} 
            </Text>
            <Text style={{ color: "grey", fontSize: 12 }}>
              &#8226;{comment.createdAt}
            </Text>
          </View>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              marginRight: 20,
              marginBottom: 5,
            }}
          >
            {comment.comment}
          </Text>
          {type === "likes" && (
            <View style={{ flexDirection: "row" }}>
              <View style={styles.actionListItem}>
                <AntDesign name="like2" size={20} color="lightgrey" />
                <Text style={styles.likes}>{comment.likes}</Text>
              </View>

              <View style={styles.actionListItem}>
                <SimpleLineIcons name="dislike" size={20} color="lightgrey" />
                <Text style={styles.likes}>{comment.dislikes}</Text>
              </View>

              <View style={styles.actionListItem}>
                <MaterialIcons
                  name="insert-comment"
                  size={20}
                  color="lightgrey"
                />
              </View>
            </View>
          )}
        </View>
      </View>
      {/* icons container */}
    </View>
  );
};

export default VideoComment;

const styles = StyleSheet.create({
  commentavatar: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  actionListItem: {
    width: 50,
    height: 45,
    marginVertical: 7,
  },
  likes: {
    color: "white",
    fontSize: 12,
  },
});
