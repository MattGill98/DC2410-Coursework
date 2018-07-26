import { register } from 'actions/userActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label, Row, Alert } from 'reactstrap';

const mapStateToProps = state => {
    return {
        authenticating: state.User.authenticating,
        authenticated: state.User.authenticated,
        error: state.User.error
    };
};

function RegisterError(props) {
    if (!props.error) {
        return null;
    }
    return (
        <Alert id="errorAlert" color="danger">
            {props.error.error}
        </Alert>
    );
}

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.startRegister = this.startRegister.bind(this);
    }

    startRegister(e) {
        e.preventDefault();
        e.stopPropagation();

        var data = new FormData(document.forms.namedItem('registerForm'));
        if (!this.props.authenticated) {
            this.props.dispatch(register(data));
        }
    }

    render() {
        const { error, authenticating, authenticated } = this.props;

        if (authenticated === true) {
            return <Redirect to='/events' />
        }

        if (authenticating === true) {
            return <div>Registering...</div>
        }

        return (
            <div>
                <Button outline color="secondary" onClick={this.props.history.goBack}>Back</Button>
                <RegisterError error={error} />
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.startRegister} id="registerForm">
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="role">Role</Label>
                                <Input type="select" name="role">
                                    <option></option>
                                    <option>student</option>
                                    <option>organiser</option>
                                </Input>
                            </FormGroup>
                            <Button outline color="success" type="submit">Register</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Login);