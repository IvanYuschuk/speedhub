import css from "./Timer.module.css";

interface TimerProps {
    timeLeft: number;
};

const Timer = ({ timeLeft }: TimerProps) => {
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    
    return (
        <div className={`${css.timer} ${timeLeft <= 60 ? css.timerDanger : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={css.timerIcon}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {formatTime(timeLeft)}
        </div>
    );
};

export default Timer;