import { UsersResponse } from '../types/user';

const BASE_URL = 'https://dummyjson.com/users';

export class UserService {
    static async getUsers(skip = 0, limit = 100): Promise<UsersResponse> {
        try {
            const response = await fetch(`${BASE_URL}?skip=${skip}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async getUserById(id: number) {
        try {
            const response = await fetch(`${BASE_URL}/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
}