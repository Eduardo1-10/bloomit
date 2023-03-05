import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
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
  uploadBytes,
  updateMetadata,
} from "../../firebase/config";
import styles from "./styles";

const tag = "[CAMERA]";

export default function App(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [plantImagesArray, setPlantImagesArray] = useState([]);
  const [plantName, setPlantName] = useState("My Plant");
  const userId = props.route.params.user.id;
  const plantId = genRandStringFrom(userId);
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

  function genRandStringFrom(str) {
    let result = " ";
    const charactersLength = str.length;
    for (let i = 0; i < charactersLength; i++) {
      result += str.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const storePhotos = async () => {
    const storage = await getStorage();
    let imagesToStore = await Promise.all(
      plantImagesArray.map(async (plantImg) => {
        const storageURI = `${userId}/plants/${plantId}/${genRandStringFrom(
          userId
        )}.jpg`;
        const metadata = {
          contentType: "image/jpg",
        };
        const storageRef = await ref(storage, storageURI);
        const response = await fetch(plantImg.uri);
        const blob = await response.blob();
        var plantImgFB = await uploadBytes(storageRef, blob);
        await updateMetadata(storageRef, metadata);
        return {
          uri: plantImgFB.metadata.fullPath,
          height: plantImg.height,
          width: plantImg.width,
        };
      })
    );
    await sendImgsToFirestore(imagesToStore);
  };
  const __savePhoto = async () => {
    setPlantImagesArray([...plantImagesArray, capturedImage]);
    setPreviewVisible(false);
    if (plantImagesArray.length == 1) {
      setPhotoSaved(true);
    }
  };

  const sendImgsToFirestore = async (imagesToStore) => {
    const firestoreDB = await getFirestore(app);
    const plantData = {
      userId: userId,
      plantId: plantId,
      plantName: plantName,
      createdAt: serverTimestamp(),
      plantImgs: [...imagesToStore],
    };
    await addDoc(collection(firestoreDB, "plants"), plantData);
    props.navigation.navigate("NamePlant", {
      user: props.route.params.user,
      plantData: plantData.plantId,
    });
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {previewVisible ? (
        <ImageBackground
          source={{ uri: capturedImage && capturedImage.uri }}
          style={{
            flex: 1,
          }}
        >
          <View style={styles.imgPreviewContainer}>
            <View style={styles.imgPreviewButtons}>
              <TouchableOpacity
                onPress={() => {
                  setPreviewVisible(false);
                }}
                style={styles.imgPreviewButton}
              >
                <Text style={styles.imgPreviewButtontext}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={photoSaved ? sendImgsToFirestore : __savePhoto}
                style={styles.imgPreviewButton}
              >
                <Text style={styles.imgPreviewButtontext}>
                  {photoSaved ? "Continue" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : photoSaved ? (
        <View style={{ flex: 1, width: "100%" }}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%" }}
            keyboardShouldPersistTaps="always"
          >
            <View>
              <Text>Name Your Plant:</Text>
              <TextInput
                style={styles.input}
                placeholder={plantName}
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setPlantName(text)}
                value={plantName}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
            </View>

            <View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                {plantImagesArray.map((img, index) => {
                  return (
                    <Image
                      key={index}
                      style={styles.logo}
                      source={{
                        uri: `data:image/jpeg;charset=utf-8;base64, ${img.base64}`,
                      }}
                    />
                  );
                })}
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.button} onPress={storePhotos}>
                <Text style={styles.buttonTitle}>Save</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      ) : (
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={(r) => {
            camera = r;
          }}
        >
          <View style={styles.cameraView}>
            <View
              style={{
                ...styles.cameraTopButtons,
                right: "5%",
              }}
            >
              <TouchableOpacity onPress={__closeCamera}>
                <Text style={styles.imgPreviewButtontext}>X</Text>
              </TouchableOpacity>
            </View>
            {/*             <TouchableOpacity
              style={{
                ...styles.cameraTopButtons,
                left: "5%",
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.imgPreviewButtontext}> Flip </Text>
            </TouchableOpacity> */}
            <View style={styles.takePictureButtonWrap}>
              <View style={styles.takePictureButtonOutter}>
                <View style={styles.takePictureButtoninWrap}>
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={styles.takePictureButton}
                  />
                </View>
              </View>
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
}
