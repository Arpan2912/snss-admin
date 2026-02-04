import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const location = useLocation();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <strong>SNSS Admin Panel</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            active={location.pathname === '/'}
                        >
                            Blogs
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/articles"
                            active={location.pathname === '/articles'}
                        >
                            Articles
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
