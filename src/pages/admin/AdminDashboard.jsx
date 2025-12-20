import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Users, Package, ShoppingCart, IndianRupee, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './AdminPages.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await userService.getAdminStats();
                setStats(response.data);
            } catch (error) {
                toast.error(error.message);
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-8 h-8 text-blue-500" />, sub: `${stats.activeUsers} active` },
        { title: 'Total Products', value: stats.totalProducts, icon: <Package className="w-8 h-8 text-purple-500" />, sub: `${stats.outOfStockProducts} out of stock` },
        { title: 'Total Revenue', value: `RS ${stats.totalRevenue.toLocaleString()}`, icon: <IndianRupee className="w-8 h-8 text-green-500" />, sub: 'From completed orders' },
        { title: 'Pending Orders', value: stats.pendingBookings, icon: <Clock className="w-8 h-8 text-yellow-500" />, sub: 'Awaiting confirmation' },
        { title: 'Low Stock Alerts', value: stats.lowStockProducts, icon: <AlertTriangle className="w-8 h-8 text-red-500" />, sub: 'Less than 5 items' },
        { title: 'Category Count', value: stats.categoryStats.length, icon: <TrendingUp className="w-8 h-8 text-indigo-500" />, sub: 'Product categories' },
    ];

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Admin Dashboard</h1>
                <p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="admin-grid">
                {statCards.map((card, index) => (
                    <div key={index} className="admin-card flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activities Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Bookings */}
                <div className="admin-page-content">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-500" />
                            Recent Bookings
                        </h2>
                        <button className="text-sm text-blue-500 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{booking.user?.fullName || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">@{booking.user?.userName || 'unknown'}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{booking.product?.name || 'Deleted Product'}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">RS {booking.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {stats.recentBookings.length === 0 && (
                        <p className="text-center py-6 text-gray-400">No recent bookings found.</p>
                    )}
                </div>

                {/* Categories Breakdown */}
                <div className="admin-page-content">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Category Distribution
                    </h2>
                    <div className="space-y-4">
                        {stats.categoryStats.map((cat, index) => {
                            const percentage = stats.totalProducts > 0 ? (cat.count / stats.totalProducts) * 100 : 0;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{cat._id}</span>
                                        <span className="text-gray-500">{cat.count} items ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {stats.categoryStats.length === 0 && (
                            <p className="text-center py-6 text-gray-400">No categories found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
