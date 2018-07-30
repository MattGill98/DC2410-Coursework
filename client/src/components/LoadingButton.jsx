import React from 'react';
import { Button } from 'reactstrap';

const LoadingButtonText = ({loading, loadingText, text}) => {
    if (loading) {
        return loadingText;
    }
    return text;
};

const LoadingButton = ({ visible, theme, loading, text, loadingText, onClick }) => {
    if (!visible) {
        return null;
    }
    return (
        <Button color={theme} onClick={onClick}>
            <LoadingButtonText loading={loading} loadingText={loadingText} text={text} />
        </Button>
    );
};

export default LoadingButton;