import AuthForm from 'components/AuthForm';
import React from "react";
import { authService, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from '../fbase';

const Auth = () => {
    const onSocialClick = async (event) =>  {
        const {target:{name}} = event;
        let provider;
        try {
            if(name === "google") {
                provider = new GoogleAuthProvider();
            } else if(name === "github") {
                provider = new GithubAuthProvider();
            }
            await signInWithPopup(authService, provider);
        } catch(error) {
        }
    }
    return (
        <div>
            <AuthForm />
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    );
};

export default Auth;