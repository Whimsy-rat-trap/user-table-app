import { useState, useRef, memo, useCallback } from 'react';
import { User, SortField, SortDirection } from '../../types/user';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import './Table.css';

interface TableProps {
    users: User[];
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    onRowClick: (user: User) => void;
    columnWidths: Record<string, number>;
    onColumnResize: (columnKey: string, newWidth: number) => void;
}

// Столбцы таблицы
const columns = [
    { key: 'firstName', label: 'Фамилия', sortable: true },
    { key: 'lastName', label: 'Имя', sortable: true },
    { key: 'maidenName', label: 'Отчество', sortable: true },
    { key: 'age', label: 'Возраст', sortable: true },
    { key: 'gender', label: 'Пол', sortable: true },
    { key: 'phone', label: 'Телефон', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'country', label: 'Страна', sortable: false },
    { key: 'city', label: 'Город', sortable: false }
] as const;

const Table: React.FC<TableProps> = memo(({
                                              users,
                                              sortField,
                                              sortDirection,
                                              onSort,
                                              onRowClick,
                                              columnWidths,
                                              onColumnResize
                                          }) => {
    const [resizingColumn, setResizingColumn] = useState<string | null>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    const handleResizeStart = useCallback((columnKey: string, clientX: number) => {
        setResizingColumn(columnKey);
        const startX = clientX;
        const startWidth = columnWidths[columnKey];

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            onColumnResize(columnKey, newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setResizingColumn(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [columnWidths, onColumnResize]);

    if (users.length === 0) {
        return (
            <div className="no-data-message">
                Нет данных для отображения
            </div>
        );
    }

    return (
        <div className="table-container">
            <table ref={tableRef} className="users-table">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <TableHeader
                            key={column.key}
                            column={column}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={onSort}
                            width={columnWidths[column.key]}
                            onResizeStart={(e) => handleResizeStart(column.key, e.clientX)}
                            isResizing={resizingColumn === column.key}
                        />
                    ))}
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <TableRow
                        key={user.id}
                        user={user}
                        columns={columns}
                        onRowClick={onRowClick}
                        columnWidths={columnWidths}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
});

Table.displayName = 'Table';

export default Table;