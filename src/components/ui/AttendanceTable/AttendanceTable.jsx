import './AttendanceTable.css';

const STATUS_MAP = {
  present: { label: 'Đúng giờ', className: 'present' },
  late: { label: 'Đi trễ', className: 'late' },
  absent: { label: 'Chưa đến', className: 'absent' },
};

export const AttendanceTable = ({ data = [] }) => (
  <div className="attendance-table">
    <div className="attendance-table__header">
      <h3 className="attendance-table__title">
        🕒 Chấm công hôm nay
      </h3>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table className="attendance-table__table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-4)' }}>Chưa có dữ liệu chấm công</td></tr>
          ) : data.map((row) => {
            const initials = row.initials || (row.name || '').split(' ').slice(-2).map((n) => n[0]).join('');
            const st = STATUS_MAP[row.status] || STATUS_MAP.absent;
            return (
              <tr key={row.id}>
                <td>
                  <div className="attendance-table__employee">
                    <div className="attendance-table__avatar">{initials}</div>
                    {row.name}
                  </div>
                </td>
                <td>
                  <span className={`attendance-table__time${!row.checkIn ? ' attendance-table__time--empty' : ''}`}>
                    {row.checkIn || '—'}
                  </span>
                </td>
                <td>
                  <span className={`attendance-table__time${!row.checkOut ? ' attendance-table__time--empty' : ''}`}>
                    {row.checkOut || '—'}
                  </span>
                </td>
                <td>
                  <span className={`attendance-table__status attendance-table__status--${st.className}`}>
                    <span className="attendance-table__status-dot" />
                    {st.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
