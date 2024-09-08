import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDIpX1CCNI38WwvfmSj6XOkqjUCtrqYWtw",
  authDomain: "testproject-88b5c.firebaseapp.com",
  databaseURL: "https://testproject-88b5c-default-rtdb.firebaseio.com",
  projectId: "testproject-88b5c",
  storageBucket: "testproject-88b5c.appspot.com",
  messagingSenderId: "863676058544",
  appId: "1:863676058544:web:9d5a7ff5e1c08a2f96a475",
  measurementId: "G-QH03HM2KF6"
};

 const app = initializeApp(firebaseConfig);
 const messaging = getMessaging(app);

 export { messaging };  