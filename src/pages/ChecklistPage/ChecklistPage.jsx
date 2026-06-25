import { useState, useEffect, useCallback } from 'react';
import { PageTitle, Button, Modal, Input, Badge, ConfirmDialog, Loading } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { checklistService } from '@/services/checklist.service';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 14, height: 14 }}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const ChecklistPage = () => {
  const [checklists, setChecklists] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [addItemModal, setAddItemModal] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();
  const { isManager } = useAuth();

  const fetchChecklists = useCallback(async () => {
    try {
      const snap = await checklistService.getAll();
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChecklists(data);
    } catch {
      toast.error('Không thể tải checklist');
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  const toggleItem = async (checklist, itemId) => {
    const updatedItems = checklist.items.map((item) =>
      item.id === itemId
        ? { ...item, checked: !item.checked, time: !item.checked ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : null }
        : item,
    );
    try {
      await checklistService.update(checklist.id, { items: updatedItems });
      setChecklists((prev) =>
        prev.map((cl) => cl.id === checklist.id ? { ...cl, items: updatedItems } : cl),
      );
      toast.success('Đã cập nhật checklist');
    } catch (err) {
      toast.error('Lỗi cập nhật: ' + err.message);
    }
  };

  const addChecklist = async () => {
    if (!newTitle.trim()) return;
    try {
      const data = { title: newTitle, date: new Date().toISOString().split('T')[0], items: [] };
      const docRef = await checklistService.add(data);
      setChecklists((prev) => [...prev, { ...data, id: docRef.id }]);
      toast.success('Đã tạo checklist mới');
      setNewTitle('');
      setModalOpen(false);
    } catch (err) {
      toast.error('Lỗi tạo checklist: ' + err.message);
    }
  };

  const addItem = async () => {
    if (!newItemLabel.trim()) return;
    const checklist = checklists.find((cl) => cl.id === addItemModal);
    if (!checklist) return;
    const newItem = { id: String(Date.now()), label: newItemLabel, checked: false, time: null };
    const updatedItems = [...(checklist.items || []), newItem];
    try {
      await checklistService.update(checklist.id, { items: updatedItems });
      setChecklists((prev) =>
        prev.map((cl) => cl.id === addItemModal ? { ...cl, items: updatedItems } : cl),
      );
      toast.success('Đã thêm mục mới');
      setNewItemLabel('');
      setAddItemModal(null);
    } catch (err) {
      toast.error('Lỗi: ' + err.message);
    }
  };

  const deleteChecklist = async () => {
    try {
      await checklistService.delete(deleteTarget);
      setChecklists((prev) => prev.filter((cl) => cl.id !== deleteTarget));
      toast.success('Đã xóa checklist');
    } catch (err) {
      toast.error('Lỗi xóa: ' + err.message);
    }
    setDeleteTarget(null);
  };

  const deleteItem = async (checklist, itemId) => {
    const updatedItems = checklist.items.filter((i) => i.id !== itemId);
    try {
      await checklistService.update(checklist.id, { items: updatedItems });
      setChecklists((prev) =>
        prev.map((cl) => cl.id === checklist.id ? { ...cl, items: updatedItems } : cl),
      );
      toast.info('Đã xóa mục');
    } catch (err) {
      toast.error('Lỗi: ' + err.message);
    }
  };

  if (loadingData) return <PageContainer><Loading text="Đang tải checklist..." /></PageContainer>;

  return (
    <PageContainer>
      <PageTitle
        title="Checklist vệ sinh"
        subtitle={isManager ? 'Quản lý checklist vệ sinh hàng ngày' : 'Xem và đánh dấu checklist vệ sinh'}
        action={isManager && <Button onClick={() => { setNewTitle(''); setModalOpen(true); }}>+ Tạo checklist</Button>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {checklists.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
            <p>{isManager ? 'Chưa có checklist nào. Nhấn "Tạo checklist" để bắt đầu.' : 'Chưa có checklist nào.'}</p>
          </div>
        )}
        {checklists.map((cl) => {
          const items = cl.items || [];
          const done = items.filter((i) => i.checked).length;
          const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
          return (
            <div key={cl.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-body)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>{cl.title}</h3>
                  <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{cl.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Badge variant={pct === 100 ? 'success' : 'default'}>{done}/{items.length} ({pct}%)</Badge>
                  {isManager && <Button variant="ghost" size="sm" onClick={() => { setNewItemLabel(''); setAddItemModal(cl.id); }}>+ Thêm mục</Button>}
                  {isManager && <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(cl.id)} style={{ color: 'var(--color-danger)' }}>Xóa</Button>}
                </div>
              </div>
              <div style={{ height: 6, background: 'var(--color-background)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background 0.15s' }} onClick={() => toggleItem(cl, item.id)} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-background)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', border: item.checked ? 'none' : '2px solid var(--color-border)', background: item.checked ? 'var(--color-success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, transition: 'all 0.15s' }}>
                      {item.checked && <CheckIcon />}
                    </div>
                    <span style={{ flex: 1, fontSize: 'var(--font-size-caption)', textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>{item.label}</span>
                    {item.time && <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.time}</span>}
                    {isManager && (
                      <button onClick={(e) => { e.stopPropagation(); deleteItem(cl, item.id); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--font-size-subtitle)', padding: '0 var(--space-1)' }} title="Xóa mục">×</button>
                    )}
                  </div>
                ))}
                {items.length === 0 && <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', padding: 'var(--space-3)', textAlign: 'center' }}>Chưa có mục nào</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manager-only modals */}
      {isManager && (
        <>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tạo checklist mới" footer={
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button onClick={addChecklist}>Tạo</Button>
            </div>
          }>
            <Input id="cl-title" label="Tên checklist" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="VD: Checklist vệ sinh buổi trưa" required />
          </Modal>

          <Modal isOpen={!!addItemModal} onClose={() => setAddItemModal(null)} title="Thêm mục checklist" size="sm" footer={
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setAddItemModal(null)}>Hủy</Button>
              <Button onClick={addItem}>Thêm</Button>
            </div>
          }>
            <Input id="cl-item" label="Nội dung" value={newItemLabel} onChange={(e) => setNewItemLabel(e.target.value)} placeholder="VD: Lau bàn khu vực C" required />
          </Modal>

          <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={deleteChecklist} title="Xóa checklist" message="Bạn có chắc chắn muốn xóa checklist này?" />
        </>
      )}
    </PageContainer>
  );
};
