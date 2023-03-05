import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  updateMetadata,
} from "firebase/storage";

import * as firebaseConfig from "./fireBaseConfig";

const app = initializeApp(firebaseConfig.default);

export {
  app,
  getFirestore,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  getDoc,
  doc,
  signInWithEmailAndPassword,
  serverTimestamp,
  setDoc,
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  updateMetadata,
};
