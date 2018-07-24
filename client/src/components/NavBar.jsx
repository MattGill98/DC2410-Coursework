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

const NavBar = ({ username }) => (
    <Navbar color="light" light expand="md">
        {(username)?
            <NavbarBrand tag={Link} to="/">Hello {username}!</NavbarBrand>:
            <NavbarBrand tag={Link} to="/">DC2410 Coursework</NavbarBrand>
        }
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={state.isOpen} navbar>
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
        </Collapse>
    </Navbar>
);

export default connect(mapStateToProps)(NavBar);