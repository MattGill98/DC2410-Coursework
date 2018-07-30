import React from 'react';
import { Alert } from 'reactstrap';

const ErrorAlert = ({id, error}) => {
    if (!error) {
        return null;
    }
    return (
        <Alert id={id} color="danger">
            {error}
        </Alert>
    );
};

export default ErrorAlert;