import { useNavigate } from 'react-router-dom';
import './MyScheduleCard.css';

const SHIFT_LABELS = { morning: 'Sáng', afternoon: 'Chiều', evening: 'Tối' };
const SHIFT_TIMES = { morning: '6:00–14:00', afternoon: '14:00–22:00', evening: '22:00–6:00' };
const SHIFT_COLORS = {
  morning: { bg: 'var(--color-success-bg)', border: 'var(--color-success)', text: '#166534' },
  afternoon: { bg: '#eff6ff', border: 'var(--color-info)', text: '#1e40af' },
  evening: { bg: 'var(--color-warning-bg)', border: 'var(--color-warning)', text: '#92400e' },
};

export const MyScheduleCard = ({ weekSchedule = [], weekDays = [] }) => {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="my-schedule">
      <div className="my-schedule__header">
        <h3 className="my-schedule__title" style={{ cursor: 'pointer' }} onClick={() => navigate('/shift-registration')}>
          📅 Lịch ca làm tuần này
        </h3>
      </div>
      <div className="my-schedule__grid">
        {weekDays.map((day) => {
          const sched = weekSchedule.find((s) => s.date === day.date);
          const isToday = day.date === todayStr;
          const colors = sched ? SHIFT_COLORS[sched.shift] : null;
          return (
            <div
              key={day.date}
              className={`my-schedule__day${isToday ? ' my-schedule__day--today' : ''}${sched ? ' my-schedule__day--has-shift' : ''}`}
              style={sched ? { backgroundColor: colors.bg, borderColor: colors.border } : undefined}
            >
              <span className={`my-schedule__day-label${isToday ? ' my-schedule__day-label--today' : ''}`}>
                {day.label}
              </span>
              {sched ? (
                <div className="my-schedule__shift" style={{ color: colors.text }}>
                  <span className="my-schedule__shift-name">{SHIFT_LABELS[sched.shift]}</span>
                  <span className="my-schedule__shift-time">{SHIFT_TIMES[sched.shift]}</span>
                </div>
              ) : (
                <span className="my-schedule__no-shift">Nghỉ</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
