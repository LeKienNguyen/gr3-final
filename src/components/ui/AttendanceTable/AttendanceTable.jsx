import './AttendanceTable.css';

const PLACEHOLDER_ATTENDANCE = [
  { id: 1, name: 'Nguyễn Văn A', initials: 'NA', checkIn: '06:02', checkOut: '—', status: 'present', statusLabel: 'Đúng giờ' },
  { id: 2, name: 'Trần Thị B', initials: 'TB', checkIn: '06:15', checkOut: '—', status: 'late', statusLabel: 'Đi trễ' },
  { id: 3, name: 'Lê Văn C', initials: 'LC', checkIn: '—', checkOut: '—', status: 'absent', statusLabel: 'Chưa đến' },
  { id: 4, name: 'Phạm Thị D', initials: 'PD', checkIn: '05:58', checkOut: '14:05', status: 'present', statusLabel: 'Đúng giờ' },
];

export const AttendanceTable = () => (
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
          {PLACEHOLDER_ATTENDANCE.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="attendance-table__employee">
                  <div className="attendance-table__avatar">{row.initials}</div>
                  {row.name}
                </div>
              </td>
              <td>
                <span className={`attendance-table__time${row.checkIn === '—' ? ' attendance-table__time--empty' : ''}`}>
                  {row.checkIn}
                </span>
              </td>
              <td>
                <span className={`attendance-table__time${row.checkOut === '—' ? ' attendance-table__time--empty' : ''}`}>
                  {row.checkOut}
                </span>
              </td>
              <td>
                <span className={`attendance-table__status attendance-table__status--${row.status}`}>
                  <span className="attendance-table__status-dot" />
                  {row.statusLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
