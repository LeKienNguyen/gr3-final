import { useNavigate } from 'react-router-dom';
import './MyAttendanceCard.css';

export const MyAttendanceCard = ({ present = 0, late = 0, absent = 0, totalHours = 0 }) => {
  const navigate = useNavigate();
  const total = present + late + absent;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const monthName = new Date().toLocaleDateString('vi-VN', { month: 'long' });

  return (
    <div className="my-attendance">
      <div className="my-attendance__header">
        <h3 className="my-attendance__title" style={{ cursor: 'pointer' }} onClick={() => navigate('/attendance')}>
          📊 Tổng kết {monthName}
        </h3>
      </div>
      <div className="my-attendance__body">
        <div className="my-attendance__rate">
          <div className="my-attendance__rate-circle">
            <svg viewBox="0 0 100 100" className="my-attendance__rate-svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={rate >= 90 ? 'var(--color-success)' : rate >= 75 ? 'var(--color-warning)' : 'var(--color-danger)'}
                strokeWidth="8"
                strokeDasharray={`${rate * 2.64} ${264 - rate * 2.64}`}
                strokeDashoffset="66"
                strokeLinecap="round"
              />
            </svg>
            <span className="my-attendance__rate-value">{rate}%</span>
          </div>
          <span className="my-attendance__rate-label">Chuyên cần</span>
        </div>

        <div className="my-attendance__stats">
          <div className="my-attendance__stat">
            <span className="my-attendance__stat-value" style={{ color: 'var(--color-success)' }}>{present}</span>
            <span className="my-attendance__stat-label">Đúng giờ</span>
          </div>
          <div className="my-attendance__stat">
            <span className="my-attendance__stat-value" style={{ color: 'var(--color-warning)' }}>{late}</span>
            <span className="my-attendance__stat-label">Đi trễ</span>
          </div>
          <div className="my-attendance__stat">
            <span className="my-attendance__stat-value" style={{ color: 'var(--color-danger)' }}>{absent}</span>
            <span className="my-attendance__stat-label">Vắng</span>
          </div>
          <div className="my-attendance__stat">
            <span className="my-attendance__stat-value" style={{ color: 'var(--color-info)' }}>{totalHours}h</span>
            <span className="my-attendance__stat-label">Tổng giờ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
