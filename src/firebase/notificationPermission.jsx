import { messaging } from "./firebase.jsx";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    // 1 Register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // 2️ Ask permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BMtAN_-sIbkZU5GTz9hHqKvqh1gtGFWeqRu-f0cMxn6KHatTTPT-jAns1PMy5-2WMC5JWjnDTXVlA3_ISXAmj5g",
        // vapidKey: "BL0Msuf4cJ3p7ItHYNRAQyfdUM-ofm6kWHI1LjVkMw1Sc8NYyLRnHu4-WdpaWE-g-uy3OJN6Kirt7t7pKyCTHwk",
        serviceWorkerRegistration: registration,
      });
     
      sessionStorage.setItem("fcmToken2", token);
      // console.log("🔥 FCM Token:", token);
      return token;
    } else {
      console.log("❌ Notification permission denied");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};
// fIuA_Lpu9JUHpsPNmTLewo:APA91bFSaMFdeuBSsH7s3Z15n6LjgYHxVPn9Dp9AOw1OiNP0t3sfudqxRgOvsDbUFK4UQIRHosb7g0lTUklYMgyfUCoGi4pPGD14a8kqc6JgQI5KMtCo56g
