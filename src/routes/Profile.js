import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { authService, dbService } from 'fbase';
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "@firebase/auth";
import Sweet from "../components/Sweet";
import PropTypes from "prop-types";

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [sweets, setSweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMySweets = async () => {
        const q = query(
            collection(dbService, "sweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt"),
        );
        const querySnapshot = await getDocs(q);
        // const sweetsArr = querySnapshot.docs.map((item) => ({ ...item.data() }));
        const sweetsArr = querySnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
        }));
        setSweets(sweetsArr);

    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUser();
        }
    };
    useEffect(() => {
        getMySweets();
    }, []);

    // console.log(sweets);

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    autoFocus
                    placeholder='Display name'
                    onChange={onChange}
                    value={newDisplayName}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
            {
                sweets.map((item)=>{
                    <Sweet
                        sweetObj={item}
                        isOwner={true}
                    />
                })
            }
        </div>
    );
}

Profile.propTypes = {
    userObj: PropTypes.object.isRequired,
    refreshUser: PropTypes.func.isRequired,
}

export default Profile;