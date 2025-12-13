
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import userService from "../../services/userService"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaToggleOn,
  FaToggleOff,
  FaUserShield,
  FaUserMinus,
} from "react-icons/fa"
import useUser from "../../hooks/useUser"

const ManageUsersComponent = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [users, setUsers] = useState([])
  const { user } = useUser()
  const usersPerPage = 10

  useEffect(() => {
    async function getUsers() {
      try {
        const usersData = await userService.getAllUsers(usersPerPage, currentPage)
        setUsers(usersData.data.users)
        setTotalPages(usersData.data.totalPages)
      } catch (error) {
        toast.error(error.message || "Something went wrong while fetching the users")
      }
    }
    getUsers()
  }, [currentPage])

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  // Toggle user active status
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus
      await userService.updateUserStatus(userId, updatedStatus)
      setUsers(users.map((user) => (user._id === userId ? { ...user, isActive: updatedStatus } : user)))
      toast.success(`User account ${updatedStatus ? "enabled" : "disabled"} successfully`)
    } catch (error) {
      toast.error(error.message || "Failed to update user status")
    }
  }

  const handleToggleAdminRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      await userService.updateUserRole(userId, newRole)
      setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
      toast.success(`User role updated to ${newRole} successfully`)
    } catch (error) {
      toast.error(error.message || "Failed to update user role")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#101540]/5 to-transparent rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#101540]/5 to-transparent rounded-full blur-3xl -z-0" />

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#101540] to-[#101540]/70 bg-clip-text text-transparent mb-2 animate-fade-in">
              User Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Manage user accounts, permissions, and access control</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#101540] to-[#101540]/90">
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users &&
                  users.map((_user, index) => (
                    <tr
                      key={_user._id}
                      className="hover:bg-gradient-to-r hover:from-[rgba(16,21,64,0.02)] hover:to-transparent transition-all duration-300 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600 font-mono">
                        {_user._id.slice(0, 8)}...
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#101540] to-[#101540]/70 flex items-center justify-center text-white text-xs font-semibold">
                            {_user.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{_user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{_user.email}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            _user.role === "admin"
                              ? "bg-gradient-to-r from-[#101540] to-[#101540]/80 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {_user.role === "admin" && <FaUserShield className="text-xs" />}
                          {_user.role}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{_user.phoneNumber}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        {_user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                            <FaCheckCircle className="text-sm" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                            <FaTimesCircle className="text-sm" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(_user._id, _user.isActive)}
                            disabled={user?._id === _user._id}
                            className={`group/btn relative inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-all duration-300 ${
                              _user.isActive
                                ? "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30"
                                : "bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
                            } text-white ${
                              user?._id === _user._id ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                            }`}
                          >
                            {_user.isActive ? <FaToggleOff className="text-sm" /> : <FaToggleOn className="text-sm" />}
                            <span className="hidden sm:inline">{_user.isActive ? "Disable" : "Enable"}</span>
                          </button>

                          <button
                            onClick={() => handleToggleAdminRole(_user._id, _user.role)}
                            disabled={user?._id === _user._id}
                            className={`group/btn relative inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-all duration-300 ${
                              _user.role === "admin"
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/30"
                                : "bg-gradient-to-r from-[#101540] to-[#101540]/80 hover:shadow-lg hover:shadow-[#101540]/30"
                            } text-white ${
                              user?._id === _user._id ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                            }`}
                            title={user?._id === _user._id ? "You cannot change your own role" : ""}
                          >
                            {_user.role === "admin" ? (
                              <FaUserMinus className="text-sm" />
                            ) : (
                              <FaUserShield className="text-sm" />
                            )}
                            <span className="hidden sm:inline">
                              {_user.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#101540] to-[#101540]/80 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-[#101540]/20 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 font-semibold text-sm"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-semibold text-sm">
              Page <span className="text-[#101540] text-lg">{currentPage}</span> of{" "}
              <span className="text-[#101540] text-lg">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#101540] to-[#101540]/80 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-[#101540]/20 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 font-semibold text-sm"
          >
            <span>Next</span>
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageUsersComponent
