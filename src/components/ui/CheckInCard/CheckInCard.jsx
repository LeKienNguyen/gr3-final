import { useState } from 'react';
import { Button, Badge } from '@/components/common';
import { attendanceService } from '@/services/attendance.service';
import { useToast } from '@/hooks/useToast';
import './CheckInCard.css';

const STATUS_MAP = {
  present: { label: 'Đúng giờ', variant: 'success' },
  late: { label: 'Đi trễ', variant: 'warning' },
  absent: { label: 'Chưa chấm công', variant: 'danger' },
};

export const CheckInCard = ({ attendance, employeeId, employeeName, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const today = new Date().toISOString().split('T')[0];

  const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const hasCheckedIn = !!attendance?.checkIn;
  const hasCheckedOut = !!attendance?.checkOut;
  const status = attendance?.status || 'absent';

  const handleCheckIn = async () => {
    setLoading(true);
    const checkInTime = now();
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const isLate = hour > 6 || (hour === 6 && minute > 10);
    const newStatus = isLate ? 'late' : 'present';

    try {
      if (attendance?.id) {
        await attendanceService.update(attendance.id, { checkIn: checkInTime, status: newStatus });
      } else {
        await attendanceService.add({
          employeeId,
          name: employeeName,
          initials: employeeName.split(' ').slice(-2).map((n) => n[0]).join(''),
          date: today,
          checkIn: checkInTime,
          checkOut: null,
          status: newStatus,
          note: '',
        });
      }
      toast.success('Check-in thành công!');
      onUpdate?.();
    } catch (err) {
      toast.error('Lỗi check-in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    const checkOutTime = now();
    try {
      await attendanceService.update(attendance.id, { checkOut: checkOutTime });
      toast.success('Check-out thành công!');
      onUpdate?.();
    } catch (err) {
      toast.error('Lỗi check-out: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-card">
      <div className="checkin-card__header">
        <h3 className="checkin-card__title">⏰ Chấm công hôm nay</h3>
        <Badge variant={STATUS_MAP[status]?.variant}>{STATUS_MAP[status]?.label}</Badge>
      </div>

      <div className="checkin-card__body">
        <div className="checkin-card__date">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>

        <div className="checkin-card__times">
          <div className="checkin-card__time-item">
            <span className="checkin-card__time-label">Check-in</span>
            <span className={`checkin-card__time-value${hasCheckedIn ? ' checkin-card__time-value--done' : ''}`}>
              {attendance?.checkIn || '—'}
            </span>
          </div>
          <div className="checkin-card__time-divider" />
          <div className="checkin-card__time-item">
            <span className="checkin-card__time-label">Check-out</span>
            <span className={`checkin-card__time-value${hasCheckedOut ? ' checkin-card__time-value--done' : ''}`}>
              {attendance?.checkOut || '—'}
            </span>
          </div>
        </div>

        <div className="checkin-card__actions">
          {!hasCheckedIn && (
            <Button onClick={handleCheckIn} loading={loading} style={{ width: '100%' }}>
              Check-in ngay
            </Button>
          )}
          {hasCheckedIn && !hasCheckedOut && (
            <Button variant="outline" onClick={handleCheckOut} loading={loading} style={{ width: '100%' }}>
              Check-out
            </Button>
          )}
          {hasCheckedIn && hasCheckedOut && (
            <div className="checkin-card__completed">
              Bạn đã hoàn thành chấm công hôm nay
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
