import PropTypes from "prop-types";
import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from  "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route path="/profile">
                            <Profile userObj={userObj} refreshUser={refreshUser} />
                        </Route>
                        <Redirect from="*" to="/" />
                    </>
                ) : (
                    <>
                        <Route exact path="/">
                            <Auth />
                        </Route>
                        <Redirect from="*" to="/" />
                    </>
                )}
            </Switch>
        </Router>
    );
}

AppRouter.propTypes = {
    refreshUser: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    userObj: PropTypes.object.isRequired
}

export default AppRouter;