import { logout } from 'actions/userActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

const state = {
    isOpen: false
};

function toggle() {
    state.isOpen = !state.isOpen;
}

const mapStateToProps = state => {
    return {
        username: state.User.username
    };
};

function NavItems(props) {
    if (!props.username) {
        return (
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/events">Events</NavLink>
                </NavItem>
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
                <NavLink tag={Link} to="/events">Events</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} to="#" onClick={e => {props.dispatch(logout())}}>Logout</NavLink>
            </NavItem>
        </Nav>
    );
}

const NavBar = ({ dispatch, username }) => (
    <Navbar color="light" light expand="md">
        {(username) ?
            <NavbarBrand tag={Link} to="/">Hello {username}!</NavbarBrand> :
            <NavbarBrand tag={Link} to="/">DC2410 Coursework</NavbarBrand>
        }
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={state.isOpen} navbar>
            <NavItems username={username} dispatch={dispatch} />
        </Collapse>
    </Navbar>
);

export default connect(mapStateToProps)(NavBar);