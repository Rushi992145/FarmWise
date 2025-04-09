import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaStar, FaCalendarAlt, FaSearch, FaTimes, FaUser, FaFilter } from 'react-icons/fa';

const ExpertsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [bookingExpert, setBookingExpert] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');

    const specializations = ['All', 'Crop Management', 'Soil Health', 'Pest Control', 'Organic Farming', 'Irrigation'];

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://localhost:9000/api/farmwise/experts', {
                    withCredentials: true
                });
                setExperts(response.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch experts:', error);
                setError('Failed to load experts. Please try again later.');
                setLoading(false);
            }
        };

        fetchExperts();
    }, []);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please log in to book an appointment');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/api/farmwise/booking', {
                expertId: bookingExpert._id,
                date: bookingDate,
                time: bookingTime,
                message: bookingMessage
            }, {
                withCredentials: true
            });

            alert('Appointment booked successfully!');
            setBookingExpert(null);
            setBookingDate('');
            setBookingTime('');
            setBookingMessage('');
        } catch (error) {
            console.error('Failed to book appointment:', error);
            setError('Failed to book appointment. Please try again.');
        }
    };

    const startChat = async (expertId) => {
        if (!user) {
            setError('Please log in to chat with experts');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/api/farmwise/conversations', {
                recipientId: expertId
            }, {
                withCredentials: true
            });

            // Redirect to chat page
            window.location.href = '/chat';
        } catch (error) {
            console.error('Failed to start conversation:', error);
            setError('Failed to start conversation. Please try again.');
        }
    };

    const filteredExperts = experts.filter(expert => {
        const matchesSearch = expert.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expert.specialization?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
            expert.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expert.about?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialization = selectedSpecialization === 'All' ||
            expert.specialization?.includes(selectedSpecialization);

        return matchesSearch && matchesSpecialization;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold text-green-700 mb-4">Consult with Farming Experts</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Connect with verified agricultural experts specialized in various farming domains. Book consultations to get personalized advice for your farming needs.
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3"
                    >
                        <p>{error}</p>
                        <button
                            className="ml-auto text-red-500"
                            onClick={() => setError(null)}
                        >
                            Close
                        </button>
                    </motion.div>
                )}

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Search experts by name, specialization or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <FaFilter className="text-gray-600" />
                            <select
                                value={selectedSpecialization}
                                onChange={(e) => setSelectedSpecialization(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {specializations.map(specialization => (
                                    <option key={specialization} value={specialization}>
                                        {specialization}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Experts List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                        <p className="mt-4 text-xl text-green-700">Loading experts...</p>
                    </div>
                ) : filteredExperts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <p className="text-xl text-gray-600">No experts found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExperts.map((expert) => (
                            <motion.div
                                key={expert._id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <FaUser className="text-green-600 text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{expert.userId?.username}</h3>
                                            <div className="flex items-center text-yellow-500 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < 4 ? "text-yellow-500" : "text-gray-300"} />
                                                ))}
                                                <span className="ml-1 text-gray-600 text-sm">(4.0)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaGraduationCap className="text-green-600" />
                                            <span>{expert.degreeOrCirtification}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaBriefcase className="text-green-600" />
                                            <span>{expert.experience} years of experience</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaMapMarkerAlt className="text-green-600" />
                                            <span>{expert.city}, {expert.country}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Specialization</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {expert.specialization?.map((spec, index) => (
                                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">About</h4>
                                        <p className="text-gray-600 text-sm line-clamp-3">{expert.about}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setBookingExpert(expert)}
                                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaCalendarAlt />
                                            Book Consultation
                                        </button>

                                        <button
                                            onClick={() => startChat(expert.userId?._id)}
                                            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Chat Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Booking Modal */}
                {bookingExpert && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Book Consultation with {bookingExpert.userId?.username}</h3>
                                <button
                                    onClick={() => setBookingExpert(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Message</label>
                                    <textarea
                                        value={bookingMessage}
                                        onChange={(e) => setBookingMessage(e.target.value)}
                                        placeholder="Describe your farming issues or questions..."
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Confirm Booking
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertsPage; 