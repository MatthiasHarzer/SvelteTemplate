import { initializeApp } from 'firebase/app';
import {getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {writable} from "svelte/store";

const firebaseConfig = {
    /*Firebase config*/
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();

onAuthStateChanged(auth, u =>{
    if(u){
        user.set(u);
    }else{
        user.set(null);
    }
})


export const user = writable(null);

export const signInWithGoogle = ()=>{
    signInWithPopup(auth, googleAuthProvider).then(result=>{

    }).catch(error=>{
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`Error ${errorCode}: ${errorMessage}`)
    })
}

export const logOut = ()=>{
    signOut(auth).then().catch(error=>{
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`Error ${errorCode}: ${errorMessage}`)
    })
}