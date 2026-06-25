import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageTitle, Button, SearchBox, Badge, Select, Modal, Input, Loading } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { attendanceService } from '@/services/attendance.service';
import { employeeService } from '@/services/employee.service';

const today = () => new Date().toISOString().split('T')[0];
const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const STATUS_MAP = { present: { label: 'Đúng giờ', variant: 'success' }, late: { label: 'Đi trễ', variant: 'warning' }, absent: { label: 'Vắng mặt', variant: 'danger' } };

export const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(today());
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '', note: '', status: '' });
  const toast = useToast();
  const { isManager, userProfile, user } = useAuth();
  const myId = userProfile?.id || user?.uid;

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const empSnap = await employeeService.getEmployees();
      const emps = empSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((e) => e.status !== 'inactive');

      const attSnap = await attendanceService.getByDate(selectedDate);
      const attData = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (isManager) {
        const merged = emps.map((emp) => {
          const existing = attData.find((a) => a.employeeId === emp.id);
          if (existing) return existing;
          return {
            id: null,
            employeeId: emp.id,
            name: emp.name,
            initials: (emp.name || '').split(' ').slice(-2).map((n) => n[0]).join(''),
            date: selectedDate,
            checkIn: null,
            checkOut: null,
            status: 'absent',
            note: '',
          };
        });
        setRecords(merged);
      } else {
        const myRecords = attData.filter((a) => a.employeeId === myId);
        if (myRecords.length === 0) {
          setRecords([{
            id: null,
            employeeId: myId,
            name: userProfile?.name || user?.displayName || '',
            initials: (userProfile?.name || user?.displayName || '').split(' ').slice(-2).map((n) => n[0]).join(''),
            date: selectedDate,
            checkIn: null,
            checkOut: null,
            status: 'absent',
            note: '',
          }]);
        } else {
          setRecords(myRecords);
        }
      }
    } catch {
      toast.error('Không thể tải dữ liệu chấm công');
    } finally {
      setLoadingData(false);
    }
  }, [selectedDate, isManager, userProfile, user, myId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name?.toLowerCase().includes(q));
    }
    if (filterStatus) result = result.filter((r) => r.status === filterStatus);
    return result;
  }, [records, search, filterStatus]);

  const doCheckIn = async (rec) => {
    const checkInTime = now();
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const isLate = hour > 6 || (hour === 6 && minute > 10);
    const status = isLate ? 'late' : 'present';

    try {
      if (rec.id) {
        await attendanceService.update(rec.id, { checkIn: checkInTime, status });
        setRecords((prev) => prev.map((r) => r.id === rec.id ? { ...r, checkIn: checkInTime, status } : r));
      } else {
        const data = {
          employeeId: rec.employeeId,
          name: rec.name,
          initials: rec.initials,
          date: selectedDate,
          checkIn: checkInTime,
          checkOut: null,
          status,
          note: '',
        };
        const docRef = await attendanceService.add(data);
        setRecords((prev) => prev.map((r) =>
          r.employeeId === rec.employeeId && !r.id ? { ...data, id: docRef.id } : r
        ));
      }
      toast.success('Check-in thành công');
    } catch (err) {
      toast.error('Lỗi check-in: ' + err.message);
    }
  };

  const doCheckOut = async (rec) => {
    const checkOutTime = now();
    try {
      await attendanceService.update(rec.id, { checkOut: checkOutTime });
      setRecords((prev) => prev.map((r) => r.id === rec.id ? { ...r, checkOut: checkOutTime } : r));
      toast.success('Check-out thành công');
    } catch (err) {
      toast.error('Lỗi check-out: ' + err.message);
    }
  };

  const openEdit = (rec) => {
    setEditForm({ checkIn: rec.checkIn || '', checkOut: rec.checkOut || '', note: rec.note || '', status: rec.status });
    setEditModal(rec);
  };

  const saveEdit = async () => {
    try {
      if (editModal.id) {
        await attendanceService.update(editModal.id, editForm);
        setRecords((prev) => prev.map((r) => r.id === editModal.id ? { ...r, ...editForm } : r));
      } else {
        const data = {
          employeeId: editModal.employeeId,
          name: editModal.name,
          initials: editModal.initials,
          date: selectedDate,
          ...editForm,
        };
        const docRef = await attendanceService.add(data);
        setRecords((prev) => prev.map((r) =>
          r.employeeId === editModal.employeeId && !r.id ? { ...data, id: docRef.id } : r
        ));
      }
      toast.success('Đã cập nhật chấm công');
      setEditModal(null);
    } catch (err) {
      toast.error('Lỗi cập nhật: ' + err.message);
    }
  };

  const summary = useMemo(() => ({
    present: records.filter((r) => r.status === 'present').length,
    late: records.filter((r) => r.status === 'late').length,
    absent: records.filter((r) => r.status === 'absent').length,
  }), [records]);

  if (loadingData) return <PageContainer><Loading text="Đang tải dữ liệu chấm công..." /></PageContainer>;

  const isToday = selectedDate === today();
  const myRecord = !isManager ? records[0] : null;

  return (
    <PageContainer>
      <PageTitle
        title={isManager ? 'Chấm công' : 'Chấm công của tôi'}
        subtitle={`Ngày: ${new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`}
      />

      {/* Employee: prominent check-in/out section */}
      {!isManager && isToday && myRecord && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.5rem' }}>⏰</span>
              <span style={{ fontSize: 'var(--font-size-body)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {!myRecord.checkIn ? 'Bạn chưa chấm công hôm nay' : myRecord.checkOut ? 'Đã hoàn thành chấm công' : 'Đang trong ca làm'}
              </span>
              <Badge variant={STATUS_MAP[myRecord.status]?.variant}>{STATUS_MAP[myRecord.status]?.label}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
              <span>Check-in: <strong style={{ color: myRecord.checkIn ? 'var(--color-success)' : 'inherit' }}>{myRecord.checkIn || '—'}</strong></span>
              <span>Check-out: <strong style={{ color: myRecord.checkOut ? 'var(--color-success)' : 'inherit' }}>{myRecord.checkOut || '—'}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {!myRecord.checkIn && (
              <Button onClick={() => doCheckIn(myRecord)}>Check-in ngay</Button>
            )}
            {myRecord.checkIn && !myRecord.checkOut && (
              <Button variant="outline" onClick={() => doCheckOut(myRecord)}>Check-out</Button>
            )}
          </div>
        </div>
      )}

      {/* Date navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }}>← Trước</Button>
        <Input id="date-pick" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ maxWidth: 180 }} />
        <Button variant="ghost" size="sm" onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }}>Sau →</Button>
        {!isToday && <Button variant="ghost" size="sm" onClick={() => setSelectedDate(today())}>Hôm nay</Button>}
      </div>

      {/* Summary cards - show for manager or meaningful counts */}
      {isManager && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          {[{ label: 'Đúng giờ', value: summary.present, color: 'var(--color-success)' }, { label: 'Đi trễ', value: summary.late, color: 'var(--color-warning)' }, { label: 'Vắng mặt', value: summary.absent, color: 'var(--color-danger)' }].map((s) => (
            <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search / filter - only for manager */}
      {isManager && (
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Tìm nhân viên..." />
          <Select id="filter-status" options={[{ value: '', label: 'Tất cả' }, { value: 'present', label: 'Đúng giờ' }, { value: 'late', label: 'Đi trễ' }, { value: 'absent', label: 'Vắng mặt' }]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
        </div>
      )}

      <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Nhân viên', 'Check-in', 'Check-out', 'Trạng thái', 'Ghi chú', ...(isManager ? ['Thao tác'] : [])].map((h) => (
                <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isManager ? 6 : 5} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Không có dữ liệu chấm công</td></tr>
            ) : filtered.map((rec, idx) => (
              <tr key={rec.id || idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-small)', fontWeight: 600, flexShrink: 0 }}>{rec.initials}</div>
                    {rec.name}
                  </div>
                </td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: rec.checkIn ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{rec.checkIn || '—'}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: rec.checkOut ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{rec.checkOut || '—'}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)' }}><Badge variant={STATUS_MAP[rec.status]?.variant}>{STATUS_MAP[rec.status]?.label}</Badge></td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>{rec.note || '—'}</td>
                {isManager && (
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {!rec.checkIn && isToday && (
                        <Button size="sm" onClick={() => doCheckIn(rec)}>Check-in</Button>
                      )}
                      {rec.checkIn && !rec.checkOut && isToday && (
                        <Button size="sm" variant="outline" onClick={() => doCheckOut(rec)}>Check-out</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(rec)}>Sửa</Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Chỉnh sửa chấm công" size="sm" footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setEditModal(null)}>Hủy</Button>
          <Button onClick={saveEdit}>Lưu</Button>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input id="edit-checkin" label="Check-in" value={editForm.checkIn} onChange={(e) => setEditForm((p) => ({ ...p, checkIn: e.target.value }))} placeholder="HH:MM" />
          <Input id="edit-checkout" label="Check-out" value={editForm.checkOut} onChange={(e) => setEditForm((p) => ({ ...p, checkOut: e.target.value }))} placeholder="HH:MM" />
          <Select id="edit-status" label="Trạng thái" value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} options={[{ value: 'present', label: 'Đúng giờ' }, { value: 'late', label: 'Đi trễ' }, { value: 'absent', label: 'Vắng mặt' }]} />
          <Input id="edit-note" label="Ghi chú" value={editForm.note} onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))} placeholder="Lý do..." />
        </div>
      </Modal>
    </PageContainer>
  );
};
