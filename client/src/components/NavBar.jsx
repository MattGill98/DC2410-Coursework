import React from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';

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
            <NavbarBrand href="/">{username}</NavbarBrand>:
            <NavbarBrand href="/">DC2410 Coursework</NavbarBrand>}
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink href="/events">Events</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/login">Login</NavLink>
                </NavItem>
            </Nav>
        </Collapse>
    </Navbar>
);

export default connect(mapStateToProps)(NavBar);