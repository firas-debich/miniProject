import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyDX0vCjbzPqdxL-Kt7rjEQZfmAnY0kzrkc",
    authDomain: "sensor-a9e85.firebaseapp.com",
    databaseURL: "https://sensor-a9e85-default-rtdb.firebaseio.com",
    projectId: "sensor-a9e85",
    storageBucket: "sensor-a9e85.appspot.com",
    appId: "1:578761276892:android:0a21fe6be6239be9c86319",
  };


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

