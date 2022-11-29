import React from "react";

export const priorityStrings = ["----", "---", "--", "-", "=", "+", "++", "+++", "++++"];
export const priorityRange = 4;

const handleChildElementClick = (e) => {
    e.stopPropagation();
};


export function PrioritySelect(props) {
    return (<select name="priority" className={props.className} value={props.value} onChange={props.onChange} onClick={handleChildElementClick}>
        {Array.from(Array(2 * priorityRange + 1).keys()).map((i) => (
            <option value={i - priorityRange} key={i}>{priorityStrings[i]}</option>
        ))}
    </select>);
}
