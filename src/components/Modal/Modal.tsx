import { User } from '../../types/user';
import './Modal.css';

interface ModalProps {
    user: User;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ user, onClose }) => {
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="modal-header">
                    <img src={user.image} alt={user.firstName} className="user-avatar" />
                    <div className="user-name">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p className="user-maiden">{user.maidenName}</p>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="user-info-grid">
                        <div className="info-item">
                            <span className="info-label">Возраст:</span>
                            <span className="info-value">{user.age} лет</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Пол:</span>
                            <span className="info-value">
                {user.gender === 'male' ? 'Мужской' : 'Женский'}
              </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Телефон:</span>
                            <span className="info-value">{user.phone}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user.email}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Рост:</span>
                            <span className="info-value">{user.height} см</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Вес:</span>
                            <span className="info-value">{user.weight} кг</span>
                        </div>

                        <div className="info-item full-width">
                            <span className="info-label">Адрес:</span>
                            <span className="info-value">
                {user.address.address}, {user.address.city}, {user.address.state}, {user.address.country}
              </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Почтовый индекс:</span>
                            <span className="info-value">{user.address.postalCode}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Дата рождения:</span>
                            <span className="info-value">
                {new Date(user.birthDate).toLocaleDateString()}
              </span>
                        </div>

                        {user.company && (
                            <div className="info-item">
                                <span className="info-label">Компания:</span>
                                <span className="info-value">{user.company.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;