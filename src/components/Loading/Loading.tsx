import { FaSpinner } from 'react-icons/fa';
import './Loading.css';

const Loading: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <FaSpinner className="loading-spinner" />
                <p>Загрузка данных...</p>
                <p className="loading-subtext">Пожалуйста, подождите</p>
            </div>
        </div>
    );
};

export default Loading;