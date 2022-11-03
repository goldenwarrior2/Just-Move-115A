import { useState, useRef } from 'react';
import React from 'react';

export function ProgressBar ({value, target}) {
    const percentage = parseInt(value/target*100);
    return (
      <div style={{
          width:"200px",
          height:"30px",
          background:"black",
          color:"white"
      }}>
      <div style={{
          width:`${percentage}%`,
          height:"100%",
          background:"green"
      }}>
        {percentage}%
      </div>
    </div>
  );
}
