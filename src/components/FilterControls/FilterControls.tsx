import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import './FilterControls.css';
import {FilterParams} from "../../types/user";

interface FilterControlsProps {
    filters: FilterParams;
    onFilterChange: (filters: FilterParams) => void;
}

const FilterControls: React.FC<FilterControlsProps> = memo(({
                                                                filters,
                                                                onFilterChange
                                                            }) => {
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
        <motion.input
            type="text"
    placeholder="Поиск по имени, email..."
    value={filters.search || ''}
    onChange={handleSearchChange}
    className="search-input"
    whileFocus={{
        scale: 1.02,
            boxShadow: '0 0 0 3px rgba(100, 108, 255, 0.2)'
    }}
    transition={{ duration: 0.2 }}
    />
    <motion.select
    value={filters.gender || ''}
    onChange={handleGenderChange}
    className="filter-select"
    whileFocus={{
        scale: 1.02,
            boxShadow: '0 0 0 3px rgba(100, 108, 255, 0.2)'
    }}
    transition={{ duration: 0.2 }}
>
    <option value="">Все полы</option>
    <option value="male">Мужской</option>
        <option value="female">Женский</option>
        </motion.select>
        <motion.input
    type="number"
    placeholder="Мин. возраст"
    value={filters.ageMin || ''}
    onChange={handleAgeMinChange}
    className="age-input"
    min="0"
    max="150"
    whileFocus={{
        scale: 1.02,
            boxShadow: '0 0 0 3px rgba(100, 108, 255, 0.2)'
    }}
    transition={{ duration: 0.2 }}
    />
    <motion.input
    type="number"
    placeholder="Макс. возраст"
    value={filters.ageMax || ''}
    onChange={handleAgeMaxChange}
    className="age-input"
    min="0"
    max="150"
    whileFocus={{
        scale: 1.02,
            boxShadow: '0 0 0 3px rgba(100, 108, 255, 0.2)'
    }}
    transition={{ duration: 0.2 }}
    />
    </div>
);
});

FilterControls.displayName = 'FilterControls';

export default FilterControls;