import { useState, useEffect } from 'react';
import React from 'react';

export function LoadingScreen() {
    const [dots, setDots] = useState(0);

    function updateDots() {
        if (dots === 3) {
            setDots(0);
        } else {
            setDots(dots + 1);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => updateDots(), 1000);

        return () => clearInterval(interval);
    }, [dots]);

    const str = ['L', 'o', 'a', 'd', 'i', 'n', 'g'];
    for (var i = 0; i < dots; i++) {
        str.push('.');
    }
    const str2 = str.join("");

    return (
        <div className="d-flex flex-column align-items-center justify-content-center bd-highlight mb-3 vh-100 bg-dark bg-gradient fixed-top">
            <div className="p-2"><img src="/logo192.png" alt="LOGO" /></div>
            <div className="p-2 text-center h3 text-white">{str2}</div>
        </div >);
}
