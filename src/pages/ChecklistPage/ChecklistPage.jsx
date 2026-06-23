import { useState } from 'react';
import { PageTitle, Button, Modal, Input, Badge, ConfirmDialog } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';

const INITIAL_CHECKLISTS = [
  {
    id: '1',
    title: 'Checklist vệ sinh buổi sáng',
    date: new Date().toISOString().split('T')[0],
    items: [
      { id: '1a', label: 'Lau bàn khu vực A & B', checked: true, time: '06:30' },
      { id: '1b', label: 'Kiểm tra bếp và thiết bị nấu', checked: true, time: '06:45' },
      { id: '1c', label: 'Kiểm tra kho nguyên liệu', checked: false, time: null },
      { id: '1d', label: 'Dọn dẹp khu vực khách hàng', checked: false, time: null },
      { id: '1e', label: 'Vệ sinh nhà vệ sinh', checked: false, time: null },
    ],
  },
  {
    id: '2',
    title: 'Checklist vệ sinh buổi tối',
    date: new Date().toISOString().split('T')[0],
    items: [
      { id: '2a', label: 'Lau dọn toàn bộ bàn ghế', checked: false, time: null },
      { id: '2b', label: 'Vệ sinh bếp sau ca', checked: false, time: null },
      { id: '2c', label: 'Đổ rác và phân loại', checked: false, time: null },
      { id: '2d', label: 'Kiểm tra khóa cửa & an ninh', checked: false, time: null },
    ],
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 14, height: 14 }}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const ChecklistPage = () => {
  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [addItemModal, setAddItemModal] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const toggleItem = (checklistId, itemId) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              items: cl.items.map((item) =>
                item.id === itemId
                  ? { ...item, checked: !item.checked, time: !item.checked ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : null }
                  : item,
              ),
            }
          : cl,
      ),
    );
    toast.success('Đã cập nhật checklist');
  };

  const addChecklist = () => {
    if (!newTitle.trim()) return;
    setChecklists((prev) => [...prev, { id: String(Date.now()), title: newTitle, date: new Date().toISOString().split('T')[0], items: [] }]);
    toast.success('Đã tạo checklist mới');
    setNewTitle('');
    setModalOpen(false);
  };

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === addItemModal
          ? { ...cl, items: [...cl.items, { id: String(Date.now()), label: newItemLabel, checked: false, time: null }] }
          : cl,
      ),
    );
    toast.success('Đã thêm mục mới');
    setNewItemLabel('');
    setAddItemModal(null);
  };

  const deleteChecklist = () => {
    setChecklists((prev) => prev.filter((cl) => cl.id !== deleteTarget));
    toast.success('Đã xóa checklist');
    setDeleteTarget(null);
  };

  const deleteItem = (checklistId, itemId) => {
    setChecklists((prev) =>
      prev.map((cl) => cl.id === checklistId ? { ...cl, items: cl.items.filter((i) => i.id !== itemId) } : cl),
    );
    toast.info('Đã xóa mục');
  };

  return (
    <PageContainer>
      <PageTitle title="Checklist vệ sinh" subtitle="Quản lý checklist vệ sinh hàng ngày" action={<Button onClick={() => { setNewTitle(''); setModalOpen(true); }}>+ Tạo checklist</Button>} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {checklists.map((cl) => {
          const done = cl.items.filter((i) => i.checked).length;
          const pct = cl.items.length > 0 ? Math.round((done / cl.items.length) * 100) : 0;
          return (
            <div key={cl.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-body)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>{cl.title}</h3>
                  <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{cl.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Badge variant={pct === 100 ? 'success' : 'default'}>{done}/{cl.items.length} ({pct}%)</Badge>
                  <Button variant="ghost" size="sm" onClick={() => { setNewItemLabel(''); setAddItemModal(cl.id); }}>+ Thêm mục</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(cl.id)} style={{ color: 'var(--color-danger)' }}>Xóa</Button>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, background: 'var(--color-background)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cl.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background 0.15s' }} onClick={() => toggleItem(cl.id, item.id)} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-background)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', border: item.checked ? 'none' : '2px solid var(--color-border)', background: item.checked ? 'var(--color-success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, transition: 'all 0.15s' }}>
                      {item.checked && <CheckIcon />}
                    </div>
                    <span style={{ flex: 1, fontSize: 'var(--font-size-caption)', textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>{item.label}</span>
                    {item.time && <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.time}</span>}
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(cl.id, item.id); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--font-size-subtitle)', padding: '0 var(--space-1)' }} title="Xóa mục">×</button>
                  </div>
                ))}
                {cl.items.length === 0 && <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', padding: 'var(--space-3)', textAlign: 'center' }}>Chưa có mục nào</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create checklist modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tạo checklist mới" footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button onClick={addChecklist}>Tạo</Button>
        </div>
      }>
        <Input id="cl-title" label="Tên checklist" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="VD: Checklist vệ sinh buổi trưa" required />
      </Modal>

      {/* Add item modal */}
      <Modal isOpen={!!addItemModal} onClose={() => setAddItemModal(null)} title="Thêm mục checklist" size="sm" footer={
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setAddItemModal(null)}>Hủy</Button>
          <Button onClick={addItem}>Thêm</Button>
        </div>
      }>
        <Input id="cl-item" label="Nội dung" value={newItemLabel} onChange={(e) => setNewItemLabel(e.target.value)} placeholder="VD: Lau bàn khu vực C" required />
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={deleteChecklist} title="Xóa checklist" message="Bạn có chắc chắn muốn xóa checklist này?" />
    </PageContainer>
  );
};
