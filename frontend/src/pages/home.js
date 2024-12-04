import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useEffect, useState } from "react";
const HomePage = () => {
  // Hardcoded statistics
  const [facultyName, setFacultyName] = useState("");
    const [facultyId, setFacultyId] = useState("");
    useEffect(() => {
      // Retrieve faculty_name and faculty_id from localStorage
      const name = localStorage.getItem("faculty_name");
      const id = localStorage.getItem("faculty_id");

      setFacultyName(name);
      setFacultyId(id);
  }, []);
  const stats = {
    total_faculties: 20,
    total_courses: 50,
    total_publications: 100
  };

  return (
    <Container fluid>
      <Row className="d-flex">
        {/* Main content without Sidebar */}
        <Col xs={12} md={12} className="main-content" style={{ paddingTop: '20px' }}>
          <h2>Welcome, {facultyName}!</h2>
          <p>This is your dashboard with key statistics.</p>
          <Row>
            {/* Display total faculties */}
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Total Faculties</Card.Title>
                  <Card.Text>{stats.total_faculties}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* Display total courses */}
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Total Courses</Card.Title>
                  <Card.Text>{stats.total_courses}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* Display total publications */}
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Total Publications</Card.Title>
                  <Card.Text>{stats.total_publications}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Other content can go here */}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
