import { memo, useCallback, useEffect, useState } from 'react';
import { FilterParams } from '../../types/user';
import './FilterControls.css';

interface FilterControlsProps {
    filters: FilterParams;
    onFilterChange: (filters: FilterParams) => void;
}

const FilterControls: React.FC<FilterControlsProps> = memo(({
                                                                filters,
                                                                onFilterChange
                                                            }) => {
    const [localFilters, setLocalFilters] = useState<FilterParams>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localFilters.search !== filters.search) {
                onFilterChange({ search: localFilters.search });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localFilters.search, filters.search, onFilterChange]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters(prev => ({ ...prev, search: e.target.value }));
    }, []);

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
                value={localFilters.search || ''}
                onChange={handleSearchChange}
                className="search-input"
            />
            <select
                value={filters.gender || ''}
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
                value={filters.ageMin || ''}
                onChange={handleAgeMinChange}
                className="age-input"
                min="0"
                max="150"
            />
            <input
                type="number"
                placeholder="Макс. возраст"
                value={filters.ageMax || ''}
                onChange={handleAgeMaxChange}
                className="age-input"
                min="0"
                max="150"
            />
        </div>
    );
});

FilterControls.displayName = 'FilterControls';

export default FilterControls;