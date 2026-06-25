import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageTitle, Button, SearchBox, Modal, Input, Select, Badge, ConfirmDialog, Pagination, EmptyState, Loading } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { employeeService } from '@/services/employee.service';
import { createEmployeeAccount, previewEmail } from '@/services/createEmployee.service';

const EMPTY_FORM = { name: '', phone: '', position: '', employmentType: 'full-time' };

const POSITION_OPTIONS = [
  { value: 'Phục vụ', label: 'Phục vụ' },
  { value: 'Bếp trưởng', label: 'Bếp trưởng' },
  { value: 'Phụ bếp', label: 'Phụ bếp' },
  { value: 'Thu ngân', label: 'Thu ngân' },
  { value: 'Pha chế', label: 'Pha chế' },
  { value: 'Quản lý ca', label: 'Quản lý ca' },
  { value: 'Lễ tân', label: 'Lễ tân' },
  { value: 'Bảo vệ', label: 'Bảo vệ' },
  { value: 'Khác', label: 'Khác' },
];

const TYPE_OPTIONS = [
  { value: 'full-time', label: 'Toàn thời gian' },
  { value: 'part-time', label: 'Bán thời gian' },
];

const STATUS_OPTIONS = [{ value: 'active', label: 'Đang làm' }, { value: 'inactive', label: 'Nghỉ việc' }];
const STATUS_VARIANT = { active: 'success', inactive: 'default' };
const STATUS_LABEL = { active: 'Đang làm', inactive: 'Nghỉ việc' };
const TYPE_LABEL = { 'full-time': 'Toàn thời gian', 'part-time': 'Bán thời gian' };

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const debouncedSearch = useDebounce(search);

  const fetchEmployees = useCallback(async () => {
    try {
      const snap = await employeeService.getEmployees();
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEmployees(data);
    } catch {
      toast.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filtered = useMemo(() => {
    let result = employees;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((e) =>
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.includes(q) ||
        e.employeeId?.toLowerCase().includes(q)
      );
    }
    if (filterStatus) result = result.filter((e) => e.status === filterStatus);
    return result;
  }, [employees, debouncedSearch, filterStatus]);

  const { currentPage, totalPages, paginatedRange, goToPage } = usePagination(filtered.length);
  const pageData = filtered.slice(paginatedRange.start, paginatedRange.end);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const generatedEmail = useMemo(() => previewEmail(form.name), [form.name]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name || '',
      phone: emp.phone || '',
      position: emp.position || '',
      employmentType: emp.employmentType || 'full-time',
      status: emp.status || 'active',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập SĐT';
    if (!form.position) errs.position = 'Vui lòng chọn vị trí';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await employeeService.updateEmployee(editing.id, {
          name: form.name,
          phone: form.phone,
          position: form.position,
          employmentType: form.employmentType,
          status: form.status,
        });
        setEmployees((prev) => prev.map((e) =>
          e.id === editing.id ? { ...e, name: form.name, phone: form.phone, position: form.position, employmentType: form.employmentType, status: form.status } : e
        ));
        toast.success(`Đã cập nhật nhân viên ${form.name}`);
        setModalOpen(false);
      } else {
        const result = await createEmployeeAccount({
          name: form.name,
          phone: form.phone,
          position: form.position,
          employmentType: form.employmentType,
          createdBy: user?.uid || '',
        });

        setEmployees((prev) => [...prev, {
          id: result.uid,
          name: result.name,
          email: result.email,
          phone: form.phone,
          position: form.position,
          employmentType: form.employmentType,
          employeeId: result.employeeId,
          role: 'employee',
          status: 'active',
        }]);

        setModalOpen(false);
        setSuccessData({
          employeeId: result.employeeId,
          email: result.email,
          password: result.defaultPassword,
          name: result.name,
        });
      }
    } catch (err) {
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.deleteEmployee(deleteTarget.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      toast.success(`Đã xóa nhân viên ${deleteTarget.name}`);
    } catch (err) {
      toast.error(`Lỗi xóa: ${err.message}`);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const copyCredentials = () => {
    if (!successData) return;
    const text = `Mã NV: ${successData.employeeId}\nEmail: ${successData.email}\nMật khẩu: ${successData.password}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Đã sao chép thông tin đăng nhập');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loadingData) return <PageContainer><Loading text="Đang tải nhân viên..." /></PageContainer>;

  return (
    <PageContainer>
      <PageTitle title="Nhân viên" subtitle="Quản lý nhân sự nhà hàng" action={<Button onClick={openAdd}>+ Thêm nhân viên</Button>} />

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Tìm theo tên, email, SĐT, mã NV..." />
        <Select id="filter-status" options={[{ value: '', label: 'Tất cả trạng thái' }, ...STATUS_OPTIONS]} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); goToPage(1); }} />
      </div>

      {pageData.length === 0 ? (
        <EmptyState title="Không tìm thấy nhân viên" description={search ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có nhân viên nào'} action={!search && <Button onClick={openAdd}>+ Thêm nhân viên</Button>} />
      ) : (
        <>
          <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={thStyle}>Mã NV</th>
                  <th style={thStyle}>Họ tên</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>SĐT</th>
                  <th style={thStyle}>Vị trí</th>
                  <th style={thStyle}>Loại</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-small)', color: 'var(--color-primary)', fontWeight: 600 }}>
                        {emp.employeeId || '—'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-small)', fontWeight: 600, flexShrink: 0 }}>
                          {(emp.name || '').split(' ').slice(-2).map((n) => n[0]).join('')}
                        </div>
                        {emp.name}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 'var(--font-size-small)' }}>{emp.email}</td>
                    <td style={tdStyle}>{emp.phone}</td>
                    <td style={tdStyle}>{emp.position || '—'}</td>
                    <td style={tdStyle}><Badge>{TYPE_LABEL[emp.employmentType] || emp.employmentType || '—'}</Badge></td>
                    <td style={tdStyle}><Badge variant={STATUS_VARIANT[emp.status] || 'default'}>{STATUS_LABEL[emp.status] || emp.status}</Badge></td>
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

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'} footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Cập nhật' : 'Tạo nhân viên'}</Button>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input id="emp-name" label="Họ tên" value={form.name} onChange={set('name')} error={errors.name} required placeholder="VD: Nguyễn Văn An" />

          {/* Auto-generated email preview — only when adding */}
          {!editing && generatedEmail && (
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                Email (tự động tạo)
              </label>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-primary)',
                userSelect: 'all',
              }}>
                {generatedEmail}
              </div>
              <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                Nếu email đã tồn tại, hệ thống sẽ tự thêm số (01, 02...)
              </p>
            </div>
          )}

          <Input id="emp-phone" label="Số điện thoại" value={form.phone} onChange={set('phone')} error={errors.phone} required placeholder="VD: 0901234567" />
          <Select id="emp-position" label="Vị trí" options={[{ value: '', label: 'Chọn vị trí' }, ...POSITION_OPTIONS]} value={form.position} onChange={set('position')} error={errors.position} />
          <Select id="emp-type" label="Loại hình" options={TYPE_OPTIONS} value={form.employmentType} onChange={set('employmentType')} />
          {editing && (
            <Select id="emp-status" label="Trạng thái" options={STATUS_OPTIONS} value={form.status} onChange={set('status')} />
          )}
          {!editing && (
            <div style={{ padding: 'var(--space-3)', background: 'var(--color-info-bg)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-small)', color: '#0c5460', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0 }}>ℹ️</span>
              <span>Mật khẩu mặc định: <strong>Guigui@123</strong> — Nhân viên sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.</span>
            </div>
          )}
        </div>
      </Modal>

      {/* Success Dialog */}
      <Modal isOpen={!!successData} onClose={() => setSuccessData(null)} title="Tạo nhân viên thành công" footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={copyCredentials}>{copied ? 'Đã sao chép!' : 'Sao chép thông tin'}</Button>
          <Button onClick={() => setSuccessData(null)}>Đóng</Button>
        </div>
      }>
        {successData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-lg)', color: 'var(--color-success)' }}>
              <span style={{ fontSize: '2rem' }}>✓</span>
              <p style={{ fontWeight: 600, marginTop: 'var(--space-2)' }}>{successData.name}</p>
            </div>
            <div style={{ background: 'var(--color-background)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Mã nhân viên', value: successData.employeeId, color: 'var(--color-primary)' },
                { label: 'Email đăng nhập', value: successData.email },
                { label: 'Mật khẩu tạm', value: successData.password },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: item.color || 'var(--color-text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              Nhân viên sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.
            </p>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xóa nhân viên" message={`Bạn có chắc chắn muốn xóa nhân viên "${deleteTarget?.name}"?`} loading={deleting} />
    </PageContainer>
  );
};

const thStyle = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' };
const tdStyle = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' };
