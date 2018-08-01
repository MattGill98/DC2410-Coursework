import React from 'react';
import { ButtonToolbar } from 'reactstrap';

const ButtonBar = (props) => {
    if (props.visible === false) {
        return null;
    }
    return (
        <ButtonToolbar className="justify-content-between mb-3 mt-2">
            {props.children}
        </ButtonToolbar>
    );
};

export default ButtonBar;