import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const Login = (props) => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();  

    const onChangeName = (e) => setName(e.target.value);
    const onChangeId = (e) => setId(e.target.value);

    const login = () => {
        if (props.login) {
            props.login({ name: name, id: id });
        }
        navigate("/");
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card className="p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Login</h3>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your ID"
                                value={id}
                                onChange={onChangeId}
                                className="p-2"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your Name"
                                value={name}
                                onChange={onChangeName}
                                className="p-2"
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            onClick={login} 
                            className="w-100"
                        >
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
