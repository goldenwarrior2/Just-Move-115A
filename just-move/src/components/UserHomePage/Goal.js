import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import IconButton from 'rsuite/IconButton';

export function Goal({ props, handleDeleteGoal, handleEditGoal }) {
    return (
        <tr>
            <td>{props.goal}</td>
            <td>{props.intrinsicMotivation}</td>
            <td>{props.extrinsicMotivation}</td>
            <td>{props.progress}</td>
            <td>
                <ButtonGroup justified>
                  <IconButton icon={<EditIcon />} appearance="primary" color="blue" onClick={()=> handleEditGoal(props.id)}></IconButton>
                  <IconButton icon={<TrashIcon />} appearance="primary" color="blue" onClick={()=> handleDeleteGoal(props.id)}></IconButton>
                </ButtonGroup>
            </td>
        </tr>
    )
}
