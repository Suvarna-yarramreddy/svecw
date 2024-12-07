import React, { useState, useEffect } from 'react';
import { useFaculty } from "./facultyContext";

const PatentsPage = () => {
    const [patents, setPatents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { faculty_id } = useFaculty();

    useEffect(() => {
        const fetchPatents = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5001/getPatents/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    setError(errorText);
                    throw new Error('Failed to fetch patents');
                }

                const data = await response.json();
                setPatents(data);
            } catch (error) {
                console.error("Error fetching patents:", error);
                setError("Error fetching patents.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatents();
    }, [faculty_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>Your Patents</h1>

            {patents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {patents.map(pat => (
                        <div
                            key={pat.patent_id}
                            style={{
                                padding: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#fff',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <p><strong>Nature of Application:</strong> {pat.category || "N/A"}</p>
                            <p><strong>Type of Application:</strong> {pat.iprType || "N/A"}</p>
                            <p><strong>Application Number:</strong> {pat.applicationNumber || "N/A"}</p>
                            <p><strong>Applicant Name:</strong> {pat.applicantName || "N/A"}</p>
                            <p><strong>Department:</strong> {pat.department || "N/A"}</p>
                            <p><strong>Filing Date:</strong> {pat.filingDate || "N/A"}</p>
                            <p><strong>Invention Title:</strong> {pat.inventionTitle || "N/A"}</p>
                            <p><strong>Number of Inventors:</strong> {pat.numOfInventors || "N/A"}</p>
                            <p><strong>Inventors:</strong> {pat.inventors || "N/A"}</p>
                            <p><strong>Status:</strong> {pat.status || "N/A"}</p>
                            <p><strong>Date of Publication:</strong> {pat.dateOfPublished || "N/A"}</p>
                            <p><strong>Date of Grant:</strong> {pat.dateOfGranted || "N/A"}</p>
                            {pat.proofOfPatent && (
                                <div>
                                    <strong>Proof of Patent:</strong>
                                    {pat.proofOfPatent.startsWith('data:image/') ? (
                                        <img 
                                            src={pat.proofOfPatent} 
                                            alt="Proof of Patent" 
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
                                        />
                                    ) : pat.proofOfPatent.startsWith('data:application/pdf') ? (
                                        <iframe
                                            src={pat.proofOfPatent}
                                            width="100%"
                                            height="500px"
                                            style={{ border: 'none' }}
                                            title="Proof of Patent PDF"
                                        ></iframe>
                                    ) : (
                                        <a
                                            href={pat.proofOfPatent}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#007bff' }}
                                        >
                                            View Proof
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '18px', color: '#555', textAlign: 'center' }}>No Patents available. Please check again later.</p>
            )}
        </div>
    );
};

export default PatentsPage;
