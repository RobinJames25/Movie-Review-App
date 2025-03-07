import React, { useEffect, useState } from "react";
import MovieDataService from '../services/movies';
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchRating, setSearchRating] = useState("");
    const [ratings, setRatings] = useState(["All Ratings"]);
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentSearchMode, setCurrentSearchMode] = useState("");

    useEffect(() => {
        retrieveMovies();
        retrieveRatings();
    }, []);

    useEffect(() => {
        retrieveNextPage();
    }, [currentPage]);

    const retrieveNextPage = () => {
        if (currentSearchMode === "findByTitle") {
            findByTitle();
        } else if (currentSearchMode === "findByRating") {
            findByRating();
        } else {
            retrieveMovies();
        }
    };

    const retrieveMovies = () => {
        setCurrentSearchMode("");
        MovieDataService.getAll(currentPage)
            .then(response => {
                setMovies(response.data.movies); // Replace previous movies
                setEntriesPerPage(response.data.entries_per_page);
            })
            .catch(e => {
                console.error("Error fetching movies:", e);
            });
    };

    const retrieveRatings = () => {
        MovieDataService.getRatings()
            .then(response => {
                setRatings(["All Ratings", ...response.data]);
            })
            .catch(e => {
                console.error("Error fetching ratings:", e);
            });
    };

    const onChangeSearchTitle = (e) => setSearchTitle(e.target.value);
    const onChangeSearchRating = (e) => setSearchRating(e.target.value);

    const find = (query, by) => {
        MovieDataService.find(query, by, currentPage)
            .then(response => {
                setMovies(response.data.movies); // Replace previous movies
            })
            .catch(e => {
                console.error("Error searching movies:", e);
            });
    };

    const findByTitle = () => {
        setCurrentSearchMode("findByTitle");
        find(searchTitle, "title");
    };

    const findByRating = () => {
        setCurrentSearchMode("findByRating");
        if (searchRating === "All Ratings") {
            retrieveMovies();
        } else {
            find(searchRating, "rated");
        }
    };

    return (
        <Container className="mt-4">
            <Form>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Search by title"
                                value={searchTitle}
                                onChange={onChangeSearchTitle}
                            />
                        </Form.Group>
                        <Button className="mt-2" variant="primary" onClick={findByTitle}>
                            Search
                        </Button>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Control as="select" onChange={onChangeSearchRating} value={searchRating}>
                                {ratings.map((rating, index) => (
                                    <option key={index} value={rating}>{rating}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button className="mt-2" variant="primary" onClick={findByRating}>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>
            
            <Row>
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <Col key={movie._id} md={4} className="mb-4">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={movie.poster || "default-poster.jpg"} 
                                    alt={movie.title} 
                                />
                                <Card.Body>
                                    <Card.Title>{movie.title}</Card.Title>
                                    <Card.Text>Rating: {movie.rated}</Card.Text>
                                    <Card.Text>{movie.plot}</Card.Text>
                                    <Link to={`/movies/${movie._id}`} className="btn btn-primary">
                                        View Reviews
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center mt-4">No movies found.</p>
                )}
            </Row>
            <br />
            <p>Showing page: {currentPage + 1}</p>
            <Button
                variant="primary"
                onClick={() => setCurrentPage(prev => prev + 1)}
            >
                Next Page
            </Button>
        </Container>
    );
};

export default MoviesList;
