import { getDocs, setDoc, collection, doc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

export async function loadData() {
    const arr = [];
    if (auth.currentUser == null) {
        for (var i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("goal_")) {
                const data = localStorage.getItem(key);
                arr.push(JSON.parse(data));
            }
        }
    } else {
        const coll = collection(firestore, "users", auth.currentUser.uid, "goals");
        const docs = await getDocs(coll);
        docs.forEach((doc) => {
            arr.push(doc.data());
        });
    }
    return arr;
}

export async function saveAddGoal(goal) {
    if (auth.currentUser == null) {
        const gData = JSON.stringify(goal);
        localStorage.setItem("goal_" + goal.id, gData);
    } else {
        await setDoc(doc(firestore, "users", auth.currentUser.uid, "goals", goal.id), goal);
    }
}

export async function saveDelGoal(id) {
    if (auth.currentUser == null) {
        localStorage.removeItem("goal_" + id)
    } else {
        await deleteDoc(doc(firestore, "users", auth.currentUser.uid, "goals", id));
    }
}
