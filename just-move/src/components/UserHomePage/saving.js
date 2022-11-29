import { getDocs, setDoc, collection, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

var outstandingWrites = 0;

export async function loadData() {
    const arr = { goals: [] };
    if (auth.currentUser == null) {
        for (var i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("goal_")) {
                const data = localStorage.getItem(key);
                arr.goals.push(JSON.parse(data));
            } else if (key.startsWith("setting_")) {
                arr[key.substring(8)] = localStorage.getItem(key);
            }
        }
    } else {
        const doc2 = await getDoc(doc(firestore, "users", auth.currentUser.uid));
        Object.assign(arr, doc2.data());
        const coll = collection(firestore, "users", auth.currentUser.uid, "goals");
        const docs = await getDocs(coll);
        docs.forEach((doc2) => {
            arr.goals.push(doc2.data());
        });
    }
    return arr;
}

export async function saveAddGoal(goal) {
    if (auth.currentUser == null) {
        const gData = JSON.stringify(goal);
        localStorage.setItem("goal_" + goal.id, gData);
    } else {
        outstandingWrites++;
        await setDoc(doc(firestore, "users", auth.currentUser.uid, "goals", goal.id), goal);
        outstandingWrites--;
    }
}

export async function saveDelGoal(id) {
    if (auth.currentUser == null) {
        localStorage.removeItem("goal_" + id)
    } else {
        outstandingWrites++;
        await deleteDoc(doc(firestore, "users", auth.currentUser.uid, "goals", id));
        outstandingWrites--;
    }
}

export async function saveSetting(key, value) {
    if (auth.currentUser == null) {
        localStorage.setItem("setting_" + key, value);
    } else {
        outstandingWrites++;
        let data = {};
        data[key] = value;
        await updateDoc(doc(firestore, "users", auth.currentUser.uid), data);
        outstandingWrites--;
    }
}

export function hasOutstandingWrites() {
    return outstandingWrites !== 0;
}
