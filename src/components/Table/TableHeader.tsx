import { memo, useCallback } from 'react';
import { SortField, SortDirection } from '../../types/user';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

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
}

const TableHeader: React.FC<TableHeaderProps> = memo(({
                                                          column,
                                                          sortField,
                                                          sortDirection,
                                                          onSort,
                                                          width,
                                                          onResizeStart,
                                                      }) => {
    const handleClick = useCallback(() => {
        if (column.sortable) {
            onSort(column.key as SortField);
        }
    }, [column.key, column.sortable, onSort]);

    const getSortIcon = useCallback(() => {
        if (sortField !== column.key) {
            return <FaSort className="sort-icon-default" />;
        }

        switch (sortDirection) {
            case 'asc':
                return <FaSortUp className="sort-icon-asc" />;
            case 'desc':
                return <FaSortDown className="sort-icon-desc" />;
            default:
                return <FaSort className="sort-icon-default" />;
        }
    }, [sortField, sortDirection, column.key]);

    const sortIcon = getSortIcon();

    return (
        <th
            style={{
                width: `${width}px`,
                minWidth: '50px',
                position: 'relative'
            }}
            className={column.sortable ? 'sortable' : ''}
            onClick={handleClick}
        >
            <div className="header-content">
                <div className="header-text">
                    <span className="header-label">{column.label}</span>
                    {column.sortable && (
                        <div className="sort-icon-container">
                            {sortIcon}
                        </div>
                    )}
                </div>
            </div>
            <div
                className="resize-handle"
                onMouseDown={onResizeStart}
                title="Изменить ширину колонки"
            />
        </th>
    );
});

TableHeader.displayName = 'TableHeader';

export default TableHeader;