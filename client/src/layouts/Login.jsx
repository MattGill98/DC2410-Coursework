import { login } from 'actions/userActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        username: state.User.username,
        authenticating: state.User.authenticating,
        authenticated: state.User.authenticated,
        error: state.User.error
    };
};

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.startLogin = this.startLogin.bind(this);
    }

    startLogin(e) {
        e.preventDefault();
        e.stopPropagation();

        var data = new FormData(document.forms.namedItem('loginForm'));
        this.props.dispatch(login(data));
    }

    render() {
        const { error, authenticating, authenticated } = this.props;

        if (error) {
            return <div>Error!</div>
        }

        if (authenticated === true) {
            return <Redirect to='/events' />
        }

        if (authenticating === true) {
            return <div>Logging in...</div>
        }

        return (
            <div>
                <Button outline color="secondary" onClick={this.props.history.goBack}>Back</Button>
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.startLogin} id="loginForm">
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="name" required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" required />
                            </FormGroup>
                            <Button outline color="success" type="submit">Login</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Login);