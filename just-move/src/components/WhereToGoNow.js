import React from "react";
import { useEffect } from "react";
import { LoadingScreen } from "./Loading";
import { auth } from "./firebase/firebase"
import { useNavigate } from "react-router-dom";

export function WhereToGoNow() {
    const navigate = useNavigate();

    useEffect(function () {
        const unsub = auth.onAuthStateChanged(function (user) {
            unsub();
            if (user == null) {
                navigate("/login");
            } else {
                navigate("/userhome")
            }
        });
    }, []);
    return <LoadingScreen />;
}
