import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FiEdit3,
  FiCheck,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";

const Profile = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    isActive: user?.isActive || false,
    createdAt: user?.createdAt || "",
    updatedAt: user?.updatedAt || "",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-lg">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8 bg-red-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Profile
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your account information
              </p>
            </div>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: isEditing ? "#10b981" : "#1a2250",
                color: "white",
              }}
            >
              {isEditing ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <FiEdit3 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with primary color */}
          <div
            className="px-6 py-4 md:px-8 md:py-6"
            style={{ backgroundColor: "#1a2250" }}
          >
            <h2 className="text-xl font-semibold text-white">
              Account Information
            </h2>
          </div>

          {/* Form Fields */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiMail className="w-4 h-4" style={{ color: "#1a2250" }} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                style={isEditing ? { focusRingColor: "#1a2250" } : {}}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiPhone className="w-4 h-4" style={{ color: "#1a2250" }} />
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                style={isEditing ? { focusRingColor: "#1a2250" } : {}}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Read-only fields in grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Status */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiCheckCircle
                    className="w-4 h-4"
                    style={{ color: "#1a2250" }}
                  />
                  Account Status
                </label>
                <div className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600">
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiCalendar
                    className="w-4 h-4"
                    style={{ color: "#1a2250" }}
                  />
                  Member Since
                </label>
                <div className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600">
                  {new Date(formData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Last Updated */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiCalendar
                    className="w-4 h-4"
                    style={{ color: "#1a2250" }}
                  />
                  Last Updated
                </label>
                <div className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600">
                  {new Date(formData.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
