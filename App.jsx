import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  Camera,
  NamePlant,
} from "./src/screens";
import { decode, encode } from "base-64";
import {
  app,
  getFirestore,
  getAuth,
  onAuthStateChanged,
  getDoc,
  doc,
} from "./src/firebase/config";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  if (loading) {
    return <></>;
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(firestore, "id", uid);
        const docSnap = getDoc(docRef)
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} extraData={user} />}
            </Stack.Screen>
            <Stack.Screen name="NamePlant" component={NamePlant} />

            <Stack.Screen name="Camera" component={Camera} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
