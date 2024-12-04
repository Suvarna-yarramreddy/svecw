import React, { useState, useEffect } from 'react';
import { useFaculty } from "./facultyContext";

const PatentsPage = () => {
    const [Patents, setPatents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { faculty_id } = useFaculty();

    const bufferToBase64 = (buffer) => {
        const binaryString = String.fromCharCode.apply(null, new Uint8Array(buffer));
        return btoa(binaryString);
    };

    useEffect(() => {
        const fetchPatents = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5001/getPatents/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    setError(errorText);
                    throw new Error('Failed to fetch Patents');
                }

                const data = await response.json();
                data.forEach((pat) => {
                    if (pat.proofOfPatent) {
                        try {
                            const buffer = new Uint8Array(pat.proofOfPatent);
                            const mimeType = 'application/pdf'; // For now, assuming it's a PDF
                            pat.proofOfPatent = `data:${mimeType};base64,${bufferToBase64(buffer)}`;
                        } catch (error) {
                            console.error('Error processing proofOfPatent:', error);
                        }
                    }
                });

                setPatents(data);
            } catch (error) {
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

            {Patents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {Patents.map(pat => (
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
                            {pat.category && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Nature of Application:</span> {pat.category}
                                    </p>
                                </div>
                            )}
                            {pat.iprType && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Type of Application:</span> {pat.iprType}
                                    </p>
                                </div>
                            )}
                            {pat.applicationNumber && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Application Number:</span> {pat.applicationNumber}
                                    </p>
                                </div>
                            )}
                            {pat.applicantName && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Applicant Name:</span> {pat.applicantName}
                                    </p>
                                </div>
                            )}
                            {pat.department && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Department:</span> {pat.department}
                                    </p>
                                </div>
                            )}
                            {pat.filingDate && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Filing Date:</span> {pat.filingDate}
                                    </p>
                                </div>
                            )}
                            {pat.inventionTitle && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Invention Title:</span> {pat.inventionTitle}
                                    </p>
                                </div>
                            )}
                            {pat.numOfInventors !== null && pat.numOfInventors !== undefined && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Number of Inventors:</span> {pat.numOfInventors}
                                    </p>
                                </div>
                            )}

                            <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                <span style={{ color: '#333' }}>Inventors:</span> 
                                {Array.isArray(pat.inventors) ? pat.inventors.join(', ') : 'No Inventors Available'}
                            </p>

                            {pat.status && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Status:</span> {pat.status}
                                    </p>
                                </div>
                            )}
                            {pat.dateOfPublished && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Date of Publication:</span> {pat.dateOfPublished}
                                    </p>
                                </div>
                            )}
                            {pat.dateOfGranted && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
                                        <span style={{ color: '#333' }}>Date of Grant:</span> {pat.dateOfGranted}
                                    </p>
                                </div>
                            )}
                            {pat.proofOfPatent && (
    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
        <p style={{ flex: '1 1 45%', fontWeight: 'normal', color: '#555', fontSize: '16px' }}>
            <span style={{ color: '#333' }}>Proof of Patent:</span>
            <a
                href={pat.proofOfPatent}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff' }}
            >
                View Proof
            </a>
        </p>
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
