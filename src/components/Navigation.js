import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navigation = ({ userObj }) => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/profile">{userObj.displayName}'s Profile</Link></li>
            </ul>
        </nav>
    )
};

Navigation.propTypes = {
    userObj: PropTypes.object.isRequired,
}


export default Navigation;