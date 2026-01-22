import { useState, useCallback } from 'react';
import { User } from '../types/user';

export const useModal = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleRowClick = useCallback((user: User) => {
        setSelectedUser(user);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    return {
        selectedUser,
        modalOpen,
        handleRowClick,
        handleCloseModal
    };
};