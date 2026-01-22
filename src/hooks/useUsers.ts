import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, SortField, SortDirection, FilterParams } from '../types/user';
import { UserService } from '../services/api';

const ITEMS_PER_PAGE = 10;

export const useUsers = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);

    // Сортировка
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Фильтры
    const [filters, setFilters] = useState<FilterParams>({});

    // Флаг для отслеживания изменений
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Загрузка всех пользователей один раз
    const fetchAllUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Загружаем  пользователей (100) без пагинации
            const response = await UserService.getUsers({ limit: 100 });
            setAllUsers(response.users);
            setTotalUsers(response.total);
            setRefreshTrigger(prev => prev + 1); // обновление данных
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

    // Применяем фильтрацию, сортировку и пагинацию к данным
    const applyFiltersAndSorting = useCallback(() => {
        if (allUsers.length === 0) {
            setUsers([]);
            return;
        }

        // 1. Фильтрация
        let filtered = [...allUsers];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(user =>
                user.firstName.toLowerCase().includes(searchLower) ||
                user.lastName.toLowerCase().includes(searchLower) ||
                user.maidenName?.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.phone.includes(filters.search)
            );
        }

        if (filters.gender) {
            filtered = filtered.filter(user => user.gender === filters.gender);
        }

        if (filters.ageMin !== undefined) {
            filtered = filtered.filter(user => user.age >= filters.ageMin);
        }

        if (filters.ageMax !== undefined) {
            filtered = filtered.filter(user => user.age <= filters.ageMax);
        }

        // 2 Сортировка
        if (sortField && sortDirection) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (sortField) {
                    case 'firstName':
                        aValue = a.firstName.toLowerCase();
                        bValue = b.firstName.toLowerCase();
                        break;
                    case 'lastName':
                        aValue = a.lastName.toLowerCase();
                        bValue = b.lastName.toLowerCase();
                        break;
                    case 'maidenName':
                        aValue = (a.maidenName || '').toLowerCase();
                        bValue = (b.maidenName || '').toLowerCase();
                        break;
                    case 'age':
                        aValue = a.age;
                        bValue = b.age;
                        break;
                    case 'gender':
                        aValue = a.gender.toLowerCase();
                        bValue = b.gender.toLowerCase();
                        break;
                    case 'phone':
                        aValue = a.phone;
                        bValue = b.phone;
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Обновляем общее количество отфильтрованных пользователей
        setTotalUsers(filtered.length);

        // 3.Пагинация
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginated = filtered.slice(start, end);

        setUsers(paginated);
    }, [allUsers, filters, sortField, sortDirection, currentPage]);

    // Первоначальная загрузка всех пользователей
    useEffect(() => {
        fetchAllUsers().then(r => {});
    }, [fetchAllUsers]);

    // Применяем фильтры, сортировку и пагинацию при изменении параметров
    useEffect(() => {
        applyFiltersAndSorting();
    }, [applyFiltersAndSorting, refreshTrigger]);

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
        fetchAllUsers();
    }, [fetchAllUsers]);

    // Данные пагинации
    const totalPages = useMemo(() =>
            Math.ceil(totalUsers / ITEMS_PER_PAGE),
        [totalUsers]
    );

    // Корректируем текущую страницу
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return {
        // Состояния
        users,
        loading,
        error,
        currentPage,
        sortField,
        sortDirection,
        filters,
        totalUsers,

        // Данные пагинации
        totalPages,
        itemsPerPage: ITEMS_PER_PAGE,

        // Обработчики
        setCurrentPage,
        handleSort,
        handleFilterChange,
        handleRetry,
        refreshData: () => setRefreshTrigger(prev => prev + 1)
    };
};