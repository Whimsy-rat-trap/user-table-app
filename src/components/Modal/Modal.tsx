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
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button
                    className="modal-close"
                    onClick={handleClose}
                    aria-label="Закрыть окно"
                >
                    <FaTimes />
                </button>

                <div className="modal-header">
                    <div className="avatar-container">
                        <img src={user.image} alt={user.firstName} className="user-avatar" />
                        <div className="avatar-overlay">
                            <FaUser />
                        </div>
                    </div>
                    <div className="user-name">
                        <h2>
                            {user.firstName} {user.lastName} {user.maidenName && `(${user.maidenName})`}
                        </h2>
                        <div className="user-age-gender">
              <span className="user-age">
                <FaBirthdayCake className="icon-small" /> {user.age} лет
              </span>
                            <span className={`user-gender gender-${user.gender}`}>
                {user.gender === 'male' ? (
                    <>
                        <FaMars className="icon-small" /> Мужской
                    </>
                ) : (
                    <>
                        <FaVenus className="icon-small" /> Женский
                    </>
                )}
              </span>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="user-info-grid">
                        <div className="info-item full-width">
                            <div className="info-icon">
                                <FaPhone />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Номер телефона</span>
                                <span className="info-value">{user.phone}</span>
                            </div>
                        </div>

                        <div className="info-item full-width">
                            <div className="info-icon">
                                <FaEnvelope />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FaRulerVertical />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Рост</span>
                                <span className="info-value">{user.height} см</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FaWeight />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Вес</span>
                                <span className="info-value">{user.weight} кг</span>
                            </div>
                        </div>

                        <div className="info-item full-width">
                            <div className="info-icon">
                                <FaMapMarkerAlt />
                            </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

Modal.displayName = 'Modal';

export default Modal;