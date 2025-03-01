import React from "react";
import { Container, Card, Accordion, Image } from "react-bootstrap";

const HomePage = () => {
    return (
        <Container className="p-3">
            <Card className="p-4 shadow-lg">
                <Card.Header as="h2" className="text-center">
                    Welcome to the EV Charging Station Registry
                </Card.Header>
            
                <Card.Body>
                    <Card.Text>
                        Our platform offers a blockchain-based registry for <b>Electric Vehicle Charging Stations</b>, ensuring secure, transparent, and efficient management of charging data.
                    </Card.Text>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>About the Platform</Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    <li>
                                        <b>Security:</b> Data integrity is maintained through blockchain technology, preventing unauthorized alterations.
                                    </li>
                                    <li>
                                        <b>Transparency:</b> An open platform where all participants can access and verify information.
                                    </li>
                                    <li>
                                        <b>Efficiency:</b> Streamlined processes for tracking and managing charging station data.
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>How It Works</Accordion.Header>
                            <Accordion.Body>
                                <p>
                                    The system involves key entities:
                                </p>
                                <ul>
                                    <li>
                                        <b>Operators:</b> Manage and provide charging stations.
                                    </li>
                                    <li>
                                        <b>Energy Aggregators (EAG):</b> Handle energy distribution and transaction validation.
                                    </li>
                                    <li>
                                        <b>Users/EV Owners:</b> Access charging services through registered stations.
                                    </li>
                                </ul>
                                <p>
                                    The process includes initialization, registration, authentication, and charging phases, ensuring a seamless experience for all users.
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                    Join us in promoting a fair and efficient EV charging ecosystem.
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default HomePage;
