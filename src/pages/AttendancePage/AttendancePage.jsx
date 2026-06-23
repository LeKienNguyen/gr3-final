import { useState, useMemo } from 'react';
import { PageTitle, Button, SearchBox, Badge, Select, Modal, Input } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';

const today = () => new Date().toISOString().split('T')[0];
const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const INITIAL_RECORDS = [
  { id: '1', name: 'Nguyễn Văn A', initials: 'NA', date: today(), checkIn: '06:02', checkOut: '14:05', status: 'present', note: '' },
  { id: '2', name: 'Trần Thị B', initials: 'TB', date: today(), checkIn: '06:15', checkOut: null, status: 'late', note: 'Xe hỏng' },
  { id: '3', name: 'Lê Văn C', initials: 'LC', date: today(), checkIn: null, checkOut: null, status: 'absent', note: '' },
  { id: '4', name: 'Phạm Thị D', initials: 'PD', date: today(), checkIn: '05:58', checkOut: '14:05', status: 'present', note: '' },
  { id: '5', name: 'Hoàng Văn E', initials: 'HE', date: today(), checkIn: '06:00', checkOut: null, status: 'present', note: '' },
  { id: '6', name: 'Vũ Thị F', initials: 'VF', date: today(), checkIn: null, checkOut: null, status: 'absent', note: 'Nghỉ phép' },
  { id: '7', name: 'Đặng Văn G', initials: 'DG', date: today(), checkIn: '06:08', checkOut: null, status: 'present', note: '' },
  { id: '8', name: 'Bùi Thị H', initials: 'BH', date: today(), checkIn: '06:30', checkOut: null, status: 'late', note: '' },
];

const STATUS_MAP = { present: { label: 'Đúng giờ', variant: 'success' }, late: { label: 'Đi trễ', variant: 'warning' }, absent: { label: 'Vắng mặt', variant: 'danger' } };

export const AttendancePage = () => {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '', note: '', status: '' });
  const toast = useToast();

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (filterStatus) result = result.filter((r) => r.status === filterStatus);
    return result;
  }, [records, search, filterStatus]);

  const doCheckIn = (id) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, checkIn: now(), status: 'present' } : r));
    toast.success('Check-in thành công');
  };

  const doCheckOut = (id) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, checkOut: now() } : r));
    toast.success('Check-out thành công');
  };

  const openEdit = (rec) => {
    setEditForm({ checkIn: rec.checkIn || '', checkOut: rec.checkOut || '', note: rec.note || '', status: rec.status });
    setEditModal(rec);
  };

  const saveEdit = () => {
    setRecords((prev) => prev.map((r) => r.id === editModal.id ? { ...r, ...editForm } : r));
    toast.success('Đã cập nhật chấm công');
    setEditModal(null);
  };

  const summary = useMemo(() => ({
    present: records.filter((r) => r.status === 'present').length,
    late: records.filter((r) => r.status === 'late').length,
    absent: records.filter((r) => r.status === 'absent').length,
  }), [records]);

  return (
    <PageContainer>
      <PageTitle title="Chấm công" subtitle={`Ngày: ${new Date().toLocaleDateString('vi-VN')}`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {[{ label: 'Đúng giờ', value: summary.present, color: 'var(--color-success)' }, { label: 'Đi trễ', value: summary.late, color: 'var(--color-warning)' }, { label: 'Vắng mặt', value: summary.absent, color: 'var(--color-danger)' }].map((s) => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Tìm nhân viên..." />
        <Select id="filter-status" options={[{ value: '', label: 'Tất cả' }, { value: 'present', label: 'Đúng giờ' }, { value: 'late', label: 'Đi trễ' }, { value: 'absent', label: 'Vắng mặt' }]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Nhân viên', 'Check-in', 'Check-out', 'Trạng thái', 'Ghi chú', 'Thao tác'].map((h) => (
                <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec) => (
              <tr key={rec.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
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
                <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {!rec.checkIn && <Button size="sm" onClick={() => doCheckIn(rec.id)}>Check-in</Button>}
                    {rec.checkIn && !rec.checkOut && <Button size="sm" variant="outline" onClick={() => doCheckOut(rec.id)}>Check-out</Button>}
                    <Button size="sm" variant="ghost" onClick={() => openEdit(rec)}>Sửa</Button>
                  </div>
                </td>
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
