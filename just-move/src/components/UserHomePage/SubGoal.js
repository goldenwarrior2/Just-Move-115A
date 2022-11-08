import React from 'react';
import { useState} from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import IconButton from 'rsuite/IconButton';
import TrashIcon from '@rsuite/icons/Trash';

export function SubGoal({props}){

    
    return (
        <tr>
        <input type="checkbox"  />
        <td>{props.subgoal} </td>
        <td> </td>
        
        </tr>

    )

}