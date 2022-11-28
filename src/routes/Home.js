import React, { useState, useEffect } from "react";
import { dbService } from 'fbase';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Sweet from "../components/Sweet";
import SweetFactory from 'components/SweetFactory';
import PropTypes from "prop-types";

const Home = ({ userObj }) => {
    const [sweets, setSweets] = useState([]);
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
    return (
        <div className="container">
            <SweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
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

Home.propTypes = {
    userObj: PropTypes.object.isRequired,
}

export default Home;