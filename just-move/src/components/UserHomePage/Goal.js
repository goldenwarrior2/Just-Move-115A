import { useState } from 'react';
import React from 'react';

export function Goal({ props }) {
    return (
        <tr>
            <td>{props.goal}</td>
            <td>{props.intrinsicMotivation}</td>
            <td>{props.extrinsicMotivation}</td>
            <td>{props.progress}</td>
        </tr>
    )
}