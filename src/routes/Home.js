import React, { useState, useEffect } from "react";
import { dbService } from 'fbase';
import { collection, addDoc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";

const Home = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    // const getSweets = async() => {
    //     const dbSweets = await getDocs(collection(dbService, "sweets"));
    //     dbSweets.forEach(document => {
    //         const sweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setSweets(prev => [sweetObject, ...prev]);
    //     });
    // };
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
        await addDoc(collection(dbService,"sweets"), {
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setSweet("");
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setSweet(value);
    };
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
                <input type="submit" value="Sweet" />
            </form>
            <div>
                {sweets.map((sweet) => (
                    <div key={sweet.id}>
                        <h4>{sweet.text}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Home;