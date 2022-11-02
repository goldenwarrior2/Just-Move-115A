import React from 'react';
import "rsuite/dist/rsuite.min.css";
import ButtonGroup from 'rsuite/ButtonGroup';
import TrashIcon from '@rsuite/icons/Trash';
import IconButton from 'rsuite/IconButton';
import Progress from 'rsuite/Progress';

export function Goal({ props, handleDeleteGoal }) {
    console.log(props.progress);
    const percentCompletion = props.progress.value / props.progress.target * 100;
    const status = percentCompletion === 100 ? 'success' : null;

    return (
        <tr>
            <td>{props.goal}</td>
            <td>{props.intrinsicMotivation}</td>
            <td>{props.extrinsicMotivation}</td>
            <td><Progress.Line percent={percentCompletion} status={status}/></td>
            <td>
                <ButtonGroup justified>
                    <IconButton icon={<TrashIcon />} appearance="primary" color="red" onClick={()=> handleDeleteGoal(props.id)}></IconButton>
                </ButtonGroup>
            </td>
        </tr>
    )
}
