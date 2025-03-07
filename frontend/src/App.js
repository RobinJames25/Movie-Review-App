import React from "react";
import { Routes, Route, Link } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import AddReview from "./components/add-review";
import MoviesList from "./components/movies-list";
import Movie from "./components/movie";
import Login from "./components/login";
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar";


function App() {
  const [user, setUser] = React.useState(null)

  async function login(user = null) {
    setUser(user)
  }

  async function logout(){
    setUser(null)
  }

  return(
    <div>
      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
              {user ? (
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              ): (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movies" element={<MoviesList />} />

          <Route path="/movies/:id/review" element={<AddReview user={user} />}/>

          <Route path="/movies/:id" element={<Movie user={user} />} />

          <Route path="/login" element={<Login login={login}/>} />
        </Routes>

      </div>
    </div>
  )
}

export default App