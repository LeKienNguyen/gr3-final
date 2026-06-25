import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checklistService } from '@/services/checklist.service';
import './ChecklistCard.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const ChecklistCard = ({ data = [] }) => {
  const [localUpdates, setLocalUpdates] = useState({});
  const navigate = useNavigate();

  const firstChecklist = data[0];
  const items = (firstChecklist?.items || []).map((item) =>
    localUpdates[item.id] !== undefined ? { ...item, ...localUpdates[item.id] } : item,
  );

  const toggle = async (itemId) => {
    if (!firstChecklist) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const newChecked = !item.checked;
    const newTime = newChecked ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : null;

    setLocalUpdates((prev) => ({ ...prev, [itemId]: { checked: newChecked, time: newTime } }));

    const updatedItems = (firstChecklist.items || []).map((i) =>
      i.id === itemId ? { ...i, checked: newChecked, time: newTime } : i,
    );
    try {
      await checklistService.update(firstChecklist.id, { items: updatedItems });
    } catch {
      setLocalUpdates((prev) => { const next = { ...prev }; delete next[itemId]; return next; });
    }
  };

  const completed = items.filter((i) => i.checked).length;

  return (
    <div className="checklist-card">
      <div className="checklist-card__header">
        <h3 className="checklist-card__title" style={{ cursor: 'pointer' }} onClick={() => navigate('/checklist')}>
          🧹 Checklist vệ sinh hôm nay
        </h3>
        <span className="checklist-card__progress">
          {completed}/{items.length} hoàn thành
        </span>
      </div>
      <div className="checklist-card__list">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-3)', fontSize: 'var(--font-size-caption)' }}>Chưa có checklist hôm nay</p>
        ) : items.map((item) => (
          <div key={item.id} className="checklist-card__item" onClick={() => toggle(item.id)} style={{ cursor: 'pointer' }}>
            <div className={`checklist-card__checkbox${item.checked ? ' checklist-card__checkbox--checked' : ''}`}>
              {item.checked && <CheckIcon />}
            </div>
            <span className={`checklist-card__label${item.checked ? ' checklist-card__label--checked' : ''}`}>
              {item.label}
            </span>
            {item.time && <span className="checklist-card__time">{item.time}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
