import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { updateProfile } from "@firebase/auth";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        authService.onAuthStateChanged((user)=> {
            if(user) {
                user.displayName ?? (user.displayName = user.email.split("@")[0]);
                // setUserObj({
                //     displayName: user.displayName,
                //     uid: user.uid,
                //     updateProfile: (args) => updateProfile(user, {displayName: user.displayName}),
                // });
                setUserObj(user);
            } else {
                setUserObj(null);
            }
            setInit(true);
        });
    }, []);
    const refreshUser = () => {
        const user = authService.currentUser;
        // setUserObj({
            //     displayName: user.displayName,
            //     uid: user.uid,
            //     updateProfile: (args) => user.updateProfile(args),
            // });
        setUserObj(Object.assign({}, user));
    };
    return (
        <>
            {init ? (
                <AppRouter
                    refreshUser={refreshUser}
                    isLoggedIn={Boolean(userObj)}
                    userObj={userObj}
                />
            ): (
                "Initializing...."
            )}
        </>
    );
}

export default App;
