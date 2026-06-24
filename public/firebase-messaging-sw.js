// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyD-bNa_LWqo5MdRzSdzEiW00rQCezuM2yw",
//   authDomain: "school-erp-notifications.firebaseapp.com",
//   projectId: "school-erp-notifications",
//   storageBucket: "school-erp-notifications.firebasestorage.app",
//   messagingSenderId: "178535768962",
//   appId: "1:178535768962:web:e3372804e87d144aab659b",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   self.registration.showNotification(
//     payload.notification.title,
//     {
//       body: payload.notification.body,
//       icon: "/logo192.png",
//     }
//   );
// });


importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");
 
firebase.initializeApp({
  apiKey: "AIzaSyC3Zc2hpE-PjAsDpAXyG4PeLu9vKIJhR_k",  
  authDomain: "hostelo-21b16.firebaseapp.com",
  projectId: "hostelo-21b16",
  storageBucket: "hostelo-21b16.firebasestorage.app",
  messagingSenderId: "594582067311",
  appId: "1:594582067311:web:85c0e6b37cf4cb9bbf159a",
});
 
const messaging = firebase.messaging();
 
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo192.png",
    }
  );
});
