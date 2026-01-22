import { memo, useMemo } from 'react';
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
    const {
        loading,
        error,
        currentPage,
        sortField,
        sortDirection,
        filters,
        currentUsers,
        paginationData,
        itemsPerPage,
        setCurrentPage,
        handleSort,
        handleFilterChange,
        handleRetry
    } = useUsers();

    const { columnWidths, handleColumnResize } = useColumnResize();
    const { selectedUser, modalOpen, handleRowClick, handleCloseModal } = useModal();

    const tableProps = useMemo(() => ({
        users: currentUsers,
        sortField,
        sortDirection,
        onSort: handleSort,
        onRowClick: handleRowClick,
        columnWidths,
        onColumnResize: handleColumnResize
    }), [currentUsers, sortField, sortDirection, handleSort, handleRowClick, columnWidths, handleColumnResize]);

    const paginationProps = useMemo(() => ({
        currentPage: paginationData.validCurrentPage,
        totalPages: paginationData.totalPages,
        totalItems: paginationData.totalUsers,
        itemsPerPage,
        onPageChange: setCurrentPage
    }), [paginationData, itemsPerPage, setCurrentPage]);

    const modalProps = useMemo(() => ({
        user: selectedUser,
        onClose: handleCloseModal
    }), [selectedUser, handleCloseModal]);

    if (loading) {
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

                        {paginationData.totalPages > 0 && (
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