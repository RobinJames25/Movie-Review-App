import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; 
import MovieDataService from '../services/movies';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

const AddReview = (props) => {
    const { id } = useParams(); 
    const location = useLocation(); 
    const navigate = useNavigate();  

    const editing = location.state?.currentReview ? true : false;  
    const [review, setReview] = useState(editing ? location.state.currentReview.review : "");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (editing && location.state.currentReview) {
            setReview(location.state.currentReview.review);
        }
    }, [editing, location.state]);

    const onChangeReview = (e) => {
        setReview(e.target.value);
    };

    const saveReview = () => {
        if (!props.user) {
            alert("You must be logged in to submit a review!");
            return;
        }

        const data = {
            review: review,
            name: props.user.name,
            user_id: props.user.id,
            movie_id: id,
        };

        if (editing) {
            // ✅ Ensure review_id is set correctly
            data.review_id = location.state.currentReview._id;
            MovieDataService.updateReview(data)
                .then(() => {
                    setSubmitted(true);
                })
                .catch((e) => {
                    console.log("Error updating review:", e);
                });
        } else {
            MovieDataService.createReview(data)
                .then(() => {
                    setSubmitted(true);
                })
                .catch((e) => {
                    console.log("Error creating review:", e);
                });
        }
    };

    return (
        <div className="container mt-4">
            {submitted ? (
                <div>
                    <h4>Review {editing ? "updated" : "submitted"} successfully!</h4>
                    <Button variant="primary" onClick={() => navigate(`/movies/${id}`)}>
                        Back to Movie
                    </Button>
                </div>
            ) : (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            required
                            value={review}
                            onChange={onChangeReview}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={saveReview}>
                        Submit
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default AddReview;
