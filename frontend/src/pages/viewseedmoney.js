import React, { useState, useEffect } from 'react';
import { useFaculty } from './facultyContext';

const ViewSeedMoney = () => {
    const [seedMoney, setSeedMoney] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { faculty_id } = useFaculty();

    useEffect(() => {
        const fetchSeedMoney = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5002/getSeedMoney/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    setError(errorText);
                    throw new Error('Failed to fetch seed money');
                }

                const data = await response.json();
                setSeedMoney(data);
            } catch (error) {
                console.error('Error fetching seed money:', error);
                setError('Error fetching seed money.');
            } finally {
                setLoading(false);
            }
        };

        fetchSeedMoney();
    }, [faculty_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>
                Your Seed Money
            </h1>

            {seedMoney.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {seedMoney.map((seed,index) => (
                        <div
                            key={seed.seed_id || index}
                            style={{
                                padding: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#fff',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <p><strong>Financial Year:</strong> {seed.financialYear || 'N/A'}</p>
                            <p><strong>Faculty Name:</strong> {seed.facultyName || 'N/A'}</p>
                            <p><strong>Department:</strong> {seed.department || 'N/A'}</p>
                            <p><strong>Number of students:</strong> {seed.numStudents || 'N/A'}</p>
                            <p><strong>Project Title:</strong> {seed.projectTitle || 'N/A'}</p>
                            <p><strong>Amount Sanctioned:</strong> {seed.amountSanctioned || 'N/A'}</p>
                            <p><strong>Amount Received:</strong> {seed.amountReceived || 'N/A'}</p>
                            <p><strong>Objectives:</strong> {seed.objectives || 'N/A'}</p>
                            <p><strong>Outcomes:</strong> {seed.outcomes || 'N/A'}</p>
                            {seed.proof && (
                                <div>
                                    <strong>Proof of Funding:</strong>
                                    {seed.proof.startsWith('data:image/') ? (
                                        <img
                                            src={seed.proof}
                                            alt="Proof of Seed Money"
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                                        />
                                    ) : seed.proof.startsWith('data:application/pdf') ? (
                                        <iframe
                                            src={seed.proof}
                                            width="100%"
                                            height="500px"
                                            style={{ border: 'none' }}
                                            title="Proof of Seed Money PDF"
                                        ></iframe>
                                    ) : (
                                        <a
                                            href={seed.proof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#007bff' }}
                                        >
                                            View Proof
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Display Students Data */}
                            {seed.students && seed.students.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    <h5>Students Involved:</h5>
                                    <ul>
                                        {seed.students.map((student, index) => (
                                            <li key={index}>
                                                <strong>Registration:</strong> {student.registration || 'N/A'} | <strong>Name:</strong> {student.name || 'N/A'}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '18px', color: '#555', textAlign: 'center' }}>
                    No Seed Money records available. Please check again later.
                </p>
            )}
        </div>
    );
};

export default ViewSeedMoney;
