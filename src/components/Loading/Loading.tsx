import { motion } from 'framer-motion';
import './Loading.css';

const Loading: React.FC = () => {
    return (
        <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loading-content">
                <motion.div
                    className="loading-spinner"
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="spinner-circle"></div>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Загрузка данных...
                </motion.p>
                <motion.p
                    className="loading-subtext"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Пожалуйста, подождите
                </motion.p>

                {/* Дополнительные анимационные элементы */}
                <div className="loading-dots">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="loading-dot"
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Loading;