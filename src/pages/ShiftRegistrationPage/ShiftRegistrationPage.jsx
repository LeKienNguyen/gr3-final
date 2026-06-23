import { useState, useMemo } from 'react';
import { PageTitle, Button, Badge, Modal, Select, ConfirmDialog } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';

const SHIFTS = [
  { value: 'morning', label: 'Ca sáng (6:00 - 14:00)' },
  { value: 'afternoon', label: 'Ca chiều (14:00 - 22:00)' },
  { value: 'evening', label: 'Ca tối (22:00 - 6:00)' },
];

const EMPLOYEES = [
  'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D',
  'Hoàng Văn E', 'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H',
];

const getWeekDays = () => {
  const days = [];
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({ date: d.toISOString().split('T')[0], label: d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }) });
  }
  return days;
};

const DAYS = getWeekDays();
const SHIFT_COLORS = { morning: 'success', afternoon: 'info', evening: 'warning' };
const SHIFT_LABELS = { morning: 'Sáng', afternoon: 'Chiều', evening: 'Tối' };

const generateInitial = () => {
  const assignments = {};
  EMPLOYEES.forEach((emp) => {
    assignments[emp] = {};
    DAYS.forEach((d) => { assignments[emp][d.date] = Math.random() > 0.4 ? SHIFTS[Math.floor(Math.random() * 3)].value : null; });
  });
  return assignments;
};

export const ShiftRegistrationPage = () => {
  const [assignments, setAssignments] = useState(generateInitial);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState({ employee: '', day: '', shift: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const openAssign = (employee, day) => {
    setSelected({ employee, day, shift: assignments[employee]?.[day] || '' });
    setModalOpen(true);
  };

  const saveAssign = () => {
    setAssignments((prev) => ({
      ...prev,
      [selected.employee]: { ...prev[selected.employee], [selected.day]: selected.shift || null },
    }));
    toast.success(`Đã cập nhật ca cho ${selected.employee}`);
    setModalOpen(false);
  };

  const removeShift = () => {
    setAssignments((prev) => ({
      ...prev,
      [deleteTarget.employee]: { ...prev[deleteTarget.employee], [deleteTarget.day]: null },
    }));
    toast.success('Đã xóa ca làm');
    setDeleteTarget(null);
  };

  const stats = useMemo(() => {
    const counts = { morning: 0, afternoon: 0, evening: 0 };
    const todayStr = new Date().toISOString().split('T')[0];
    Object.values(assignments).forEach((days) => {
      if (days[todayStr]) counts[days[todayStr]]++;
    });
    return counts;
  }, [assignments]);

  return (
    <PageContainer>
      <PageTitle title="Đăng ký ca làm" subtitle="Quản lý đăng ký và phân công ca" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {SHIFTS.map((s) => (
          <div key={s.value} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700 }}>{stats[s.value]}</p>
            <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{s.label} (hôm nay)</p>
          </div>
        ))}
      </div>

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
            {EMPLOYEES.map((emp) => (
              <tr key={emp} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', fontWeight: 500, position: 'sticky', left: 0, background: 'var(--color-surface)', zIndex: 1 }}>{emp}</td>
                {DAYS.map((d) => {
                  const shift = assignments[emp]?.[d.date];
                  return (
                    <td key={d.date} style={{ padding: 'var(--space-2) var(--space-2)', textAlign: 'center' }}>
                      {shift ? (
                        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Badge variant={SHIFT_COLORS[shift]} className="" style={{ cursor: 'pointer' }} onClick={() => openAssign(emp, d.date)}>{SHIFT_LABELS[shift]}</Badge>
                          <button onClick={() => setDeleteTarget({ employee: emp, day: d.date })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 12, padding: 0 }} title="Xóa">×</button>
                        </div>
                      ) : (
                        <button onClick={() => openAssign(emp, d.date)} style={{ background: 'none', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', width: 28, height: 28, cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Thêm ca">+</button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Phân công ca làm" size="sm" footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button onClick={saveAssign}>Lưu</Button>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>{selected.employee} — {selected.day}</p>
          <Select id="assign-shift" label="Ca làm" options={[{ value: '', label: 'Không có ca' }, ...SHIFTS]} value={selected.shift} onChange={(e) => setSelected((p) => ({ ...p, shift: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={removeShift} title="Xóa ca làm" message={`Xóa ca làm của ${deleteTarget?.employee} ngày ${deleteTarget?.day}?`} />
    </PageContainer>
  );
};
