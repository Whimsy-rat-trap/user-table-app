import { memo, useCallback } from 'react';
import { SortField, SortDirection } from '../../types/user';

interface TableHeaderProps {
    column: {
        key: string;
        label: string;
        sortable: boolean;
    };
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    width: number;
    onResizeStart: (e: React.MouseEvent) => void;
    isResizing: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = memo(({
                                                          column,
                                                          sortField,
                                                          sortDirection,
                                                          onSort,
                                                          width,
                                                          onResizeStart,
                                                          isResizing
                                                      }) => {
    const handleClick = useCallback(() => {
        if (column.sortable) {
            onSort(column.key as SortField);
        }
    }, [column.key, column.sortable, onSort]);

    const getSortIcon = useCallback(() => {
        if (sortField !== column.key) return null;

        switch (sortDirection) {
            case 'asc':
                return '↑';
            case 'desc':
                return '↓';
            default:
                return null;
        }
    }, [sortField, sortDirection, column.key]);

    const sortIcon = getSortIcon();

    return (
        <th
            style={{ width: `${width}px`, minWidth: '50px' }}
            className={column.sortable ? 'sortable' : ''}
            onClick={handleClick}
        >
            <div className="header-content">
                {column.label}
                {column.sortable && (
                    <span className="sort-icon">
            {sortIcon}
          </span>
                )}
            </div>
            <div
                className={`resize-handle ${isResizing ? 'resizing' : ''}`}
                onMouseDown={onResizeStart}
            />
        </th>
    );
});

TableHeader.displayName = 'TableHeader';

export default TableHeader;