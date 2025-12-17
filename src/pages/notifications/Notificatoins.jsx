import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { userService } from '../../services';
import useUser from '../../hooks/useUser';
import './Notifications.css'; // Importing the CSS file
import notification from '../../services/notification';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const notificationsPerPage = 7;
    const { user } = useUser();
    const [isRead, setIsRead] = useState(false);
    const [refresh, setRefresh] = useState(false);

    // Ensure useEffect runs when refresh changes
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true); // Start loading
                if (!user._id) {
                    toast.error("No user id found");
                    return; // Exit early if no user id
                }
                const data = await userService.getNotifications(currentPage, notificationsPerPage, isRead, user?._id);
                toast.success(data.message)
                console.log("this")
                console.log(data)
                setNotifications(data.data.notifications);
                setTotalPages(data.data.totalPages);

            } catch (error) {
                toast.error(error.message || "Some thing wrong")
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchNotifications();
    }, [currentPage, isRead, user, refresh]); // Make sure refresh is in the dependency array

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleIsReadChange = () => {
        setIsRead((prev) => !prev);
    };



    const handelMarkAsReadAndUnRead = async (notificationId, status) => {
        await notification.changeStatusOfMarkAsReadAndUnRead(notificationId, status);

        setRefresh(prev => !prev); // Toggle the refresh state to force re-fetch
    }

    return (
        <div className="notifications-container">
            <h1 className="notifications-heading">Notifications</h1>

            {/* Notification Filters */}
            <div className="notifications-filters">
                <button className="filter-button" onClick={() => handleIsReadChange()}>
                    {isRead ? "Show Unread" : "Show Read"}
                </button>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="loading"><LoadingSpinner /></div>
            ) : notifications?.length > 0 ? (
                <div className="notifications-list">
                    <ul className="notifications-list-ul">
                        {[...notifications].reverse().map((notification) => (
                            <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                                <div className="notification-item-info">
                                    <p className="notification-item-message">{notification.message}</p>
                                    <p className="notification-item-time">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="button">
                                    {
                                        notification.isRead ?
                                            <button onClick={() => handelMarkAsReadAndUnRead(notification._id, 0)}>Mark as unread</button> :
                                            <button onClick={() => handelMarkAsReadAndUnRead(notification._id, 1)}>Mark as read</button>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination */}
                    <div className="pagination">
                        {currentPage > 1 && (
                            <button className="pagination-button" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                        )}
                        {currentPage < totalPages && (
                            <button className="pagination-button" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="no-notifications">No notifications found</div>
            )}
        </div>
    );
};

export default Notifications;
