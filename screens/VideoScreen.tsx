import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import video from "../assets/data/video.json";
import { AntDesign, MaterialIcons, Octicons } from "@expo/vector-icons";
import VideoListItem from "../components/Comp/VideoListItem";
import videos from "../assets/data/videos.json";
import VideoPlayer from "../components/Comp/VideoPlayer";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import VideoComment from "../components/Comp/VideoComment";
import VideoCommentList from "../components/Comp/VideoCommentList";
// import comments from "../assets/data/comments.json";
import { Comment, User, Video } from "../src/models";
import { DataStore, Storage } from "aws-amplify";
import { useRoute } from "@react-navigation/native";

const VideoScreen = () => {

  const [video, setVideo] = useState<Video | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
   const [user, setUser] = useState([]);
     const [playlist, setPlaylist] = useState(false);

  const addToPlaylist = () => {
    setPlaylist(!playlist);
  };


  const [comments, setComments] = useState<Comment[]>([]);
  const route = useRoute();
  const videoId = route.params?.id;

  useEffect(() => {
    DataStore.query(Video, videoId).then(setVideo);
  }, [videoId]);

  useEffect(() => {
    if (!video) {
      return;
    }

    if (video?.videoUrl.startsWith("http")) {
      setVideoUrl(video.videoUrl);
    } else {
      Storage.get(video.videoUrl).then(setVideoUrl);
    }

    if (video.thumbnail.startsWith("http")) {
      setImage(video.thumbnail);
    } else {
      Storage.get(video.thumbnail).then(setImage);
    }
  }, [video]);

  useEffect(() => {
    //get user here from userID//

    const fetchUser = async () => {
      const userData = await DataStore.query(User, (u) =>
        u.id("eq", video.userID)
      );
      // console.log(response);
      setUser(userData[0]);
    
    };
    fetchUser();
  }, [video]);



  useEffect(() => {
    const fetchComments = async () => {
      if (!video) {
        return;
      }

      const videoComments = (await DataStore.query(Comment)).filter(
        (comment) => comment.videoID === video.id
      );

      setComments(videoComments);
    };

    fetchComments();
  }, [video]);

  const commentsSheetRef = useRef<BottomSheetModal>(null);

  const openComments = () => {
    commentsSheetRef.current?.present();
  };

  if (!video) {
    return <ActivityIndicator />;
  }
  console.log(video);
  let viewsString = video.views.toString();
  if (video.views > 1_000_000) {
    viewsString = (video.views / 1_000_000).toFixed(1) + "m";
  } else if (video.views > 1_000) {
    viewsString = (video.views / 1_000).toFixed(1) + "k";
  }


 
  let subscriberString = user?.subscribers;

 

  if (user?.subscribers > 1_000_000) {
    subscriberString = (user.subscribers / 1_000_000).toFixed(1) + "M";
  } else if (user?.subscribers > 1_000) {
    subscriberString = (user?.subscribers / 1_000).toFixed(1) + "k";
  }





  return (
    <View style={{ backgroundColor: "#141414", flex: 1 }}>
      {/* Video Player */}
      <VideoPlayer videoURI={videoUrl} thumbnailURI={video.thumbnail} />

      <View style={{ flex: 1 }}>
        {/* Video Info */}
        <View style={styles.videoInfoContainer}>
          <Text style={styles.tags}>{video.tags}</Text>
          <Text style={styles.title}>{video.title}</Text>
          <Text style={styles.subtitle}>
            {user?.name} {viewsString} {video.createdAt}
          </Text>
        </View>

        {/* Action List */}
        <View style={styles.actionListContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.actionListItem}>
              <AntDesign name="like1" size={30} color="lightgrey" />
              <Text style={styles.actionText}>{video.likes}</Text>
            </View>

            <View style={styles.actionListItem}>
              <AntDesign name="dislike2" size={30} color="lightgrey" />
              <Text style={styles.actionText}>{video.dislikes}</Text>
            </View>

            <View style={styles.actionListItem}>
              <AntDesign name="export" size={30} color="lightgrey" />
              <Text style={styles.actionText}>{video.dislikes}</Text>
            </View>

            <View style={styles.actionListItem}>
              <AntDesign name="download" size={30} color="lightgrey" />
              <Text style={styles.actionText}>{video.dislikes}</Text>
            </View>

                       <Pressable style={styles.actionListItem} onPress={addToPlaylist}>
              <MaterialIcons
                name={!playlist ? "playlist-add" : "playlist-add-check"}
                size={30}
                color="lightgrey"
              />
              <Text style={styles.likes}>
                {!playlist ? "Playlist" : "Saved"}
              </Text>
            </Pressable>

            <View style={styles.actionListItem}>
              <Octicons name="stop" size={30} color="lightgrey" />
              <Text style={styles.likes}>Stop Ads</Text>
            </View>
            
          </ScrollView>
        </View>

        {/* User Info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderColor: "#3d3d3d",
            borderTopWidth: 1,
            borderBottomWidth: 1,
          }}
        >
          <Image style={styles.avatar} source={{ uri:user?.image }} />

          <View style={{ marginHorizontal: 10, flex: 1 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {user?.name}
            </Text>
            <Text style={{ color: "grey", fontSize: 18 }}>
               {subscriberString} subscribers
            </Text>
          </View>

          <Text
            style={{
              color: "red",
              fontSize: 18,
              fontWeight: "bold",
              padding: 10,
            }}
          >
            Subscribe
          </Text>
        </View>

        {/* Commnets */}
        <Pressable
          onPress={openComments}
          style={{ padding: 10, marginVertical: 10 }}
        >
          <Text style={{ color: "white" }}>Comments 333</Text>
          {comments.length > 0 && <VideoComment comment={comments[0]} />}
        </Pressable>

        {/* All comments */}
        <BottomSheetModal
          ref={commentsSheetRef}
          snapPoints={["70%"]}
          index={0}
          backgroundComponent={({ style }) => (
            <View style={[style, { backgroundColor: "#4d4d4d" }]} />
          )}
        >
          <VideoCommentList comments={comments} videoID={video.id} />
        </BottomSheetModal>
      </View>
    </View>
  );
};

const VideoScreenWithRecommendation = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#141414", flex: 1 }}>
      <BottomSheetModalProvider>
        <FlatList
          data={videos}
          renderItem={({ item }) => <VideoListItem video={item} />}
          ListHeaderComponent={VideoScreen}
        />
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default VideoScreenWithRecommendation;

const styles = StyleSheet.create({
  videoPlayer: {
    width: '100%',
    aspectRatio: 16/9,
  },
  videoInfoContainer: {
    margin: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 10,
  },
  tags: {
    color: '#0094e3',
    fontSize: 14,
    fontWeight: "500",
  },
  subtitle: {
    color: 'grey',
    fontSize: 14,
    fontWeight: "500",
  },

  // action list
  actionListContainer: {
    marginVertical: 10,
  },
  actionListItem: {
    width: 70,
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
  },

  // user
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
    likes: {
    color: "white",
    fontSize: 12,
  },
});


















//   const [video, setVideo] = useState([]);
//   const [user, setUser] = useState([]);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [videoUrl,setVideoUrl]=useState<string | null>(null);
//   const [image,setImage]=useState<string | null>(null);



//   const commentSheetRef = useRef<BottomSheetModal>(null);
//   const route = useRoute();

//   const videoId = route.params?.id;



  





//   //to fetch data about video//

//   const fetchData = async () => {
//     const response = await DataStore.query(Video, videoId);
//     setVideo(response);

   
  
//   };

//   useEffect(() => {
//     fetchData();
//   }, [videoId]);

//   // useEffect(() => {
//   //   DataStore.query(Video, videoId).then(setVideo);

//   //   console.log(video);
//   // }, [video,videoId]);







//   useEffect(() => {
//     //get user here from userID//

//     const fetchUser = async () => {
//       const userData = await DataStore.query(User, (u) =>
//         u.id("eq", video.userID)
//       );
//       // console.log(response);
//       setUser(userData[0]);
    
//     };
//     fetchUser();
//   }, [video]);

//   useEffect(() => {



//     const fetchComments = async () => {

//       if(!video){
//         return(
//           <ActivityIndicator size={'large'} color='gray' style={{alignItems:'center'}}/>
//         )
//       }

//       const dataComments = await DataStore.query(Comment, (c) =>
//         c.videoID("eq", video.id)
//       )

//       setComments(dataComments)
       

     
//     };

//     fetchComments();
//   }, [video]);

//   const openComments = () => {
//     commentSheetRef.current?.present();
//   };

//   if (!video) {
//     return <ActivityIndicator size={"large"} color="gray" />;
//   }

//   let viewString = video?.views;
//   let subscriberString = user?.subscribers;

//   if (video?.views > 1_000_000) {
//     viewString = (video.views / 1_000_000).toFixed(1) + "M";
//   } else if (video.views > 1_000) {
//     viewString = (video.views / 1_000).toFixed(1) + "k";
//   }

//   if (user?.subscribers > 1_000_000) {
//     subscriberString = (user.subscribers / 1_000_000).toFixed(1) + "M";
//   } else if (user?.subscribers > 1_000) {
//     subscriberString = (user?.subscribers / 1_000).toFixed(1) + "k";
//   }

//   const [playlist, setPlaylist] = useState(false);

//   const addToPlaylist = () => {
//     setPlaylist(!playlist);
//   };
 

//   // useEffect(() => {
//   //   if (!video) {
//   //     return;
//   //   }


//   //   if (video?.videoUrl.startsWith("https")) {
//   //     setVideoUrl(video.videoUrl);
//   //   } else {
//   //     Storage.get(video.videoUrl).then(setVideoUrl);
//   //   }

//   //   if (video.thumbnail.startsWith("http")) {
//   //     setImage(video.thumbnail);
//   //   } else {
//   //     Storage.get(video.thumbnail).then(setImage);
//   //   }
//   // }, [video]);
 

 
//   return (
//     <View style={{ backgroundColor: "#141414", flex: 1 }}>
//       <VideoPlayer videoURI={video.videoUrl} thumbnailURI={video.thumbnail} />

//       {/* <Image
//         style={styles.videoPlayer}
//         source={{
//           uri: video.thumbnail,
//         }}
//       /> */}

//       <View style={{ flex: 1 }}>
//         <View style={styles.videoInfoContainer}>
//           <View>
//             <Text style={styles.tags}>{video?.tags || '#Featured #Explore'}</Text>

//             <Text style={styles.title}>{video.title}</Text>
//           </View>

//           <View style={styles.subTitle}>
//             <Text style={styles.subText}>
//               {viewString} &#8226;Streamed {video.createdAt}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.actionListContainer}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View style={styles.actionListItem}>
//               <AntDesign name="like1" size={20} color="lightgrey" />
//               <Text style={styles.likes}>{video.likes}</Text>
//             </View>

//             <View style={styles.actionListItem}>
//               <AntDesign name="dislike2" size={20} color="lightgrey" />
//               <Text style={styles.likes}>{video.dislikes}</Text>
//             </View>

//             <View style={styles.actionListItem}>
//               <AntDesign name="export" size={20} color="lightgrey" />
//               <Text style={styles.likes}>{video.likes}</Text>
//             </View>

//             <View style={styles.actionListItem}>
//               <AntDesign name="download" size={20} color="lightgrey" />
//               <Text style={styles.likes}>{video.likes}</Text>
//             </View>

//             <Pressable style={styles.actionListItem} onPress={addToPlaylist}>
//               <MaterialIcons
//                 name={!playlist ? "playlist-add" : "playlist-add-check"}
//                 size={20}
//                 color="lightgrey"
//               />
//               <Text style={styles.likes}>
//                 {!playlist ? "Playlist" : "Saved"}
//               </Text>
//             </Pressable>

//             <View style={styles.actionListItem}>
//               <Octicons name="stop" size={20} color="lightgrey" />
//               <Text style={styles.likes}>Stop Ads</Text>
//             </View>
//           </ScrollView>
//         </View>

//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             borderColor: "#3d3d3d",
//             borderTopWidth: 1,
//             borderBottomWidth: 1,
//             padding: 10,
//           }}
//         >
//           <View>
//             <Image
//               source={{
//                 uri: user?.image,
//               }}
//               style={styles.avatar}
//             />
//           </View>

//           <View style={{ flex: 1, marginHorizontal: 10 }}>
//             <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
//               {user?.name}
//             </Text>
//             <Text style={{ color: "lightgrey", fontSize: 15 }}>
//               {subscriberString} subscribers
//             </Text>
//           </View>

//           <View style={{ alignItems: "center", justifyContent: "center" }}>
//             <Text
//               style={{
//                 color: "red",
//                 fontSize: 15,
//                 fontWeight: "bold",
//                 letterSpacing: 0.5,
//               }}
//             >
//               SUBSCRIBE
//             </Text>
//           </View>
//         </View>

//         {/* comments section */}

//         <Pressable onPress={openComments} style={{ padding: 10 }}>
//           <Text
//             style={{ color: "white", fontWeight: "bold", marginBottom: 15 }}
//           >
//             Comments 1k
//           </Text>

//           {comments.length > 0 && <VideoComment comment={comments[0]} />}
//         </Pressable>

//         <BottomSheetModal
//           ref={commentSheetRef}
//           snapPoints={["70%"]}
//           index={0}
//           backgroundComponent={({ style }) => (
//             <View style={[style, { backgroundColor: "#4d4d4d" }]} />
//           )}
//         >
//           <VideoCommentList comments={comments} videoID={video?.id} />
//         </BottomSheetModal>
//       </View>
//     </View>
//   );
// };

// const VideoScreenWithRecommendation = () => {
//   return (
//     <SafeAreaView style={{ backgroundColor: "#141414", flex: 1 }}>
//       <BottomSheetModalProvider>
//         <FlatList
//           data={videos}
//           renderItem={({ item }) => <VideoListItem video={item} />}
//           ListHeaderComponent={VideoScreen}
//         />
//       </BottomSheetModalProvider>
//     </SafeAreaView>
//   );
// };

// export default VideoScreenWithRecommendation;

// const styles = StyleSheet.create({
//   videoPlayer: {
//     width: "100%",
//     aspectRatio: 16 / 9,
//   },
//   videoInfoContainer: {
//     margin: 10,
//   },

//   subTitle: {
//     marginVertical: 2,
//   },
//   subText: {
//     color: "gray",
//     fontWeight: "400",
//   },
//   tags: {
//     color: "#0094e3",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   title: {
//     color: "white",
//     fontSize: 17,
//     fontWeight: "400",
//     marginVertical: 10,
//   },
//   actionListItem: {
//     width: 65,
//     height: 45,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionListContainer: {
//     marginVertical: 10,
//   },
//   likes: {
//     color: "white",
//     fontSize: 12,
//   },
//   avatar: {
//     height: 50,
//     width: 50,
//     borderRadius: 50,
//   },

//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: "grey",
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: "center",
//   },
// });
