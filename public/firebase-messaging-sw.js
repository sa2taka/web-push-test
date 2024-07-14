// NOTE: 最新版は10だが、moduleが動かなかったり、classicだと10で動かなかったりしたので8にしている
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// どうやらfirebase-messaging.jsをimportするだけで自動的にshowNotification相当のことを行ってくれるようだ。
// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message:", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
