import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageTitle, Button, Badge, Modal, Select, ConfirmDialog, Loading } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { scheduleService } from '@/services/schedule.service';
import { employeeService } from '@/services/employee.service';

const SHIFTS = [
  { value: 'morning', label: 'Ca sáng (6:00 - 14:00)' },
  { value: 'afternoon', label: 'Ca chiều (14:00 - 22:00)' },
  { value: 'evening', label: 'Ca tối (22:00 - 6:00)' },
];

const SCHEDULE_STATUS = {
  pending: { label: 'Chờ duyệt', variant: 'warning' },
  approved: { label: 'Đã duyệt', variant: 'success' },
  published: { label: 'Đã công bố', variant: 'info' },
};

const getWeekDays = (offset = 0) => {
  const days = [];
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1 + (offset * 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({ date: d.toISOString().split('T')[0], label: d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }) });
  }
  return days;
};

const getWeekStart = (offset = 0) => {
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1 + (offset * 7));
  return start.toISOString().split('T')[0];
};

const SHIFT_COLORS = { morning: 'success', afternoon: 'info', evening: 'warning' };
const SHIFT_LABELS = { morning: 'Sáng', afternoon: 'Chiều', evening: 'Tối' };
const DEADLINE_HOURS = 48;

export const ShiftRegistrationPage = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState({ employeeId: '', employeeName: '', day: '', shift: '', scheduleId: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [weekStatus, setWeekStatus] = useState('pending');
  const toast = useToast();
  const { isManager, userProfile, user } = useAuth();

  const DAYS = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const weekStart = useMemo(() => getWeekStart(weekOffset), [weekOffset]);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const empSnap = await employeeService.getEmployees();
      const emps = empSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((e) => e.status !== 'inactive');
      setEmployees(emps);

      const schedSnap = await scheduleService.getByWeek(weekStart);
      const schedData = schedSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSchedules(schedData);

      const meta = schedData.find((s) => s.type === 'weekMeta');
      setWeekStatus(meta?.status || 'pending');
    } catch {
      toast.error('Không thể tải dữ liệu ca làm');
    } finally {
      setLoadingData(false);
    }
  }, [weekStart, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const assignments = useMemo(() => {
    const map = {};
    const displayEmployees = isManager
      ? employees
      : employees.filter((e) => e.id === (userProfile?.id || user?.uid));

    displayEmployees.forEach((emp) => {
      map[emp.id] = { name: emp.name, days: {} };
      DAYS.forEach((d) => {
        const sched = schedules.find((s) => s.employeeId === emp.id && s.date === d.date && s.type !== 'weekMeta');
        map[emp.id].days[d.date] = sched ? { shift: sched.shift, id: sched.id, status: sched.status || 'pending' } : null;
      });
    });
    return map;
  }, [employees, schedules, DAYS, isManager, userProfile, user]);

  const [currentTime] = useState(() => Date.now());
  const canEdit = (dayStr) => {
    const dayDate = new Date(dayStr + 'T00:00:00');
    const hoursUntil = (dayDate.getTime() - currentTime) / (1000 * 60 * 60);
    return hoursUntil > DEADLINE_HOURS || isManager;
  };

  const openAssign = (employeeId, employeeName, day) => {
    const existing = assignments[employeeId]?.days[day];
    setSelected({
      employeeId,
      employeeName,
      day,
      shift: existing?.shift || '',
      scheduleId: existing?.id || null,
    });
    setModalOpen(true);
  };

  const saveAssign = async () => {
    try {
      if (selected.scheduleId) {
        if (selected.shift) {
          await scheduleService.update(selected.scheduleId, { shift: selected.shift });
        } else {
          await scheduleService.delete(selected.scheduleId);
        }
      } else if (selected.shift) {
        await scheduleService.add({
          employeeId: selected.employeeId,
          employeeName: selected.employeeName,
          date: selected.day,
          shift: selected.shift,
          weekStart,
          status: isManager ? 'approved' : 'pending',
        });
      }
      toast.success(`Đã cập nhật ca cho ${selected.employeeName}`);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Lỗi: ' + err.message);
    }
  };

  const removeShift = async () => {
    try {
      const sched = schedules.find((s) => s.employeeId === deleteTarget.employeeId && s.date === deleteTarget.day && s.type !== 'weekMeta');
      if (sched) {
        await scheduleService.delete(sched.id);
        toast.success('Đã xóa ca làm');
        fetchData();
      }
    } catch (err) {
      toast.error('Lỗi: ' + err.message);
    }
    setDeleteTarget(null);
  };

  const approveWeek = async () => {
    try {
      const pendingSchedules = schedules.filter((s) => s.status === 'pending' && s.type !== 'weekMeta');
      for (const s of pendingSchedules) {
        await scheduleService.update(s.id, { status: 'approved' });
      }
      toast.success('Đã duyệt tất cả ca trong tuần');
      fetchData();
    } catch (err) {
      toast.error('Lỗi: ' + err.message);
    }
  };

  const publishWeek = async () => {
    try {
      const existing = schedules.find((s) => s.type === 'weekMeta');
      if (existing) {
        await scheduleService.update(existing.id, { status: 'published' });
      } else {
        await scheduleService.add({ type: 'weekMeta', weekStart, status: 'published' });
      }
      const allSchedules = schedules.filter((s) => s.type !== 'weekMeta');
      for (const s of allSchedules) {
        await scheduleService.update(s.id, { status: 'published' });
      }
      toast.success('Đã công bố lịch tuần');
      fetchData();
    } catch (err) {
      toast.error('Lỗi: ' + err.message);
    }
  };

  const stats = useMemo(() => {
    const counts = { morning: 0, afternoon: 0, evening: 0 };
    const todayStr = new Date().toISOString().split('T')[0];
    schedules.filter((s) => s.date === todayStr && s.type !== 'weekMeta').forEach((s) => {
      if (counts[s.shift] !== undefined) counts[s.shift]++;
    });
    return counts;
  }, [schedules]);

  if (loadingData) return <PageContainer><Loading text="Đang tải lịch ca..." /></PageContainer>;

  return (
    <PageContainer>
      <PageTitle
        title={isManager ? 'Đăng ký ca làm' : 'Lịch ca làm của tôi'}
        subtitle={isManager ? 'Quản lý đăng ký và phân công ca' : 'Đăng ký và xem lịch ca làm'}
        action={
          isManager && (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="outline" onClick={approveWeek}>Duyệt tất cả</Button>
              <Button onClick={publishWeek}>Công bố lịch tuần</Button>
            </div>
          )
        }
      />

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onClick={() => setWeekOffset((p) => p - 1)}>← Tuần trước</Button>
        <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>Tuần này</Button>
        <Button variant="ghost" size="sm" onClick={() => setWeekOffset((p) => p + 1)}>Tuần sau →</Button>
        {weekStatus !== 'pending' && <Badge variant={SCHEDULE_STATUS[weekStatus]?.variant}>{SCHEDULE_STATUS[weekStatus]?.label}</Badge>}
      </div>

      {isManager && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          {SHIFTS.map((s) => (
            <div key={s.value} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700 }}>{stats[s.value]}</p>
              <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{s.label} (hôm nay)</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)', position: 'sticky', left: 0, background: 'var(--color-surface)', zIndex: 1 }}>Nhân viên</th>
              {DAYS.map((d) => (
                <th key={d.date} style={{ padding: 'var(--space-3) var(--space-3)', textAlign: 'center', fontSize: 'var(--font-size-small)', fontWeight: 600, color: d.date === new Date().toISOString().split('T')[0] ? 'var(--color-primary)' : 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{d.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(assignments).map(([empId, empData]) => (
              <tr key={empId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', fontWeight: 500, position: 'sticky', left: 0, background: 'var(--color-surface)', zIndex: 1 }}>{empData.name}</td>
                {DAYS.map((d) => {
                  const assignment = empData.days[d.date];
                  const editable = canEdit(d.date);
                  return (
                    <td key={d.date} style={{ padding: 'var(--space-2) var(--space-2)', textAlign: 'center' }}>
                      {assignment ? (
                        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                          <Badge variant={SHIFT_COLORS[assignment.shift]} style={{ cursor: editable ? 'pointer' : 'default' }} onClick={() => editable && openAssign(empId, empData.name, d.date)}>{SHIFT_LABELS[assignment.shift]}</Badge>
                          {editable && (
                            <button onClick={() => setDeleteTarget({ employeeId: empId, employeeName: empData.name, day: d.date })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 12, padding: 0 }} title="Xóa">×</button>
                          )}
                        </div>
                      ) : editable ? (
                        <button onClick={() => openAssign(empId, empData.name, d.date)} style={{ background: 'none', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', width: 28, height: 28, cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Thêm ca">+</button>
                      ) : (
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isManager && (
        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            Bạn có thể đăng ký hoặc chỉnh sửa ca làm trước <strong>{DEADLINE_HOURS} giờ</strong> so với thời gian ca bắt đầu.
            Sau thời hạn này, chỉ Quản lý mới được phép chỉnh sửa.
          </p>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Phân công ca làm" size="sm" footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button onClick={saveAssign}>Lưu</Button>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>{selected.employeeName} — {selected.day}</p>
          <Select id="assign-shift" label="Ca làm" options={[{ value: '', label: 'Không có ca' }, ...SHIFTS]} value={selected.shift} onChange={(e) => setSelected((p) => ({ ...p, shift: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={removeShift} title="Xóa ca làm" message={`Xóa ca làm của ${deleteTarget?.employeeName} ngày ${deleteTarget?.day}?`} />
    </PageContainer>
  );
};
