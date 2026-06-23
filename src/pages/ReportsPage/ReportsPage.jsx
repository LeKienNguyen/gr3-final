import { useState } from 'react';
import { PageTitle, Button, Card, Select, Badge } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';

const REPORT_TYPES = [
  { value: 'attendance', label: 'Báo cáo chấm công' },
  { value: 'shift', label: 'Báo cáo ca làm' },
  { value: 'checklist', label: 'Báo cáo checklist vệ sinh' },
  { value: 'employee', label: 'Báo cáo nhân sự' },
];

const RECENT_REPORTS = [
  { id: '1', name: 'Báo cáo chấm công T6/2026', type: 'attendance', date: '2026-06-01', status: 'completed' },
  { id: '2', name: 'Báo cáo ca làm T6/2026', type: 'shift', date: '2026-06-01', status: 'completed' },
  { id: '3', name: 'Báo cáo checklist tuần 25', type: 'checklist', date: '2026-06-16', status: 'completed' },
  { id: '4', name: 'Báo cáo nhân sự Q2/2026', type: 'employee', date: '2026-06-01', status: 'pending' },
];

const STATUS_MAP = { completed: { label: 'Hoàn thành', variant: 'success' }, pending: { label: 'Đang xử lý', variant: 'warning' } };

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('attendance');
  const [reports, setReports] = useState(RECENT_REPORTS);
  const [generating, setGenerating] = useState(false);
  const toast = useToast();

  const generate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const label = REPORT_TYPES.find((t) => t.value === reportType)?.label || '';
    const newReport = {
      id: String(Date.now()),
      name: `${label} — ${new Date().toLocaleDateString('vi-VN')}`,
      type: reportType,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setReports((prev) => [newReport, ...prev]);
    setGenerating(false);
    toast.success(`Đã tạo ${label}`);
  };

  const downloadReport = (report) => {
    toast.info(`Đang tải "${report.name}"...`);
  };

  const deleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success('Đã xóa báo cáo');
  };

  return (
    <PageContainer>
      <PageTitle title="Báo cáo" subtitle="Báo cáo nhân sự và hoạt động" />

      <Card title="Tạo báo cáo mới" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Select id="report-type" label="Loại báo cáo" options={REPORT_TYPES} value={reportType} onChange={(e) => setReportType(e.target.value)} />
          </div>
          <Button onClick={generate} loading={generating}>Tạo báo cáo</Button>
        </div>
      </Card>

      <Card title="Báo cáo gần đây">
        {reports.length === 0 ? (
          <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)' }}>Chưa có báo cáo nào</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Tên báo cáo', 'Ngày tạo', 'Trạng thái', 'Thao tác'].map((h) => (
                    <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>{r.date}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}><Badge variant={STATUS_MAP[r.status]?.variant}>{STATUS_MAP[r.status]?.label}</Badge></td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button size="sm" variant="ghost" onClick={() => downloadReport(r)}>Tải xuống</Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteReport(r.id)} style={{ color: 'var(--color-danger)' }}>Xóa</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};
