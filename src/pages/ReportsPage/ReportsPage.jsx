import { useState, useCallback } from 'react';
import { PageTitle, Button, Card, Select, Badge } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { employeeService } from '@/services/employee.service';
import { attendanceService } from '@/services/attendance.service';

const REPORT_TYPES = [
  { value: 'attendance', label: 'Báo cáo chấm công tháng' },
  { value: 'hours', label: 'Báo cáo giờ làm việc' },
  { value: 'late', label: 'Báo cáo đi trễ' },
  { value: 'employee', label: 'Tổng hợp nhân viên' },
];

const STATUS_MAP = { completed: { label: 'Hoàn thành', variant: 'success' }, pending: { label: 'Đang xử lý', variant: 'warning' } };

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('attendance');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);
  const toast = useToast();

  const generateReport = useCallback(async () => {
    setGenerating(true);
    try {
      const empSnap = await employeeService.getEmployees();
      const emps = empSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const activeEmps = emps.filter((e) => e.status !== 'inactive');

      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

      const attSnap = await attendanceService.getByDateRange(startDate, endDate);
      const attRecords = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      let reportData = [];
      const label = REPORT_TYPES.find((t) => t.value === reportType)?.label || '';

      if (reportType === 'attendance') {
        reportData = activeEmps.map((emp) => {
          const empAtt = attRecords.filter((a) => a.employeeId === emp.id);
          return {
            name: emp.name,
            role: emp.role,
            present: empAtt.filter((a) => a.status === 'present').length,
            late: empAtt.filter((a) => a.status === 'late').length,
            absent: lastDay - empAtt.filter((a) => a.checkIn).length,
            total: empAtt.filter((a) => a.checkIn).length,
          };
        });
      } else if (reportType === 'hours') {
        reportData = activeEmps.map((emp) => {
          const empAtt = attRecords.filter((a) => a.employeeId === emp.id && a.checkIn && a.checkOut);
          let totalMinutes = 0;
          empAtt.forEach((a) => {
            const [inH, inM] = (a.checkIn || '0:0').split(':').map(Number);
            const [outH, outM] = (a.checkOut || '0:0').split(':').map(Number);
            totalMinutes += (outH * 60 + outM) - (inH * 60 + inM);
          });
          return {
            name: emp.name,
            role: emp.role,
            daysWorked: empAtt.length,
            totalHours: Math.round(totalMinutes / 60 * 10) / 10,
            avgHours: empAtt.length > 0 ? Math.round(totalMinutes / empAtt.length / 60 * 10) / 10 : 0,
          };
        });
      } else if (reportType === 'late') {
        reportData = activeEmps.map((emp) => {
          const empAtt = attRecords.filter((a) => a.employeeId === emp.id);
          const lateDays = empAtt.filter((a) => a.status === 'late');
          return {
            name: emp.name,
            role: emp.role,
            lateCount: lateDays.length,
            lateDates: lateDays.map((l) => l.date).join(', '),
          };
        }).filter((e) => e.lateCount > 0).sort((a, b) => b.lateCount - a.lateCount);
      } else {
        reportData = activeEmps.map((emp) => ({
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          role: emp.role,
          status: emp.status,
        }));
      }

      const newReport = {
        id: String(Date.now()),
        name: `${label} — T${month}/${year}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        data: reportData,
        period: `${month}/${year}`,
      };
      setReports((prev) => [newReport, ...prev]);
      setReportDetail(newReport);
      toast.success(`Đã tạo ${label}`);
    } catch (err) {
      toast.error('Lỗi tạo báo cáo: ' + err.message);
    } finally {
      setGenerating(false);
    }
  }, [reportType, month, year, toast]);

  const downloadReport = (report) => {
    let csv = '';
    const data = report.data || [];
    if (data.length === 0) {
      toast.error('Báo cáo không có dữ liệu');
      return;
    }
    const headers = Object.keys(data[0]);
    csv += headers.join(',') + '\n';
    data.forEach((row) => {
      csv += headers.map((h) => `"${row[h] ?? ''}"`).join(',') + '\n';
    });
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.name}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Đã tải "${report.name}"`);
  };

  const deleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (reportDetail?.id === id) setReportDetail(null);
    toast.success('Đã xóa báo cáo');
  };

  const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: `Tháng ${i + 1}` }));
  const YEARS = [{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }];

  return (
    <PageContainer>
      <PageTitle title="Báo cáo" subtitle="Báo cáo nhân sự và hoạt động" />

      <Card title="Tạo báo cáo mới" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Select id="report-type" label="Loại báo cáo" options={REPORT_TYPES} value={reportType} onChange={(e) => setReportType(e.target.value)} />
          </div>
          <div style={{ minWidth: 120 }}>
            <Select id="report-month" label="Tháng" options={MONTHS} value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div style={{ minWidth: 100 }}>
            <Select id="report-year" label="Năm" options={YEARS} value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <Button onClick={generateReport} loading={generating}>Tạo báo cáo</Button>
        </div>
      </Card>

      {reportDetail && (
        <Card title={reportDetail.name} style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {reportDetail.data.length > 0 && Object.keys(reportDetail.data[0]).map((h) => (
                    <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportDetail.data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-caption)' }}>{val ?? '—'}</td>
                    ))}
                  </tr>
                ))}
                {reportDetail.data.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card title="Báo cáo đã tạo">
        {reports.length === 0 ? (
          <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)' }}>Chưa có báo cáo nào. Chọn loại báo cáo và nhấn "Tạo báo cáo" để bắt đầu.</p>
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
                        <Button size="sm" variant="ghost" onClick={() => setReportDetail(r)}>Xem</Button>
                        <Button size="sm" variant="ghost" onClick={() => downloadReport(r)}>Tải CSV</Button>
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
