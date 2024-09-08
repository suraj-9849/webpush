importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/firebase.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});