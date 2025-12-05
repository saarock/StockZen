import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { userService } from '../../services';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff } from 'react-icons/fa'; // React Icons
import useUser from '../../hooks/useUser';
const ManageUsersComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);
    const { user } = useUser()
    const usersPerPage = 10;


    useEffect(() => {
        async function getUsers() {
            try {
                const usersData = await userService.getAllUsers(usersPerPage, currentPage);
                setUsers(usersData.data.users);
                setTotalPages(usersData.data.totalPages);
            } catch (error) {
                toast.error(error.message || "Something went wrong while fetching the users");
            }
        }
        getUsers();
    }, [currentPage]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    // Toggle user active status
    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const updatedStatus = !currentStatus; // Toggle the status
            await userService.updateUserStatus(userId, updatedStatus);
            // Update the local users state to reflect the change
            setUsers(users.map(user => user._id === userId ? { ...user, isActive: updatedStatus } : user));
            toast.success(`User account ${updatedStatus ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            toast.error(error.message || "Failed to update user status");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-left text-white">
                            <th className="px-6 py-3 font-semibold">ID</th>
                            <th className="px-6 py-3 font-semibold">Name</th>
                            <th className="px-6 py-3 font-semibold">Email</th>
                            <th className="px-6 py-3 font-semibold">Role</th>
                            <th className="px-6 py-3 font-semibold">Phone Number</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Action</th> {/* Added Action column */}
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((_user) => (
                            <tr key={user._id} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-600">{_user._id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{_user.fullName}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{_user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{_user.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{_user.phoneNumber}</td>
                                <td className="px-6 py-4 text-sm">
                                    {_user.isActive ? (
                                        <span className="text-green-500"><FaCheckCircle className="inline mr-1" /> Active</span>
                                    ) : (
                                        <span className="text-red-500"><FaTimesCircle className="inline mr-1" /> Inactive</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleToggleStatus(_user._id, _user.isActive)}
                                        disabled={user?._id === _user._id}
                                        style={{
                                            cursor: user?._id === _user._id ? "not-allowed" : "pointer"
                                        }}
                                        className={`px-4 py-2 text-white rounded-md shadow-md ${_user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} ${user?._id === _user._id ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        {_user.isActive ? (
                                            <FaToggleOff className="mr-2" />
                                        ) : (
                                            <FaToggleOn className="mr-2" />
                                        )}
                                        {_user.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-300 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Previous
                </button>
                <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-300 flex items-center"
                >
                    Next <FaArrowRight className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default ManageUsersComponent;
