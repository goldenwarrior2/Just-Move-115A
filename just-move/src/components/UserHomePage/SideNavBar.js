import { useState, useRef } from "react";
import React from 'react';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import { TagPicker } from 'rsuite';


function SideNavBar(props) {

    const SideNavInstance = ({...props}) => {
        return (
            <div style={{ width: 300}}>
            <Sidenav appearance="inverse">
                <Sidenav.Body style={{ width: 300}}>
                    <Nav activeKey="1" style={{'background-color': 'pink'}}>
                        <Nav.Menu eventKey="1" title="Filters">
                            <Nav.Menu eventKey="1-1" title="Categories">
                                <TagPicker
                                    data={props.categoryList}
                                    style={{ width: 250 }}
                                    menuStyle={{ width: 250 }}
                                    onChange={(value) => {
                                    props.setFilters(value);
                                    }}
                                />
                            </Nav.Menu>
                        </Nav.Menu>
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
        );
    };

    const instance = (
        <div>
          <SideNavInstance appearance="inverse" />
        </div>
      );

    return (
        <div style={{ width: 300}}>
            <Sidenav appearance="inverse" style={{'background-color': 'pink'}}>
                <Sidenav.Body style={{ width: 300}}>
                    <Nav activeKey="1">
                        <Nav.Menu eventKey="1" title="Filters">
                            <Nav.Menu eventKey="1-1" title="Categories">
                                <TagPicker
                                    data={props.categoryList}
                                    style={{ width: 250 }}
                                    menuStyle={{ width: 250 }}
                                    onChange={(value) => {
                                    props.setFilters(value);
                                    }}
                                />
                            </Nav.Menu>
                        </Nav.Menu>
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
}

export default SideNavBar;