import React from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

const state = {
    isOpen: false
};

function toggle() {
    state.isOpen = !state.isOpen;
}

const NavBar = ({ event }) => (
    <Navbar color="light" light expand="md">
        <NavbarBrand href="/">DC2410 Coursework</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink href="/events/">Events</NavLink>
                </NavItem>
            </Nav>
        </Collapse>
    </Navbar>
);

export default NavBar;