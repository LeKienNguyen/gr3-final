import './ChecklistCard.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const PLACEHOLDER_ITEMS = [
  { id: 1, label: 'Lau bàn khu vực A & B', checked: true, time: '06:30' },
  { id: 2, label: 'Kiểm tra bếp và thiết bị nấu', checked: true, time: '06:45' },
  { id: 3, label: 'Kiểm tra kho nguyên liệu', checked: false, time: null },
  { id: 4, label: 'Dọn dẹp khu vực khách hàng', checked: false, time: null },
  { id: 5, label: 'Vệ sinh nhà vệ sinh', checked: false, time: null },
];

export const ChecklistCard = () => {
  const completed = PLACEHOLDER_ITEMS.filter((i) => i.checked).length;

  return (
    <div className="checklist-card">
      <div className="checklist-card__header">
        <h3 className="checklist-card__title">
          🧹 Checklist vệ sinh hôm nay
        </h3>
        <span className="checklist-card__progress">
          {completed}/{PLACEHOLDER_ITEMS.length} hoàn thành
        </span>
      </div>
      <div className="checklist-card__list">
        {PLACEHOLDER_ITEMS.map((item) => (
          <div key={item.id} className="checklist-card__item">
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
