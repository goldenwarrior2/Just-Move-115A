import React from 'react';
import { useState } from 'react';
import { Sidenav, Nav } from 'rsuite';
import { TagPicker } from 'rsuite';


function SideNavBar(props) {

    const handleClickStartDate = () => {
        props.changeSorting(props.startDateSortIndic);
    };

    const handleClickPriority = () => {
        props.changeSorting(props.prioritySortIndic);

    };

    return (!props.trigger ? "" :
        <div style={{ width: 300, position: "absolute" }}>
            <Sidenav appearance={props.darkMode ? "subtle" : "inverse"} className={props.darkMode ? "dark-sidebar" : ""}>
                <Sidenav.Body style={{ width: 300, height: "100vh" }}>
                    <h3 style={props.darkMode ? { textAlign: "center", color: "#9e9ea3" } : { textAlign: "center" }}>Filters</h3>
                    <Nav activeKey="1">
                        <Nav.Item eventKey="1-1" title="Start Date" onClick={handleClickStartDate}>
                            Start Date
                            {props.getArrowIndic(props.startDateArrowIndic)}
                        </Nav.Item>
                        <Nav.Item eventKey="1-3" title="Priority" onClick={handleClickPriority}>
                            Priority
                            {props.getArrowIndic(props.prioritySortArrowIndic)}
                        </Nav.Item>
                        <Nav.Menu eventKey="1-4" title="Categories">
                            <div style={{ paddingLeft: '25px' }}>
                                <TagPicker
                                    data={props.categoryList}
                                    style={{ width: 250 }}
                                    menuStyle={props.darkMode ? { width: 250, background: "#202124", color: "whitesmoke" } : { width: 250 }}
                                    onChange={(value) => {
                                        props.setFilters(value);
                                    }}
                                />
                            </div>
                        </Nav.Menu>
                        <hr />
                        <Nav.Item eventKey="1-5" title="Close" onClick={props.closeNavBar}>
                            Close
                        </Nav.Item>
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
}

export default SideNavBar;
