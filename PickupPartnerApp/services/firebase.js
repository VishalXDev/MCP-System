import * as firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
export { messaging };
