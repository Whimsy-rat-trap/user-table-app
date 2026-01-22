import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, SortField, SortDirection, FilterParams } from '../types/user';
import { UserService } from '../services/api';

const ITEMS_PER_PAGE = 10;

export const useUsers = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);

    // Сортировка
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Фильтры
    const [filters, setFilters] = useState<FilterParams>({});

    // Загрузка всех пользователей
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await UserService.getUsers(0, 100);
            setAllUsers(response.users);
            setCurrentPage(1);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(
                err instanceof TypeError && err.message.includes('Failed to fetch')
                    ? 'Ошибка сети. Проверьте подключение к интернету.'
                    : 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Первоначальная загрузка
    useEffect(() => {
        fetchUsers().then(r => {});
    }, [fetchUsers]);

    // Фильтрация пользователей
    const applyFilters = useCallback((users: User[], filterParams: FilterParams) => {
        return users.filter(user => {
            // Поиск
            if (filterParams.search) {
                const searchLower = filterParams.search.toLowerCase();
                const matchesSearch =
                    user.firstName.toLowerCase().includes(searchLower) ||
                    user.lastName.toLowerCase().includes(searchLower) ||
                    user.maidenName?.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower) ||
                    user.phone.includes(filterParams.search);

                if (!matchesSearch) return false;
            }

            // Фильтр по полу
            if (filterParams.gender && user.gender !== filterParams.gender) {
                return false;
            }

            // Фильтр по возрасту
            if (filterParams.ageMin !== undefined && user.age < filterParams.ageMin) {
                return false;
            }

            if (filterParams.ageMax !== undefined && user.age > filterParams.ageMax) {
                return false;
            }

            return true;
        });
    }, []);

    // Сортировка пользователей
    const applySorting = useCallback((users: User[], field: SortField, direction: SortDirection) => {
        if (!field || !direction) return [...users];

        return [...users].sort((a, b) => {
            const getValue = (user: User, fieldName: SortField) => {
                switch (fieldName) {
                    case 'firstName': return user.firstName.toLowerCase();
                    case 'lastName': return user.lastName.toLowerCase();
                    case 'maidenName': return (user.maidenName || '').toLowerCase();
                    case 'age': return user.age;
                    case 'gender': return user.gender.toLowerCase();
                    case 'phone': return user.phone;
                    default: return '';
                }
            };

            const aVal = getValue(a, field);
            const bVal = getValue(b, field);

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, []);

    // Мемоизированные отфильтрованные пользователи
    const filteredUsers = useMemo(() => {
        if (allUsers.length === 0) return [];

        const filtered = applyFilters(allUsers, filters);
        return applySorting(filtered, sortField, sortDirection);
    }, [allUsers, filters, sortField, sortDirection, applyFilters, applySorting]);

    // Мемоизированные данные для пагинации
    const paginationData = useMemo(() => {
        const totalUsers = filteredUsers.length;
        const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
        const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

        if (currentPage !== validCurrentPage && totalPages > 0) {
            setTimeout(() => setCurrentPage(validCurrentPage), 0);
        }

        return { totalUsers, totalPages, validCurrentPage };
    }, [filteredUsers, currentPage]);

    // Пользователи для текущей страницы
    const currentUsers = useMemo(() => {
        const { validCurrentPage } = paginationData;
        const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, paginationData]);

    // Обработчики
    const handleSort = useCallback((field: SortField) => {
        setSortField(prevField => {
            if (prevField === field) {
                setSortDirection(prevDirection => {
                    if (prevDirection === 'asc') return 'desc';
                    if (prevDirection === 'desc') return null;
                    return 'asc';
                });
                return prevField;
            } else {
                setSortDirection('asc');
                return field;
            }
        });
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((newFilters: FilterParams) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    }, []);

    const handleRetry = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        // Состояния
        allUsers,
        loading,
        error,
        currentPage,
        sortField,
        sortDirection,
        filters,
        filteredUsers,
        currentUsers,

        // Данные пагинации
        paginationData,
        itemsPerPage: ITEMS_PER_PAGE,

        // Обработчики
        setCurrentPage,
        handleSort,
        handleFilterChange,
        handleRetry,
        fetchUsers
    };
};