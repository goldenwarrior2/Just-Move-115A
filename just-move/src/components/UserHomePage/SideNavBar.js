import React from 'react';
import { Sidenav, Nav } from 'rsuite';
import { TagPicker } from 'rsuite';


function SideNavBar(props) {

    const handleClickStartDate = () => {
        console.log('pressed start date');
        props.changeSorting(props.startDateSortIndic);
    };

    const handleClickPriority = () => {
        props.changeSorting(props.prioritySortIndic);

    };

    return (
        <div style={{ width: 300}}>
            <Sidenav appearance="inverse">
                <Sidenav.Body style={{ width: 300, height: "100vh"}}>
                    <Nav activeKey="1">
                        <Nav.Menu eventKey="1" title="Filters">
                            <Nav.Item eventKey="1-1" title="Start Date" onClick={handleClickStartDate}>
                                Start Date
                                {props.getArrowIndic(props.startDateArrowIndic)}
                            </Nav.Item>
                            <Nav.Item eventKey="1-3" title="Priority" onClick={handleClickPriority}>
                                Priority
                                {props.getArrowIndic(props.prioritySortArrowIndic)}
                            </Nav.Item>
                            <Nav.Menu eventKey="1-3" title="Categories">
                                <div style={{paddingLeft: '25px'}}>
                                <TagPicker
                                    data={props.categoryList}
                                    style={{ width: 250 }}
                                    menuStyle={{ width: 250 }}
                                    onChange={(value) => {
                                    props.setFilters(value);
                                    }}
                                />
                                </div>
                            </Nav.Menu>
                        </Nav.Menu>
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
}

export default SideNavBar;