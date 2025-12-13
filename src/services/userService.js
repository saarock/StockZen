import protectedApi from "../instance/axiosProtectedInstance";

class UserService {
    async getAllUsers(usersPerPage, currentPage) {
        try {
            const response = await protectedApi.get(`/get-users?page=${currentPage}&limit=${usersPerPage}`);
            const data = await response.data;
            return data;
        } catch (error) {
            throw new Error(error.response.data.message);

        }
    }

    async updateUserStatus(userId, updatedStatus) {
        try {
            const response = await protectedApi.put(`/deactivate-activate-user`, { userId, updatedStatus });
            const data = await response.data;
            return data;
        } catch (error) {
            throw new Error(error.response.data.message);

        }
    }

    async getNotifications(currentPage, productsPerPage, isRead, userId) {
        try {

            console.log(currentPage, productsPerPage, isRead, userId)
            const response = await protectedApi.get(`/get-notifications?page=${currentPage}&limit=${productsPerPage}&isRead=${isRead}&userId=${userId}`);
            const data = await response.data;
            return data;
        } catch (error) {
            throw new Error(error.response.data.message);

        }
    }



}

const userService = new UserService();
export default userService;