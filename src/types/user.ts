export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    email: string;
    phone: string;
    birthDate: string;
    image: string;
    height: number;
    weight: number;
    address: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        country: string;
    };
    company: {
        name: string;
    };
}

export interface UsersResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}

export type SortField = 'firstName' | 'lastName' | 'maidenName' | 'age' | 'gender' | 'phone' | null;
export type SortDirection = 'asc' | 'desc' | null;

export interface FilterParams {
    search?: string;
    gender?: string;
    ageMin?: number;
    ageMax?: number;
}

export interface QueryParams {
    skip?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    search?: string;
    gender?: string;
    ageMin?: number;
    ageMax?: number;
}