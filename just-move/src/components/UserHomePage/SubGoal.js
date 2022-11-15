import React from 'react';
import { useState, useRef } from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import SortDown from '@rsuite/icons/SortDown';
import IconButton from 'rsuite/IconButton';
import TrashIcon from '@rsuite/icons/Trash';

export function SubGoal({props, handleDeletesubGoal,list}){

    const allgoals = list.map(product => <li key={product}>{product}</li>)

    const [selects,setSelects]=useState();
    return (
        <tr style={{backgroundColor: 'rgba(33, 150, 243, 0.2)'}}>
        
        <td>{props.subgoal}</td>
        <td> 
            {/* <td>{selects}</td> */}
            <select value={selects} onChange={e=>setSelects(e.target.value)}>
            <option>--Choose a Goal--</option>
            {allgoals.map((element, index) => {
        return (
          <option key={index}>
            <h2>{element}</h2>
          </option>
        );
      })}
            
            </select>
        </td>
        <td>{props.progress}</td>
        <td>
            <ButtonGroup justified>
                <IconButton icon = {<TrashIcon />} type="button" appearance="primary" color="blue" onClick={()=> handleDeletesubGoal(props.id)}></IconButton>
            </ButtonGroup>
        </td>
    </tr>
    


    )

}