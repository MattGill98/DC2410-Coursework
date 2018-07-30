import { login, resetError } from 'actions/userActions.js';
import ErrorAlert from 'components/ErrorAlert.jsx';
import React from 'react';
import ButtonBar from 'components/ButtonBar.jsx';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        authenticating: state.User.authenticating,
        authenticated: state.User.authenticated,
        authenticationError: state.User.authenticationError
    };
};

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.startLogin = this.startLogin.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(resetError());
    }

    startLogin(e) {
        e.preventDefault();
        e.stopPropagation();

        var data = new FormData(document.forms.namedItem('loginForm'));
        if (!this.props.authenticated) {
            this.props.dispatch(login(data));
        }
    }

    render() {
        const { authenticationError, authenticating, authenticated } = this.props;

        if (authenticated === true) {
            return <Redirect to='/events' />
        }

        if (authenticating === true) {
            return <div>Logging in...</div>
        }

        return (
            <div>
                <ButtonBar>
                    <Button outline color="secondary" onClick={this.props.history.goBack}>Back</Button>
                </ButtonBar>
                <ErrorAlert error={authenticationError} id="authenticationError" />
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.startLogin} id="loginForm">
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" required />
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