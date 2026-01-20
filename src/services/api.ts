import { UsersResponse } from '../types/user';

const BASE_URL = 'https://dummyjson.com/users';

export class UserService {
    static async getUsers(skip = 0, limit = 100): Promise<UsersResponse> {
        const response = await fetch(`${BASE_URL}?skip=${skip}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
}