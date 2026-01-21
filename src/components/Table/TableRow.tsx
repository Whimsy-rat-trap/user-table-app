import { memo, useMemo } from 'react';
import { User } from '../../types/user';
import { FaMars, FaVenus } from 'react-icons/fa';

interface TableRowProps {
    user: User;
    columns: Array<{ key: string; label: string }>;
    onRowClick: (user: User) => void;
    columnWidths: Record<string, number>;
}

const TableRow: React.FC<TableRowProps> = memo(({
                                                    user,
                                                    columns,
                                                    onRowClick,
                                                    columnWidths
                                                }) => {
    const handleClick = () => {
        onRowClick(user);
    };

    const cells = useMemo(() =>
            columns.map((column) => {
                let content: React.ReactNode;

                switch (column.key) {
                    case 'firstName':
                        content = user.lastName;
                        break;
                    case 'lastName':
                        content = user.firstName;
                        break;
                    case 'maidenName':
                        content = user.maidenName;
                        break;
                    case 'age':
                        content = user.age;
                        break;
                    case 'gender':
                        content = (
                            <span className={`gender-badge gender-${user.gender}`}>
              {user.gender === 'male' ? (
                  <>
                      <FaMars className="gender-icon" /> Мужской
                  </>
              ) : (
                  <>
                      <FaVenus className="gender-icon" /> Женский
                  </>
              )}
            </span>
                        );
                        break;
                    case 'phone':
                        content = user.phone;
                        break;
                    case 'email':
                        content = user.email;
                        break;
                    case 'country':
                        content = user.address?.country || '-';
                        break;
                    case 'city':
                        content = user.address?.city || '-';
                        break;
                    default:
                        content = '-';
                }

                return (
                    <td
                        key={column.key}
                        style={{ width: `${columnWidths[column.key]}px` }}
                    >
                        {content}
                    </td>
                );
            }),
        [user, columns, columnWidths]
    );

    return (
        <tr onClick={handleClick}>
            {cells}
        </tr>
    );
});

TableRow.displayName = 'TableRow';

export default TableRow;