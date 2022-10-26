import {useState} from "react";
import React from 'react';
import "./Modal.css"

function Modal(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
            <h2>Popup for goal form</h2>
            <button id="close-btn" onClick={() => props.setPopupBtnTrigger(false)}>Close</button>
            </div>
        </div>
    ) : "";
}

export default Modal