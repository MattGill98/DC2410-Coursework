import { logout } from 'actions/userActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

const mapStateToProps = state => {
    return {
        username: state.User.username,
        role: state.User.role
    };
};

function NavItems(props) {
    if (!props.username) {
        return (
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/login">Login</NavLink>
                </NavItem>
            </Nav>
        );
    }

    return (
        <Nav className="ml-auto" navbar>
            <NavItem>
                <NavLink tag={Link} to="/" onClick={e => {props.dispatch(logout())}}>Logout</NavLink>
            </NavItem>
        </Nav>
    );
}

function WelcomeMessage(props) {
    if (!props.username || !props.role) {
        return null;
    }

    return (
        <span className="navbar-text">
            Hello {props.username}! ({props.role})
        </span>
    );
}

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const {dispatch, username, role} = this.props;

        return (
            <Navbar color="light" light expand="md" className="text-center" >
                <NavbarBrand tag={Link} to="/">DC2410 Coursework</NavbarBrand>
                <WelcomeMessage username={username} role={role} />
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <NavItems dispatch={dispatch} username={username} role={role} />
                </Collapse>
            </Navbar>
        );
    }
};

export default connect(mapStateToProps)(NavBar);