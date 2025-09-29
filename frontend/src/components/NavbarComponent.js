import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaFacebook, FaLinkedin } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles//NavbarComponent.css";

import { Link } from "react-router-dom";

const NavbarComponent = () => {
  return (
    <Navbar className="navbar navbar-expand-md navbar-light bg-light shadow-sm py-0">
      <Container>
        <Navbar.Brand className="">
          <FaHome style={{ color: "#5A5C96" }} />
          <Link
            to="/"
            className=" custom-link ms-1"
            style={{
              fontSize: "16px",
              textDecoration: "none",
              color: "#5A5C96",
            }}
          >
            Accueil
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarSupportedContent"
          className=""
          style={{ color: "#5A5C96" }}
        />
        <Navbar.Collapse
          id="navbarSupportedContent"
          className="justify-content-end"
        >
          <Nav className="" style={{ color: "#5A5C96" }}>
            <Nav.Link
              className="nav-link-custom"
              style={{ textDecoration: "none", color: "#5A5C96" }}
            >
              Suivez-nous
            </Nav.Link>

            <Nav.Link
              href="//www.facebook.com/Betamr-101236631486169"
              target="_blank"
              className="nav-link-custom ml-2"
            >
              <FaFacebook className="grow" />
            </Nav.Link>
            <Nav.Link
              href="//www.linkedin.com/company/beta-mr/"
              target="_blank"
              className="nav-link-custom ml-2"
            >
              <FaLinkedin className="grow" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
