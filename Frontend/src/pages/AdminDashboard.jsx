import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaUser, FaGraduationCap, FaBriefcase, FaMapMarkerAlt,
    FaCheck, FaTimes, FaEye, FaFileAlt, FaSearch, FaFilter
} from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // State variables
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    // Fetch experts data
    useEffect(() => {
        const fetchExperts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:9000/api/farmwise/expert', {
                    withCredentials: true
                });
                console.log(response.data.data)
                if (response.data && response.data.data) {
                    setExperts(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching experts:', err);
                setError('Failed to load expert verification requests');
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, []);

    // Handle verification status update
    const handleUpdateVerification = async (expertId, verified) => {
        try {
            await axios.patch(`http://localhost:9000/api/farmwise/expert/${expertId}/verify`,
                { verified },
                { withCredentials: true }
            );

            // Update the local state to reflect changes
            setExperts(prevExperts =>
                prevExperts.map(expert =>
                    expert._id === expertId ? { ...expert, verified } : expert
                )
            );

            // Close modal if open
            if (showDetailsModal && selectedExpert?._id === expertId) {
                setShowDetailsModal(false);
            }

        } catch (err) {
            console.error('Error updating verification status:', err);
            alert('Failed to update verification status');
        }
    };

    // Filter experts based on active tab and search term
    const filteredExperts = experts.filter(expert => {
        if (activeTab === 'pending' && expert.verified === true) return false;
        if (activeTab === 'verified' && expert.verified === false) return false;

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                expert.userId?.username?.toLowerCase().includes(term) ||
                expert.userId?.email?.toLowerCase().includes(term) ||
                expert.degreeOrCirtification?.toLowerCase().includes(term) ||
                expert.city?.toLowerCase().includes(term) ||
                expert.country?.toLowerCase().includes(term)
            );
        }

        return true;
    });

    // View expert details and document
    const handleViewDetails = (expert) => {
        setSelectedExpert(expert);
        setShowDetailsModal(true);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center pt-24">
                <div className="text-center">
                    <div className="animate-spin h-10 w-10 rounded-full border-4 border-green-500 border-t-transparent"></div>
                    <p className="text-green-700 mt-4">Loading expert verification dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-gray-50 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow rounded-xl p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Expert Verification Dashboard</h1>
                    <p className="text-gray-600">View and manage expert verification requests</p>
                </div>

                {/* Filter and Search */}
                <div className="bg-white shadow rounded-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setActiveTab('verified')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Verified
                            </button>
                        </div>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search experts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Experts List */}
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    {error && (
                        <div className="p-4 text-center text-red-500 bg-red-50">
                            {error}
                        </div>
                    )}

                    {!error && filteredExperts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No expert verification requests found in this category.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredExperts.map((expert) => (
                                        <tr key={expert._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <FaUser className="text-green-500" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{expert.userId?.username || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500">{expert.userId?.email || 'No email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaGraduationCap className="text-green-500 mr-2" />
                                                    <span className="text-sm text-gray-900">{expert.degreeOrCirtification || 'Not specified'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaBriefcase className="text-green-500 mr-2" />
                                                    <span className="text-sm text-gray-900">{expert.experience || 0} years</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaMapMarkerAlt className="text-green-500 mr-2" />
                                                    <span className="text-sm text-gray-900">
                                                        {expert.city && expert.country
                                                            ? `${expert.city}, ${expert.country}`
                                                            : 'Location not specified'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${expert.verified === true ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                    {expert.verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(expert)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    {/* Only show action buttons to admin users */}
                                                    {user?.userType === 'admin' && (
                                                        <>
                                                            {!expert.verified && (
                                                                <button
                                                                    onClick={() => handleUpdateVerification(expert._id, true)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                    title="Approve"
                                                                >
                                                                    <FaCheck />
                                                                </button>
                                                            )}
                                                            {expert.verified && (
                                                                <button
                                                                    onClick={() => handleUpdateVerification(expert._id, false)}
                                                                    className="text-yellow-600 hover:text-yellow-900"
                                                                    title="Set as Pending"
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Expert Details Modal */}
            {showDetailsModal && selectedExpert && (
                <div className="fixed inset-0 backdrop-blur bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Expert Application Details</h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Personal Information</h4>
                                <p className="mb-2"><span className="font-medium">Name:</span> {selectedExpert.userId?.username || 'N/A'}</p>
                                <p className="mb-2"><span className="font-medium">Email:</span> {selectedExpert.userId?.email || 'N/A'}</p>
                                <p className="mb-2"><span className="font-medium">Degree/Certification:</span> {selectedExpert.degreeOrCirtification || 'N/A'}</p>
                                <p className="mb-2"><span className="font-medium">Experience:</span> {selectedExpert.experience || 0} years</p>
                                <p className="mb-2"><span className="font-medium">Location:</span> {selectedExpert.city && selectedExpert.country ? `${selectedExpert.city}, ${selectedExpert.country}` : 'N/A'}</p>
                                <p className="mb-2"><span className="font-medium">Status:</span> {selectedExpert.verified ? 'Verified' : 'Pending'}</p>

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">About</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedExpert.about || 'No information provided'}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-4">Proof Document</h4>
                                {selectedExpert.proofDocument ? (
                                    <div className="border p-4 rounded-lg">
                                        {selectedExpert.proofDocument.includes('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded">
                                                <FaFileAlt className="text-4xl text-red-500 mb-2" />
                                                <p className="text-gray-700 mb-2">PDF Document</p>
                                                <a
                                                    href={selectedExpert.proofDocument}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <img
                                                    src={selectedExpert.proofDocument}
                                                    alt="Proof Document"
                                                    className="max-w-full h-auto rounded-lg shadow-md mb-2"
                                                    onError={(e) => {
                                                        if (e.target instanceof HTMLImageElement) {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/400x300?text=Document+Not+Available';
                                                        }
                                                    }}
                                                />
                                                <a
                                                    href={selectedExpert.proofDocument}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Open in New Tab
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No proof document provided</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t flex justify-end space-x-3">
                            {/* Only show verification buttons to admin users */}
                            {user?.userType === 'admin' && (
                                <>
                                    {!selectedExpert.verified ? (
                                        <button
                                            onClick={() => handleUpdateVerification(selectedExpert._id, true)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateVerification(selectedExpert._id, false)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                        >
                                            Set as Pending
                                        </button>
                                    )}
                                </>
                            )}
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard; 