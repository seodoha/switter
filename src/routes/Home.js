import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from 'fbase';
import { collection, addDoc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Sweet from "../components/Sweet";

const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    useEffect(() => {
        // getSweets();
        const q = query(collection(dbService, "sweets"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot)=>{
            const sweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data()
            }));
            setSweets(sweetArr);
        });
    }, []);
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
        <div>
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
            <div>
                {sweets.map((sweet) => (
                    <Sweet
                        key={sweet.id}
                        sweetObj={sweet}
                        isOwner={sweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    )
};

export default Home;