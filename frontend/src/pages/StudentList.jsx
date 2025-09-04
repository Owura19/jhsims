// src/pages/StudentList.jsx

import { useState, useEffect } from 'react';
import api from '../services/api';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formOpen, setFormOpen] = useState(false);

    // Form state for Add
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: ''
    });

    // Edit state
    const [editStudent, setEditStudent] = useState(null);

    // Delete state
    const [deletingId, setDeletingId] = useState(null);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');

    // Submission feedback
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/students', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStudents(res.data);
            } catch (err) {
                setError('Failed to load students. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Handle Add Form Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Add Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        try {
            const res = await api.post('/students', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setStudents([res.data, ...students]);
            setSubmitSuccess('Student added successfully!');

            // Reset form
            setFormData({
                first_name: '',
                last_name: '',
                date_of_birth: '',
                gender: '',
                address: '',
                phone: '',
                email: ''
            });

            // Close form after 2 seconds
            setTimeout(() => {
                setFormOpen(false);
                setSubmitSuccess('');
            }, 2000);

        } catch (err) {
            setSubmitError(err.response?.data?.error || 'Failed to add student');
        }
    };

    // Handle Update (Edit)
    const handleUpdate = async (e, id) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        try {
            const res = await api.put(`/students/${id}`, editStudent, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setStudents(students.map(s => s.id === id ? res.data : s));
            setEditStudent(null);
            setSubmitSuccess('Student updated successfully!');
        } catch (err) {
            setSubmitError(err.response?.data?.error || 'Failed to update student');
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        setDeletingId(id);
        setSubmitError('');
        try {
            await api.delete(`/students/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setStudents(students.filter(s => s.id !== id));
            setSubmitSuccess('Student deleted (marked inactive).');
        } catch (err) {
            setSubmitError(err.response?.data?.error || 'Failed to delete student');
        } finally {
            setDeletingId(null);
        }
    };

    // Filter and search logic
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesGender = filterGender ? student.gender === filterGender : true;

        return matchesSearch && matchesGender;
    });

    return (
        <div>
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
                <button
                    onClick={() => setFormOpen(!formOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                >
                    {formOpen ? 'Cancel' : '+ Add Student'}
                </button>
            </div>

            {/* Success Message */}
            {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {submitSuccess}
                </div>
            )}

            {/* Add Student Form */}
            {formOpen && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Student</h3>

                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
                            >
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search by name or email</label>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by gender</label>
                    <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                    >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* Error from fetch */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Loading or Table */}
            {loading ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">Loading students...</div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No students match your search or filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{student.first_name} {student.last_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.email || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.phone || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setEditStudent({ ...student })}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                disabled={deletingId === student.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                {deletingId === student.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Form */}
            {editStudent && (
                <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Student</h3>

                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={(e) => handleUpdate(e, editStudent.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={editStudent.first_name}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, first_name: e.target.value })
                                }
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={editStudent.last_name}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, last_name: e.target.value })
                                }
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                value={editStudent.date_of_birth || ''}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, date_of_birth: e.target.value })
                                }
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                value={editStudent.gender}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, gender: e.target.value })
                                }
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={editStudent.email || ''}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, email: e.target.value })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                value={editStudent.phone || ''}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, phone: e.target.value })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={editStudent.address || ''}
                                onChange={(e) =>
                                    setEditStudent({ ...editStudent, address: e.target.value })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow mr-2"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditStudent(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md shadow"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}