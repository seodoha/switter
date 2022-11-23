import React from "react";
import { useHistory } from 'react-router-dom';
import { authService } from 'fbase';

const Profile = () => {
    const onLogOutClick = () => authService.signOut();
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
}

export default Profile;