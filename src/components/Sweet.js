import { dbService, storageService } from 'fbase';
import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from"firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="sweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container sweetEdit">
                            <input
                                type="text"
                                placeholder="Edit your sweet"
                                defaultValue={newSweet}
                                required
                                autoFocus
                                onChange={onChange}
                                className="formInput"
                            />
                            <input type="submit" value="Update Sweet" className="formBtn" />
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                    </>
                ) : (
                    <>
                        <h4>{sweetObj.text}</h4>
                        {sweetObj.attachmentUrl && <img src={sweetObj.attachmentUrl} />}
                        {isOwner && (
                            <div className="sweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
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