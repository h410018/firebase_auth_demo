import { createContext, useState, Dispatch, SetStateAction } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { app } from '../firebase'

interface AuthContextType {
    googleSignIn: () => void,
    googleSignOut: () => void,
    isSignIn: boolean,
    setIsSignIn: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextType>({
    googleSignIn: function (){},
    googleSignOut: function (){},
    isSignIn: false,
    setIsSignIn: function (){}
});

export const AuthContextProvider = ({ children }) => {
    const auth = getAuth(app);
    const [ isSignIn, setIsSignIn ] = useState(false);
    const googleSignIn = () => {
        const googleProvider = new GoogleAuthProvider()
        signInWithPopup(auth, googleProvider)
        .then((result) => {
            console.log(result)
              // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const googleuser = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            setIsSignIn(true)
        }).catch((error) => {
            console.log(error)
             // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        })
    }

    const googleSignOut = () => {
        signOut(auth).then((res) => {
            // Sign-out successful.
            // window.location.assign('https://accounts.google.com/logout');
            setIsSignIn(false)
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <AuthContext.Provider value={{googleSignIn, googleSignOut, isSignIn, setIsSignIn}}>
            {children}
        </AuthContext.Provider>
    )
}
