import { memo, useMemo, useCallback } from 'react';
import {
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight,
    FaEllipsisH
} from 'react-icons/fa';
import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = memo(({
                                                        currentPage,
                                                        totalPages,
                                                        totalItems,
                                                        itemsPerPage,
                                                        onPageChange
                                                    }) => {
    const getPageNumbers = useCallback(() => {
        const pages = [];
        // Для крайних пагинаций
        const maxVisiblePages = 3;

        // Если всего страниц меньше или равно 7 показываем все
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Диапазон страниц вокруг текущей (2 страницы с каждой стороны)
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);

        // Расширение диапазона
        if (end - start + 1 < maxVisiblePages) {
            if (start === 1) {
                end = Math.min(totalPages, start + maxVisiblePages - 1);
            } else if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('ellipsis-start');
            }
        }

        // Добавляем диапазон страниц
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('ellipsis-end');
            }
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers]);

    const startItem = useMemo(() =>
            (currentPage - 1) * itemsPerPage + 1,
        [currentPage, itemsPerPage]
    );

    const endItem = useMemo(() =>
            Math.min(currentPage * itemsPerPage, totalItems),
        [currentPage, itemsPerPage, totalItems]
    );

    const handlePageChange = useCallback((page: number) => {
        onPageChange(page);
    }, [onPageChange]);

    const handleFirstPage = useCallback(() => handlePageChange(1), [handlePageChange]);
    const handlePrevPage = useCallback(() => handlePageChange(currentPage - 1), [currentPage, handlePageChange]);
    const handleNextPage = useCallback(() => handlePageChange(currentPage + 1), [currentPage, handlePageChange]);
    const handleLastPage = useCallback(() => handlePageChange(totalPages), [totalPages, handlePageChange]);

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                <span className="pagination-info-text">
                    Показано <strong>{startItem}-{endItem}</strong> из <strong>{totalItems}</strong> пользователей
                </span>
            </div>

            <div className="pagination-controls">
                <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className="pagination-button pagination-first"
                    title="Первая страница"
                    aria-label="Первая страница"
                >
                    <FaAngleDoubleLeft />
                </button>

                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="pagination-button pagination-prev"
                    title="Предыдущая страница"
                    aria-label="Предыдущая страница"
                >
                    <FaAngleLeft />
                </button>

                {pageNumbers.map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                                <FaEllipsisH />
                            </span>
                        );
                    }

                    const pageNumber = page as number;
                    const isActive = currentPage === pageNumber;

                    return (
                        <button
                            key={`page-${pageNumber}-${index}`}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`pagination-button ${isActive ? 'active' : ''}`}
                            aria-label={`Страница ${pageNumber}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className="page-number">{pageNumber}</span>
                        </button>
                    );
                })}

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button pagination-next"
                    title="Следующая страница"
                    aria-label="Следующая страница"
                >
                    <FaAngleRight />
                </button>

                <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button pagination-last"
                    title="Последняя страница"
                    aria-label="Последняя страница"
                >
                    <FaAngleDoubleRight />
                </button>
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';

export default Pagination;