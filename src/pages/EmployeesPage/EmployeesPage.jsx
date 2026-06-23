import { useState, useMemo } from 'react';
import { PageTitle, Button, SearchBox, Modal, Input, Select, Badge, ConfirmDialog, Pagination, EmptyState } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { ROLE_LABELS, ROLES } from '@/constants/roles';

const INITIAL_EMPLOYEES = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a.nguyen@guiguibbq.com', phone: '0901234567', role: 'staff', status: 'active' },
  { id: '2', name: 'Trần Thị B', email: 'b.tran@guiguibbq.com', phone: '0912345678', role: 'staff', status: 'active' },
  { id: '3', name: 'Lê Văn C', email: 'c.le@guiguibbq.com', phone: '0923456789', role: 'chef', status: 'active' },
  { id: '4', name: 'Phạm Thị D', email: 'd.pham@guiguibbq.com', phone: '0934567890', role: 'staff', status: 'inactive' },
  { id: '5', name: 'Hoàng Văn E', email: 'e.hoang@guiguibbq.com', phone: '0945678901', role: 'manager', status: 'active' },
  { id: '6', name: 'Vũ Thị F', email: 'f.vu@guiguibbq.com', phone: '0956789012', role: 'chef', status: 'active' },
  { id: '7', name: 'Đặng Văn G', email: 'g.dang@guiguibbq.com', phone: '0967890123', role: 'staff', status: 'active' },
  { id: '8', name: 'Bùi Thị H', email: 'h.bui@guiguibbq.com', phone: '0978901234', role: 'staff', status: 'active' },
  { id: '9', name: 'Ngô Văn I', email: 'i.ngo@guiguibbq.com', phone: '0989012345', role: 'staff', status: 'active' },
  { id: '10', name: 'Dương Thị K', email: 'k.duong@guiguibbq.com', phone: '0990123456', role: 'chef', status: 'active' },
  { id: '11', name: 'Lý Văn L', email: 'l.ly@guiguibbq.com', phone: '0911122334', role: 'staff', status: 'active' },
  { id: '12', name: 'Trịnh Thị M', email: 'm.trinh@guiguibbq.com', phone: '0922233445', role: 'staff', status: 'inactive' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'staff', status: 'active' };
const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));
const STATUS_OPTIONS = [{ value: 'active', label: 'Đang làm' }, { value: 'inactive', label: 'Nghỉ việc' }];
const STATUS_VARIANT = { active: 'success', inactive: 'default' };
const STATUS_LABEL = { active: 'Đang làm', inactive: 'Nghỉ việc' };

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const toast = useToast();

  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let result = employees;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone.includes(q));
    }
    if (filterRole) result = result.filter((e) => e.role === filterRole);
    return result;
  }, [employees, debouncedSearch, filterRole]);

  const { currentPage, totalPages, paginatedRange, goToPage } = usePagination(filtered.length);
  const pageData = filtered.slice(paginatedRange.start, paginatedRange.end);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (emp) => { setEditing(emp); setForm({ name: emp.name, email: emp.email, phone: emp.phone, role: emp.role, status: emp.status }); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập SĐT';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    if (editing) {
      setEmployees((prev) => prev.map((e) => e.id === editing.id ? { ...e, ...form } : e));
      toast.success(`Đã cập nhật nhân viên ${form.name}`);
    } else {
      const newEmp = { ...form, id: String(Date.now()) };
      setEmployees((prev) => [...prev, newEmp]);
      toast.success(`Đã thêm nhân viên ${form.name}`);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    toast.success(`Đã xóa nhân viên ${deleteTarget.name}`);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <PageContainer>
      <PageTitle title="Nhân viên" subtitle="Quản lý nhân sự nhà hàng" action={<Button onClick={openAdd}>+ Thêm nhân viên</Button>} />

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Tìm kiếm nhân viên..." />
        <Select id="filter-role" options={[{ value: '', label: 'Tất cả vai trò' }, ...ROLE_OPTIONS]} value={filterRole} onChange={(e) => { setFilterRole(e.target.value); goToPage(1); }} />
      </div>

      {pageData.length === 0 ? (
        <EmptyState title="Không tìm thấy nhân viên" description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có nhân viên nào'} action={!search && <Button onClick={openAdd}>+ Thêm nhân viên</Button>} />
      ) : (
        <>
          <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={thStyle}>Họ tên</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>SĐT</th>
                  <th style={thStyle}>Vai trò</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-small)', fontWeight: 600, flexShrink: 0 }}>
                          {emp.name.split(' ').slice(-2).map((n) => n[0]).join('')}
                        </div>
                        {emp.name}
                      </div>
                    </td>
                    <td style={tdStyle}>{emp.email}</td>
                    <td style={tdStyle}>{emp.phone}</td>
                    <td style={tdStyle}><Badge>{ROLE_LABELS[emp.role] || emp.role}</Badge></td>
                    <td style={tdStyle}><Badge variant={STATUS_VARIANT[emp.status]}>{STATUS_LABEL[emp.status]}</Badge></td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(emp)}>Sửa</Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(emp)} style={{ color: 'var(--color-danger)' }}>Xóa</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>Tổng: {filtered.length} nhân viên</span>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'} footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Cập nhật' : 'Thêm'}</Button>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input id="emp-name" label="Họ tên" value={form.name} onChange={set('name')} error={errors.name} required />
          <Input id="emp-email" label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
          <Input id="emp-phone" label="Số điện thoại" value={form.phone} onChange={set('phone')} error={errors.phone} required />
          <Select id="emp-role" label="Vai trò" options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />
          <Select id="emp-status" label="Trạng thái" options={STATUS_OPTIONS} value={form.status} onChange={set('status')} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa nhân viên" message={`Bạn có chắc chắn muốn xóa nhân viên "${deleteTarget?.name}"?`} loading={deleting} />
    </PageContainer>
  );
};

const thStyle = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' };
const tdStyle = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' };
