import { dbService, storageService } from 'fbase';
import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from"firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import PropTypes from "prop-types";

const Sweet = ({ sweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSweet, setNewSweet] = useState(sweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this sweet?");
        if(ok) {
            const SweetTextRef = doc(dbService, "sweets", `${sweetObj.id}`);
            const SweetImgRef = ref(storageService, sweetObj.attachmentUrl);
            // delete sweet
            await deleteDoc(SweetTextRef);
            await deleteObject(SweetImgRef);
        }
    };
    const toggleEditing = () => {
        setEditing(prev => !prev);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        const SweetTextRef = doc(dbService, "sweets", `${sweetObj.id}`);
        // update sweet
        await updateDoc(SweetTextRef, {
            text: newSweet,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {target:{value}} = event;
        setNewSweet(value);
    };
    return (
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input
                                type="text"
                                placeholder="Edit your sweet"
                                defaultValue={newSweet}
                                required
                                onChange={onChange}
                            />
                            <input type="submit" value="Update Sweet" />
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{sweetObj.text}</h4>
                        {sweetObj.attachmentUrl && (
                            <img src={sweetObj.attachmentUrl} width="50px" height="50px" />
                        )}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Sweet</button>
                                <button onClick={toggleEditing}>Edit Sweet</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
};

Sweet.propTypes = {
    sweetObj: PropTypes.object.isRequired,
    isOwner: PropTypes.bool.isRequired,
}

export default Sweet;