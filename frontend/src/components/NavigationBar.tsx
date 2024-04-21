import "./NavigationBar.css";

function NavigationBar() {
  return (
    <div className="navContainer" style={{ width: "100%" }}>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#5E1675", margin: "5px" }}
      >
        <div className="container-fluid">
          <a
            className="navbar-brand ms-lg-5"
            href="/"
            style={{ paddingTop: "0px" }}
          >
            Medictron
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-lg-5">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/">
                  General
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/diabetes">
                  Diabetes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/anemia">
                  Anemia
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/parkinson">
                  Parkinson
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
