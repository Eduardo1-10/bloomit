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
  const [capturedImage, setCapturedImage] = useState(null);
  const userId = props.route.params.user.id;
  let camera;
  useEffect(() => {}, []);
  return <View style></View>;
}
