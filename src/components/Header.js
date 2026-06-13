import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import './Header.css';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <strong>SNSS Admin Panel</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link
                            as={Link}
                            to="/"
                            active={location.pathname === '/'}
                        >
                            Blogs
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/news"
                            active={location.pathname === '/news'}
                        >
                            News
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/articles"
                            active={location.pathname === '/articles'}
                        >
                            Articles
                        </Nav.Link>
                        <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={handleLogout}
                            style={{ marginLeft: '16px', fontWeight: '600' }}
                        >
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
