import { memo, useMemo, useEffect } from 'react';
import { useUsers } from './hooks/useUsers';
import { useModal } from './hooks/useModal';
import { useColumnResize } from './hooks/useColumnResize';
import Table from './components/Table/Table';
import Pagination from './components/Pagination/Pagination';
import Modal from './components/Modal/Modal';
import Loading from './components/Loading/Loading';
import FilterControls from './components/FilterControls/FilterControls';
import './App.css';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
    // Используем кастомные хуки для управления логикой
    const {
        users,
        loading,
        error,
        currentPage,
        sortField,
        sortDirection,
        filters,
        totalUsers,
        totalPages,
        itemsPerPage,
        setCurrentPage,
        handleSort,
        handleFilterChange,
        handleRetry
    } = useUsers();

    const { columnWidths, handleColumnResize } = useColumnResize();
    const { selectedUser, modalOpen, handleRowClick, handleCloseModal } = useModal();

    // Отладка для проверки данных
    //useEffect(() => {
    //    console.log('Текущая страница:', currentPage);
    //    console.log('Всего страниц:', totalPages);
    //    console.log('Всего пользователей:', totalUsers);
    //    console.log('Пользователей на странице:', users.length);
    //}, [currentPage, totalPages, totalUsers, users]);

    const tableProps = useMemo(() => ({
        users,
        sortField,
        sortDirection,
        onSort: handleSort,
        onRowClick: handleRowClick,
        columnWidths,
        onColumnResize: handleColumnResize
    }), [users, sortField, sortDirection, handleSort, handleRowClick, columnWidths, handleColumnResize]);

    const paginationProps = useMemo(() => ({
        currentPage,
        totalPages,
        totalItems: totalUsers,
        itemsPerPage,
        onPageChange: setCurrentPage
    }), [currentPage, totalPages, totalUsers, itemsPerPage, setCurrentPage]);

    const modalProps = useMemo(() => ({
        user: selectedUser,
        onClose: handleCloseModal
    }), [selectedUser, handleCloseModal]);

    if (loading && users.length === 0) {
        return <Loading />;
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Таблица пользователей</h1>
                <FilterControls
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
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
                        <Table {...tableProps} />

                        {totalPages > 1 && (
                            <Pagination {...paginationProps} />
                        )}

                        <AnimatePresence>
                            {modalOpen && selectedUser && (
                                <Modal {...modalProps} />
                            )}
                        </AnimatePresence>
                    </>
                )}
            </main>
        </div>
    );
};

export default memo(App);