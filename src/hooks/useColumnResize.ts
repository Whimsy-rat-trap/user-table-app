import { useState, useCallback } from 'react';

const DEFAULT_COLUMN_WIDTHS = {
    firstName: 120,
    lastName: 120,
    maidenName: 120,
    age: 80,
    gender: 100,
    phone: 150,
    email: 200,
    country: 120,
    city: 120
};

export const useColumnResize = () => {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(DEFAULT_COLUMN_WIDTHS);

    const handleColumnResize = useCallback((columnKey: string, newWidth: number) => {
        setColumnWidths(prev => ({
            ...prev,
            [columnKey]: Math.max(50, newWidth)
        }));
    }, []);

    const resetColumnWidths = useCallback(() => {
        setColumnWidths(DEFAULT_COLUMN_WIDTHS);
    }, []);

    return {
        columnWidths,
        handleColumnResize,
        resetColumnWidths
    };
};