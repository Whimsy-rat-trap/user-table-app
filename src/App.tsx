import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { User, SortField, SortDirection, FilterParams } from './types/user';
import { UserService } from './services/api';
import Table from './components/Table/Table';
import Pagination from './components/Pagination/Pagination';
import Modal from './components/Modal/Modal';
import Loading from './components/Loading/Loading';
import './App.css';

// Компоненты
const MemoizedTable = memo(Table);
const MemoizedPagination = memo(Pagination);
const MemoizedModal = memo(Modal);
const MemoizedLoading = memo(Loading);

const App: React.FC = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Сортировка
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Фильтры
    const [filters, setFilters] = useState<FilterParams>({});

    // Ширина колонок
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        firstName: 120,
        lastName: 120,
        maidenName: 120,
        age: 80,
        gender: 100,
        phone: 150,
        email: 200,
        country: 120,
        city: 120
    });

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

            // Детальное сообщение об ошибке
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError('Ошибка сети. Проверьте подключение к интернету.');
            } else if (err instanceof Error && err.message.includes('HTTP error')) {
                setError('Ошибка сервера при загрузке данных. Пожалуйста, попробуйте позже.');
            } else {
                setError('Неизвестная ошибка при загрузке данных.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

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

            return !(filterParams.ageMax !== undefined && user.age > filterParams.ageMax);


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

        // 1. Фильтрация
        const filtered = applyFilters(allUsers, filters);

        // 2. Сортировка
        return applySorting(filtered, sortField, sortDirection);
    }, [allUsers, filters, sortField, sortDirection, applyFilters, applySorting]);

    // Мемоизированные данные для пагинации
    const paginationData = useMemo(() => {
        const totalUsers = filteredUsers.length;
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        // Корректируем текущую страницу если она вышла за пределы
        const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

        if (currentPage !== validCurrentPage && totalPages > 0) {
            //setTimeout чтобы избежать обновления состояния во время рендера
            setTimeout(() => setCurrentPage(validCurrentPage), 0);
        }

        return { totalUsers, totalPages, validCurrentPage };
    }, [filteredUsers, currentPage, itemsPerPage]);

    //Пользователи для текущей страницы
    const currentUsers = useMemo(() => {
        const { validCurrentPage } = paginationData;
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, paginationData, itemsPerPage]);

    // Первоначальная загрузка
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // обработчики
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
    }, []);

    const handleRowClick = useCallback((user: User) => {
        setSelectedUser(user);
        setModalOpen(true);
    }, []);

    const handleColumnResize = useCallback((columnKey: string, newWidth: number) => {
        setColumnWidths(prev => ({
            ...prev,
            [columnKey]: Math.max(50, newWidth)
        }));
    }, []);

    const handleRetry = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // Пропсы для таблицы
    const tableProps = useMemo(() => ({
        users: currentUsers,
        sortField,
        sortDirection,
        onSort: handleSort,
        onRowClick: handleRowClick,
        columnWidths,
        onColumnResize: handleColumnResize
    }), [currentUsers, sortField, sortDirection, handleSort, handleRowClick, columnWidths, handleColumnResize]);

    // Пропсы для пагинации
    const paginationProps = useMemo(() => ({
        currentPage: paginationData.validCurrentPage,
        totalPages: paginationData.totalPages,
        totalItems: paginationData.totalUsers,
        itemsPerPage,
        onPageChange: setCurrentPage
    }), [paginationData, itemsPerPage]);

    // Мемоизированные пропсы для модального окна
    const modalProps = useMemo(() => ({
        user: selectedUser,
        onClose: handleCloseModal
    }), [selectedUser, handleCloseModal]);

    // Мемоизированные пропсы для контролов фильтрации
    const filterControlsProps = useMemo(() => ({
        search: filters.search || '',
        gender: filters.gender || '',
        ageMin: filters.ageMin || '',
        ageMax: filters.ageMax || '',
        onFilterChange: handleFilterChange
    }), [filters, handleFilterChange]);

    if (loading && allUsers.length === 0) {
        return <MemoizedLoading />;
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Таблица пользователей</h1>
                <FilterControls {...filterControlsProps} />
            </header>

            <main className="app-main">
                {error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={handleRetry} className="retry-button">
                            Повторить попытку
                        </button>
                    </div>
                ) : (
                    <>
                        <MemoizedTable {...tableProps} />

                        {paginationData.totalPages > 0 && (
                            <MemoizedPagination {...paginationProps} />
                        )}

                        {modalOpen && selectedUser && (
                            <MemoizedModal {...modalProps} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

// контролы фильтрации
interface FilterControlsProps {
    search: string;
    gender: string;
    ageMin: string | number;
    ageMax: string | number;
    onFilterChange: (filters: FilterParams) => void;
}

const FilterControls = memo(({
                                 search,
                                 gender,
                                 ageMin,
                                 ageMax,
                                 onFilterChange
                             }: FilterControlsProps) => {
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ search: e.target.value });
    }, [onFilterChange]);

    const handleGenderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ gender: e.target.value || undefined });
    }, [onFilterChange]);

    const handleAgeMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        onFilterChange({ ageMin: value });
    }, [onFilterChange]);

    const handleAgeMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        onFilterChange({ ageMax: value });
    }, [onFilterChange]);

    return (
        <div className="controls">
            <input
                type="text"
                placeholder="Поиск по имени, email или телефону..."
                value={search}
                onChange={handleSearchChange}
                className="search-input"
            />
            <select
                value={gender}
                onChange={handleGenderChange}
                className="filter-select"
            >
                <option value="">Все полы</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
            </select>
            <input
                type="number"
                placeholder="Мин. возраст"
                value={ageMin}
                onChange={handleAgeMinChange}
                className="age-input"
                min="0"
                max="150"
            />
            <input
                type="number"
                placeholder="Макс. возраст"
                value={ageMax}
                onChange={handleAgeMaxChange}
                className="age-input"
                min="0"
                max="150"
            />
        </div>
    );
});

FilterControls.displayName = 'FilterControls';

export default App;