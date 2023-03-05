import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Camera } from "expo-camera";
import {
  app,
  getFirestore,
  addDoc,
  collection,
  getStorage,
  ref,
  uploadString,
  serverTimestamp,
} from "../../firebase/config";
import styles from "./styles";

const tag = "[CAMERA]";

/**
 *
 * Todo: __savePhoto => send Photo to Firebase
 */

export default function App(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [startOver, setStartOver] = useState(true);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const userId = props.route.params.user.id;

  let camera;
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const __closeCamera = () => {
    setStartOver(true);
  };
  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync({
      base64: true,
      imageType: "jpg",
      quality: 0.7,
      scale: 0.5,
    });
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  const genRandStringFrom = (str) => {
    let result = " ";
    const charactersLength = str.length;
    for (let i = 0; i < charactersLength; i++) {
      result += str.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const __savePhoto = async () => {
    const storage = await getStorage();
    const storageURI = `${userId}/plants/${genRandStringFrom(userId)}.jpg`;
    const storageRef = await ref(storage, storageURI);
    var plantImg = await uploadString(storageRef, capturedImage.base64);

    console.log(docAdded);
    setPreviewVisible(false);
    setStartOver(true);
    setPhotoSaved(true);
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            /* props.navigation.navigate("Camera", {
              user: props.route.params.user,
            }); */
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>My Plants</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Camera", {
              user: props.route.params.user,
            });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>+ Add Plant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
