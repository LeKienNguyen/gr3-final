import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageTitle, Select, Badge, Button, Loading } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { employeeService } from '@/services/employee.service';
import { attendanceService } from '@/services/attendance.service';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: `Tháng ${i + 1}` }));
const YEARS = [{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }];

export const MonthlySummaryPage = () => {
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [employees, setEmployees] = useState([]);
  const [attRecords, setAttRecords] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const toast = useToast();
  const { isManager, userProfile, user } = useAuth();
  const myId = userProfile?.id || user?.uid;

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      if (isManager) {
        const empSnap = await employeeService.getEmployees();
        setEmployees(empSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((e) => e.status !== 'inactive'));
      } else {
        setEmployees([{
          id: myId,
          name: userProfile?.name || user?.displayName || '',
          role: userProfile?.role || 'employee',
        }]);
      }

      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

      const attSnap = await attendanceService.getByDateRange(startDate, endDate);
      const allRecords = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAttRecords(isManager ? allRecords : allRecords.filter((a) => a.employeeId === myId));
    } catch {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoadingData(false);
    }
  }, [month, year, isManager, myId, userProfile, user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const employeeStats = useMemo(() => {
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    return employees.map((emp) => {
      const empAtt = attRecords.filter((a) => a.employeeId === emp.id);
      const present = empAtt.filter((a) => a.status === 'present').length;
      const late = empAtt.filter((a) => a.status === 'late').length;
      const totalCheckedIn = empAtt.filter((a) => a.checkIn).length;
      const absent = Math.max(0, lastDay - totalCheckedIn);

      let totalMinutes = 0;
      empAtt.filter((a) => a.checkIn && a.checkOut).forEach((a) => {
        const [inH, inM] = (a.checkIn || '0:0').split(':').map(Number);
        const [outH, outM] = (a.checkOut || '0:0').split(':').map(Number);
        totalMinutes += (outH * 60 + outM) - (inH * 60 + inM);
      });

      return {
        name: emp.name,
        role: emp.role,
        present,
        late,
        absent,
        totalHours: Math.round(totalMinutes / 60),
      };
    });
  }, [employees, attRecords, month, year]);

  const totals = useMemo(() => employeeStats.reduce((acc, e) => ({
    present: acc.present + e.present,
    late: acc.late + e.late,
    absent: acc.absent + e.absent,
    hours: acc.hours + e.totalHours,
  }), { present: 0, late: 0, absent: 0, hours: 0 }), [employeeStats]);

  const exportReport = () => {
    let csv = 'Nhân viên,Vai trò,Có mặt,Đi trễ,Vắng,Tổng giờ,Đánh giá\n';
    employeeStats.forEach((emp) => {
      const total = emp.present + emp.late + emp.absent;
      const rate = total > 0 ? Math.round((emp.present / total) * 100) : 0;
      csv += `"${emp.name}","${emp.role}",${emp.present},${emp.late},${emp.absent},${emp.totalHours},${rate}%\n`;
    });
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tong-cong-thang-${month}-${year}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Đã xuất báo cáo tổng công tháng');
  };

  if (loadingData) return <PageContainer><Loading text="Đang tải dữ liệu..." /></PageContainer>;

  return (
    <PageContainer>
      <PageTitle
        title={isManager ? 'Tổng công tháng' : 'Tổng công của tôi'}
        subtitle={isManager ? 'Tổng hợp công theo tháng' : 'Xem tổng giờ làm việc của bạn'}
        action={isManager && <Button onClick={exportReport}>Xuất báo cáo</Button>}
      />

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
            {employeeStats.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Không có dữ liệu</td></tr>
            ) : employeeStats.map((emp) => {
              const total = emp.present + emp.late + emp.absent;
              const rate = total > 0 ? Math.round((emp.present / total) * 100) : 0;
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
