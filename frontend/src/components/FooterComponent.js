import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/FooterComponent.css";

const FooterComponent = () => {
  return (
    <footer className="footer bg-beta py-3 mt-3">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <span className="text-light">
              &copy; {new Date().getFullYear()} Beta Conseils 2001 -{" "}
              {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
