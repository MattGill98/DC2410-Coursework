import React from 'react';
import { ButtonToolbar } from 'reactstrap';

const ButtonBar = (props) => (
    <ButtonToolbar className="justify-content-between mb-3 mt-2">
        {props.children}
    </ButtonToolbar>
);

export default ButtonBar;