import PropTypes from "prop-types";
import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from  "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {isLoggedIn ? (
                    <>
                        <div
                            style={{
                            maxWidth: 890,
                            width: "100%",
                            margin: "0 auto",
                            marginTop: 80,
                            display: "flex",
                            justifyContent: "center",
                            }}
                        >
                            <Route exact path="/">
                                <Home userObj={userObj} />
                            </Route>
                            <Route path="/profile">
                                <Profile userObj={userObj} refreshUser={refreshUser} />
                            </Route>
                            <Redirect from="*" to="/" />
                        </div>
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
    refreshUser: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    userObj: PropTypes.object
}

export default AppRouter;