import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { User } from "../../src/models";
 import {Storage} from 'aws-amplify'

type videoListItemProps = {
  video: {
    id: string;
    createdAt: string;
    title: string;
    thumbnail: string;
    videoUrl?: string;
    duration: number;
    views: number;
    userID: string;
    user: {
      name: string;
      image?: string;
    };
  };
};

const VideoListItem = (props: videoListItemProps) => {
  const { video } = props;
  const [image, setImage] = useState<string | null>(null);
  const [user, setUser] = useState<User[]>([]);

  const videoId = video.userID;

  const navigation = useNavigation();

  useEffect(() => {
    //get user here from userID//

    const fetchUser = async () => {
      const response = await DataStore.query(User,(u)=>u.id('eq',videoId));
      // console.log(response);
      setUser(response[0])
 
    };
    fetchUser();
  }, [videoId]);


  useEffect(() => {
    if (video.thumbnail.startsWith("http")) {
      setImage(video.thumbnail);
    } else {
      Storage.get(video.thumbnail).then(setImage);
    }
  }, []);

  const minutes = Math.floor(video.duration / 60);
  const seconds = video.duration % 60;

  let viewsString = video.views.toString();
  if (video.views > 1_000_000) {
    viewsString = (video.views / 1_000_000).toFixed(1) + "m";
  } else if (video.views > 1_000) {
    viewsString = (video.views / 1_000).toFixed(1) + "k";
  }

  const openVideoPage = () => {
  
    navigation.navigate("VideoScreen", { id: video.id });
  };

  return (

    <Pressable style={styles.page} onPress={openVideoPage}>
      <View>
        <ImageBackground
          source={{
            uri:image,
          }}
          style={styles.thumbnail}
        >
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {minutes}:{seconds < 10 ? 0 : ""}
              {seconds}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.bottomContainer}>
        <View>
          <Image
            source={{
              uri: user?.image || "https://www.delhi-magazine.com/wp-content/uploads/2020/05/Penelope-Cruz-most-beautiful-hollywood-celebrity-in-2020-1-e1589313367307.jpg",
            }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.middleContainer}>
          <View>
            <Text style={{ color: "white", fontSize: 17, fontWeight: "400" }}>
              {video.title}
            </Text>
          </View>

          <View style={styles.subTitle}>
            <Text style={styles.subText}>
              {user?.name || 'Unknown User'} &#8226; {viewsString} &#8226;
              {video.createdAt}
            </Text>
          </View>
        </View>

        <View>
          <Entypo name="dots-three-vertical" size={16} color="white" />
        </View>
      </View>
    </Pressable>
    



    // <Pressable onPress={openVideoPage} style={styles.videoCard}>
    //   {/* Tumbnail */}
    //   <View>
    //     <Image style={styles.thumbnail} source={{ uri: image || "" }} />
    //     <View style={styles.timeContainer}>
    //       <Text style={styles.time}>
    //         {minutes}:{seconds < 10 ? "0" : ""}
    //         {seconds}
    //       </Text>
    //     </View>
    //   </View>

    //   {/* Title row */}
    //   <View style={styles.titleRow}>
    //     {/* Avatar */}
    //     <Image style={styles.avatar} source={{ uri:user?.image }} />

    //     {/* Middle container: Title, subtitle, etc. */}
    //     <View style={styles.midleContainer}>
    //       <Text style={styles.title}>{video.title}</Text>
    //       <Text style={styles.subtitle}>
    //         {user?.name || "UnKnown Souce"} {viewsString} {video.createdAt}
    //       </Text>
    //     </View>

    //     {/* Icon */}
    //     <Entypo name="dots-three-vertical" size={16} color="white" />
    //   </View>
    // </Pressable>
  );
};

export default VideoListItem;


const styles = StyleSheet.create({
  thumbnail: {
        width: "100%",
        aspectRatio: 16 / 9,
        marginBottom: 10,
      },
      timeContainer: {
        backgroundColor: "#00000099",
        height: 25,
        width: 50,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 5,
        bottom: 5,
      },
    
      time: {
        color: "white",
      },
    
      bottomContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
      },
      avatar: {
        height: 50,
        width: 50,
        borderRadius: 50,
      },
      middleContainer: {
        marginHorizontal: 10,
        flex: 1,
      },
    
      subTitle: {
        marginVertical: 2,
      },
      subText: {
        color: "gray",
        fontWeight: "400",
      },
      page: {
        marginBottom: 15,
      },
    });

    

  // videoCard: {
  //   marginVertical: 15
  // },
  // thumbnail: { 
  //   width: '100%', 
  //   aspectRatio: 16/9,
  // },
  // timeContainer: {
  //   backgroundColor: '#00000099',
  //   height: 25,
  //   width: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 4,
  //   position: 'absolute',
  //   right: 5,
  //   bottom: 5,
  // },
  // time: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
  // avatar: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  // },
  // titleRow: {
  //   flexDirection: 'row',
  //   padding: 10,
  // },
  // midleContainer: {
  //   marginHorizontal: 10,
  //   flex: 1,
  // },
  // title: {
  //   color: 'white',
  //   fontSize: 18,
  //   fontWeight: "500",
  //   marginBottom: 5,
  // },
  // subtitle: {
  //   color: 'grey',
  //   fontSize: 14,
  //   fontWeight: "500",
  // }
// });



//   const { video } = props;

//   const videoId = video.userID;

 

//   const [user, setUser] = useState<User[]>([]);
//   const [image,setImage]=useState<string | null>(null);

//   useEffect(() => {
//     //get user here from userID//

//     const fetchUser = async () => {
//       const response = await DataStore.query(User,(u)=>u.id('eq',videoId));
//       // console.log(response);
//       setUser(response[0])
 
//     };
//     fetchUser();
//   }, [video]);

 
// useEffect(() => {

// if(video.thumbnail.startsWith("http")){
//   setImage(video.thumbnail);
// }
// else{
//   Storage.get(video.thumbnail).then(setImage);

// }

// }, [video])



//   const navigation = useNavigation();

//   const minutes = Math.floor(video.duration / 60);
//   const seconds = video.duration % 60;

//   let viewString = video.views.toString();

//   if (video.views > 1_000_000) {
//     viewString = (video.views / 1_000_000).toFixed(1) + "m";
//   } else if (video.views > 1_000) {
//     viewString = (video.views / 1_000).toFixed(1) + "k";
//   }

//   const openVideoPage = () => {
//     navigation.navigate("VideoScreen",{
//       id:video.id
//     });
//   };

//   return (
//     <Pressable style={styles.page} onPress={openVideoPage}>
//       <View>
//         <ImageBackground
//           source={{
//             uri:image,
//           }}
//           style={styles.thumbnail}
//         >
//           <View style={styles.timeContainer}>
//             <Text style={styles.time}>
//               {minutes}:{seconds < 10 ? 0 : ""}
//               {seconds}
//             </Text>
//           </View>
//         </ImageBackground>
//       </View>

//       <View style={styles.bottomContainer}>
//         <View>
//           <Image
//             source={{
//               uri: user?.image,
//             }}
//             style={styles.avatar}
//           />
//         </View>

//         <View style={styles.middleContainer}>
//           <View>
//             <Text style={{ color: "white", fontSize: 17, fontWeight: "400" }}>
//               {video.title}
//             </Text>
//           </View>

//           <View style={styles.subTitle}>
//             <Text style={styles.subText}>
//               {user?.name || "Unknown Source"} &#8226; {viewString} &#8226;
//               {video.createdAt}
//             </Text>
//           </View>
//         </View>

//         <View>
//           <Entypo name="dots-three-vertical" size={16} color="white" />
//         </View>
//       </View>
//     </Pressable>
//   );
// };

// export default VideoListItem;

// const styles = StyleSheet.create({
//   thumbnail: {
//     width: "100%",
//     aspectRatio: 16 / 9,
//     marginBottom: 10,
//   },
//   timeContainer: {
//     backgroundColor: "#00000099",
//     height: 25,
//     width: 50,
//     borderRadius: 4,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "absolute",
//     right: 5,
//     bottom: 5,
//   },

//   time: {
//     color: "white",
//   },

//   bottomContainer: {
//     flexDirection: "row",
//     marginHorizontal: 10,
//   },
//   avatar: {
//     height: 50,
//     width: 50,
//     borderRadius: 50,
//   },
//   middleContainer: {
//     marginHorizontal: 10,
//     flex: 1,
//   },

//   subTitle: {
//     marginVertical: 2,
//   },
//   subText: {
//     color: "gray",
//     fontWeight: "400",
//   },
//   page: {
//     marginBottom: 15,
//   },
// });
