import { useState, useMemo } from 'react';
import { PageTitle, Select, Badge, Button } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';

const EMPLOYEES_DATA = [
  { name: 'Nguyễn Văn A', role: 'Staff', present: 22, late: 1, absent: 1, totalHours: 176 },
  { name: 'Trần Thị B', role: 'Staff', present: 20, late: 3, absent: 1, totalHours: 168 },
  { name: 'Lê Văn C', role: 'Chef', present: 23, late: 0, absent: 1, totalHours: 184 },
  { name: 'Phạm Thị D', role: 'Staff', present: 18, late: 2, absent: 4, totalHours: 152 },
  { name: 'Hoàng Văn E', role: 'Manager', present: 24, late: 0, absent: 0, totalHours: 192 },
  { name: 'Vũ Thị F', role: 'Chef', present: 21, late: 1, absent: 2, totalHours: 172 },
  { name: 'Đặng Văn G', role: 'Staff', present: 19, late: 4, absent: 1, totalHours: 160 },
  { name: 'Bùi Thị H', role: 'Staff', present: 22, late: 0, absent: 2, totalHours: 176 },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Tháng ${i + 1}` }));
const YEARS = [{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }];

export const MonthlySummaryPage = () => {
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState('2026');
  const toast = useToast();

  const totals = useMemo(() => EMPLOYEES_DATA.reduce((acc, e) => ({
    present: acc.present + e.present,
    late: acc.late + e.late,
    absent: acc.absent + e.absent,
    hours: acc.hours + e.totalHours,
  }), { present: 0, late: 0, absent: 0, hours: 0 }), []);

  const exportReport = () => {
    toast.success('Đã xuất báo cáo tổng công tháng');
  };

  return (
    <PageContainer>
      <PageTitle title="Tổng công tháng" subtitle="Tổng hợp công theo tháng" action={<Button onClick={exportReport}>Xuất báo cáo</Button>} />

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Select id="ms-month" options={MONTHS} value={month} onChange={(e) => setMonth(e.target.value)} />
        <Select id="ms-year" options={YEARS} value={year} onChange={(e) => setYear(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {[{ label: 'Tổng ngày công', value: totals.present, color: 'var(--color-success)' }, { label: 'Đi trễ', value: totals.late, color: 'var(--color-warning)' }, { label: 'Vắng mặt', value: totals.absent, color: 'var(--color-danger)' }, { label: 'Tổng giờ', value: totals.hours, color: 'var(--color-info)' }].map((s) => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Nhân viên', 'Vai trò', 'Có mặt', 'Đi trễ', 'Vắng', 'Tổng giờ', 'Đánh giá'].map((h) => (
                <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES_DATA.map((emp) => {
              const rate = Math.round((emp.present / (emp.present + emp.late + emp.absent)) * 100);
              return (
                <tr key={emp.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', fontWeight: 500 }}>{emp.name}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)' }}>{emp.role}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-success)' }}>{emp.present}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-warning)' }}>{emp.late}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-danger)' }}>{emp.absent}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)' }}>{emp.totalHours}h</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <Badge variant={rate >= 90 ? 'success' : rate >= 75 ? 'warning' : 'danger'}>{rate}%</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};
