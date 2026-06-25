import './ShiftCard.css';

export const ShiftCard = ({ data = [] }) => (
  <div className="shift-card">
    <div className="shift-card__header">
      <h3 className="shift-card__title">
        📅 Ca làm hôm nay
      </h3>
      <span className="shift-card__count">{data.length} nhân viên</span>
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
          {data.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-4)' }}>Chưa có ca làm hôm nay</td></tr>
          ) : data.map((emp) => (
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
