import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MovieDataService from "../services/movies";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

const Movie = (props) => {
    const { id } = useParams();  // ✅ Use useParams() for React Router v6
    const [movie, setMovie] = useState({
        title: "",
        rated: "",
        plot: "",
        poster: "",
        reviews: []
    });

    useEffect(() => {
        getMovie(id);
    }, [id]);

    const getMovie = (id) => {
        MovieDataService.get(id)
            .then((response) => {
                setMovie(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.error("Error fetching movie:", e);
            });
    };
    const deleteReview = (reviewId, index) => {
        MovieDataService.deleteReview(reviewId, props.user.id)
        .then(response => {
            setMovie((prevState) => {
                prevState.reviews.splice(index, 1)
                return({
                    ...prevState
                })
            })
        })
        .catch(e => {
            console.log(e)
        })
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col md={4}>
                    <Image
                        src={movie.poster || "default-poster.jpg"}
                        fluid
                        alt={movie.title}
                    />
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">{movie.title}</Card.Header>
                        <Card.Body>
                            <Card.Text><strong>Rating:</strong> {movie.rated}</Card.Text>
                            <Card.Text>{movie.plot}</Card.Text>
                            {props.user && (
                                <Link to={`/movies/${id}/review`} className="btn btn-primary">
                                    Add Review
                                </Link>
                            )}
                        </Card.Body>
                    </Card>
                    <br />
                    <h2>Reviews</h2>
                    {movie.reviews.length > 0 ? (
    movie.reviews.map((review, index) => (
        <Card key={index} className="mb-3">
            <Card.Body>
                <h5>{review?.name || "Anonymous"} reviewed on{" "}
                    {review?.date ? new Date(review.date).toLocaleDateString() : "Unknown date"}
                </h5>
                <p>{review?.review || "No review text provided."}</p>
                {props.user && props.user.id === review?.user_id && (
                    <Row>
                        <Col>
                            <Link
                                to={`/movies/${id}/review`}
                                state={{ currentReview: review }} // ✅ Fix navigation state
                                className="btn btn-warning"
                            >
                                Edit
                            </Link>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={() => deleteReview(review._id, index)}>
                                Delete
                            </Button>
                        </Col>
                    </Row>
                )}
            </Card.Body>
        </Card>
    ))
) : (
    <p>No reviews yet.</p>
)}

                </Col>
            </Row>
        </Container>
    );
};

export default Movie;
