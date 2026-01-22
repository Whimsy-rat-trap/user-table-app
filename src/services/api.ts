import {UsersResponse, QueryParams} from '../types/user';

const BASE_URL = 'https://dummyjson.com/users';

export class UserService {
    static async getUsers(queryParams: QueryParams = {}): Promise<UsersResponse> {
        const {
            skip = 0,
            limit = 100, // Загружаем всех пользователей
        } = queryParams;

        // Получаем всех пользователей
        const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UsersResponse = await response.json();

        return {
            users: data.users,
            total: data.total,
            skip: data.skip,
            limit: data.limit
        };
    }
}