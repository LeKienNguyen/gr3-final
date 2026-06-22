import './ShiftCard.css';

const PLACEHOLDER_SHIFTS = [
  { id: 1, name: 'Nguyễn Văn A', initials: 'NA', shift: 'Ca sáng (6:00 - 14:00)', status: 'active', statusLabel: 'Đang làm' },
  { id: 2, name: 'Trần Thị B', initials: 'TB', shift: 'Ca sáng (6:00 - 14:00)', status: 'active', statusLabel: 'Đang làm' },
  { id: 3, name: 'Lê Văn C', initials: 'LC', shift: 'Ca chiều (14:00 - 22:00)', status: 'upcoming', statusLabel: 'Sắp tới' },
  { id: 4, name: 'Phạm Thị D', initials: 'PD', shift: 'Ca chiều (14:00 - 22:00)', status: 'upcoming', statusLabel: 'Sắp tới' },
  { id: 5, name: 'Hoàng Văn E', initials: 'HE', shift: 'Nghỉ', status: 'off', statusLabel: 'Nghỉ phép' },
];

export const ShiftCard = () => (
  <div className="shift-card">
    <div className="shift-card__header">
      <h3 className="shift-card__title">
        📅 Ca làm hôm nay
      </h3>
      <span className="shift-card__count">{PLACEHOLDER_SHIFTS.length} nhân viên</span>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table className="shift-card__table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Ca làm</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {PLACEHOLDER_SHIFTS.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div className="shift-card__employee">
                  <div className="shift-card__employee-avatar">{emp.initials}</div>
                  {emp.name}
                </div>
              </td>
              <td>{emp.shift}</td>
              <td>
                <span className={`shift-card__status shift-card__status--${emp.status}`}>
                  {emp.statusLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
