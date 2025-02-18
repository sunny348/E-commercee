import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import CustomToast from '../CustomToast';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();
            if (data.success) {
                setUsers(users.map(user => 
                    user.id === userId ? { ...user, role: newRole } : user
                ));
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-user-shield"
                        title="Role Updated"
                        message={`User role changed to ${newRole}`}
                    />
                ), {
                    duration: false,
                    position: 'bottom-right'
                });
            }
        } catch (error) {
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    iconClass="fas fa-exclamation-circle"
                    title="Error"
                    message="Failed to update user role"
                />
            ), {
                duration: false,
                position: 'bottom-right'
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setUsers(users.filter(user => user.id !== userId));
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-user-minus"
                        title="User Deleted"
                        message="User has been removed successfully"
                    />
                ), {
                    duration: false,
                    position: 'bottom-right'
                });
            }
        } catch (error) {
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    iconClass="fas fa-exclamation-circle"
                    title="Error"
                    message="Failed to delete user"
                />
            ), {
                duration: false,
                position: 'bottom-right'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                    user.role === 'admin' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    className="text-gray-400 hover:text-purple-600 mx-2"
                                    onClick={() => handleToggleRole(user.id, user.role)}
                                    title={`Change role to ${user.role === 'admin' ? 'user' : 'admin'}`}
                                >
                                    <i className="fas fa-user-shield"></i>
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-600 mx-2"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Delete user"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable; 