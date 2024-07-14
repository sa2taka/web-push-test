import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging.js";
import sanitizeHtml from "https://cdn.skypack.dev/sanitize-html";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function requestNotificationPermission() {
  try {
    await Notification.requestPermission();
    // NOTE: 自動的に `firebase-messaging-sw.js` をserviceWorkerに登録するため、app.jsに登録するコードは不要
    const token = await getToken(messaging);
    localStorage.setItem("notification-token", token);
    console.log("Notification permission granted. Token:", token);
    document.getElementById("notification-token").value = token;

    // ここでトークンをサーバーに送信するなどの処理を行う
    // トークンを用いて、サーバーからプッシュ通知を送信することができる
    // ユーザーごとにトークンを保存しておき、特定のユーザーに通知を送信する場合などに利用する。
  } catch (error) {
    console.error("Unable to get permission or token:", error);
  }
}

document.getElementById("subscribe").addEventListener(
  "click",
  requestNotificationPermission,
);
document.getElementById("unsubscribe").addEventListener("click", async () => {
  try {
    await deleteToken(messaging);
    localStorage.removeItem("notification-token");
    document.getElementById("notification-token").value = "";
    console.log("Token deleted. Unsubscribed from notifications.");
  } catch (error) {
    console.error("Error unsubscribing:", error);
  }
});

onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  // ここで受信したメッセージを表示するなどの処理を行う
  // アプリを開いているときに音を鳴らしたりなどが出来る
  document.getElementById("message").innerHTML =
    `メッセージを受け取りました<br />${sanitizeHtml(JSON.stringify(payload))}
`;
});

document.getElementById("send-notification").addEventListener("click", () => {
  const token = document.getElementById("notification-token").value;
  const title = document.getElementById("notification-title").value;
  const body = document.getElementById("notification-body").value;

  const notification = {
    token,
    title,
    body,
  };

  fetch(
    "https://asia-northeast1-sa2taka-web-push-test.cloudfunctions.net/push-message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    },
  )
    .then((response) => {
      if (response.ok) {
        console.log("Notification sent successfully.");
      } else {
        console.error("Failed to send notification.");
      }
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
});

const storedToken = localStorage.getItem("notification-token");
if (storedToken) {
  document.getElementById("notification-token").value = storedToken;
}
