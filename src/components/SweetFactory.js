import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from 'fbase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";

const SweetFactory = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl="";
        if(attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const sweetObj = {
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };
        await addDoc(collection(dbService,"sweets"), sweetObj);
        setSweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setSweet(value);
    };
    const onFileChange = (event) => {
        const {target:{files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(theFile);
        reader.onloadend = (finishedEvent) => {
            const {currentTarget:{result}} = finishedEvent;
            setAttachment(result);
        };
    };
    const onClearAttachment = () => setAttachment(null);

    return (
        <form onSubmit={onSubmit}>
            <input
                value={sweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Sweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
}

SweetFactory.propTypes = {
    userObj: PropTypes.object.isRequired,
}

export default SweetFactory;