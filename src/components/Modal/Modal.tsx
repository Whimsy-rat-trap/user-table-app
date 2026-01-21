import { memo, useCallback } from 'react';
import { User } from '../../types/user';
import {
    FaTimes,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaBirthdayCake,
    FaMars,
    FaVenus,
    FaWeight,
    FaRulerVertical
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

interface ModalProps {
    user: User;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = memo(({ user, onClose }) => {
    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                onClick={handleOverlayClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                >
                    <motion.button
                        className="modal-close"
                        onClick={handleClose}
                        aria-label="Закрыть окно"
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaTimes />
                    </motion.button>

                    <div className="modal-header">
                        <motion.div
                            className="avatar-container"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <img src={user.image} alt={user.firstName} className="user-avatar" />
                            <div className="avatar-overlay">
                                <FaUser />
                            </div>
                        </motion.div>
                        <div className="user-name">
                            <h2>
                                {user.firstName} {user.lastName} {user.maidenName && `(${user.maidenName})`}
                            </h2>
                            <div className="user-age-gender">
                                <motion.span
                                    className="user-age"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <FaBirthdayCake className="icon-small" /> {user.age} лет
                                </motion.span>
                                <motion.span
                                    className={`user-gender gender-${user.gender}`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {user.gender === 'male' ? (
                                        <>
                                            <FaMars className="icon-small" /> Мужской
                                        </>
                                    ) : (
                                        <>
                                            <FaVenus className="icon-small" /> Женский
                                        </>
                                    )}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="user-info-grid">
                            <motion.div
                                className="info-item full-width"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <motion.div
                                    className="info-icon"
                                    whileHover={{ rotate: 10 }}
                                >
                                    <FaPhone />
                                </motion.div>
                                <div className="info-content">
                                    <span className="info-label">Номер телефона</span>
                                    <span className="info-value">{user.phone}</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="info-item full-width"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <motion.div
                                    className="info-icon"
                                    whileHover={{ rotate: 10 }}
                                >
                                    <FaEnvelope />
                                </motion.div>
                                <div className="info-content">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{user.email}</span>
                                </div>
                            </motion.div>

                            {/* Контейнер для роста и веса с отступом между ними */}
                            <div className="height-weight-row">
                                <motion.div
                                    className="info-item"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <motion.div
                                        className="info-icon"
                                        whileHover={{ rotate: 10 }}
                                    >
                                        <FaRulerVertical />
                                    </motion.div>
                                    <div className="info-content">
                                        <span className="info-label">Рост</span>
                                        <span className="info-value">{user.height} см</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="info-item"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <motion.div
                                        className="info-icon"
                                        whileHover={{ rotate: 10 }}
                                    >
                                        <FaWeight />
                                    </motion.div>
                                    <div className="info-content">
                                        <span className="info-label">Вес</span>
                                        <span className="info-value">{user.weight} кг</span>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                className="info-item full-width"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <motion.div
                                    className="info-icon"
                                    whileHover={{ rotate: 10 }}
                                >
                                    <FaMapMarkerAlt />
                                </motion.div>
                                <div className="info-content">
                                    <span className="info-label">Адрес</span>
                                    <div className="address-details">
                                        {user.address.address && (
                                            <div className="address-line">
                                                <span className="address-label">Улица:</span>
                                                <span className="address-value">{user.address.address}</span>
                                            </div>
                                        )}
                                        {user.address.city && (
                                            <div className="address-line">
                                                <span className="address-label">Город:</span>
                                                <span className="address-value">{user.address.city}</span>
                                            </div>
                                        )}
                                        {user.address.state && (
                                            <div className="address-line">
                                                <span className="address-label">Штат/Область:</span>
                                                <span className="address-value">{user.address.state}</span>
                                            </div>
                                        )}
                                        {user.address.country && (
                                            <div className="address-line">
                                                <span className="address-label">Страна:</span>
                                                <span className="address-value">{user.address.country}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

Modal.displayName = 'Modal';

export default Modal;