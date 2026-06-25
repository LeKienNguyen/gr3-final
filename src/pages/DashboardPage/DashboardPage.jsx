import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeBanner } from '@/components/ui/WelcomeBanner';
import { KpiCard } from '@/components/ui/KpiCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { ShiftCard } from '@/components/ui/ShiftCard';
import { AttendanceTable } from '@/components/ui/AttendanceTable';
import { ChecklistCard } from '@/components/ui/ChecklistCard';
import { ShiftRegistrationCard } from '@/components/ui/ShiftRegistrationCard';
import { ActivityTimeline } from '@/components/ui/ActivityTimeline';
import { CheckInCard } from '@/components/ui/CheckInCard/CheckInCard';
import { MyScheduleCard } from '@/components/ui/MyScheduleCard/MyScheduleCard';
import { MyAttendanceCard } from '@/components/ui/MyAttendanceCard/MyAttendanceCard';
import { employeeService } from '@/services/employee.service';
import { attendanceService } from '@/services/attendance.service';
import { scheduleService } from '@/services/schedule.service';
import { checklistService } from '@/services/checklist.service';
import { useAuth } from '@/hooks/useAuth';
import './DashboardPage.css';

const todayStr = () => new Date().toISOString().split('T')[0];

const getWeekStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 1);
  return d.toISOString().split('T')[0];
};

const getWeekDays = () => {
  const days = [];
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }),
    });
  }
  return days;
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isManager, userProfile, user } = useAuth();

  const [kpiData, setKpiData] = useState([
    { icon: '👥', label: 'Tổng nhân viên', value: '—', description: 'Đang tải...', color: 'red', path: '/employees' },
    { icon: '✅', label: 'Đã chấm công hôm nay', value: '—', description: 'Đang tải...', color: 'green', path: '/attendance' },
    { icon: '📅', label: 'Ca làm hôm nay', value: '—', description: 'Đang tải...', color: 'blue', path: '/shift-registration' },
    { icon: '🧹', label: 'Checklist hôm nay', value: '—', description: 'Đang tải...', color: 'yellow', path: '/checklist' },
  ]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [checklistData, setChecklistData] = useState([]);

  const [myAttendance, setMyAttendance] = useState(null);
  const [myWeekSchedule, setMyWeekSchedule] = useState([]);
  const [myMonthStats, setMyMonthStats] = useState({ present: 0, late: 0, absent: 0, totalHours: 0 });
  const [empKpiData, setEmpKpiData] = useState([]);

  const myId = userProfile?.id || user?.uid;

  const fetchManagerData = useCallback(async () => {
    try {
      const [empSnap, attSnap, schedSnap, clSnap] = await Promise.all([
        employeeService.getEmployees(),
        attendanceService.getByDate(todayStr()),
        scheduleService.getByWeek(getWeekStart()),
        checklistService.getByDate(todayStr()),
      ]);

      const emps = empSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const activeEmps = emps.filter((e) => e.status !== 'inactive');
      const attRecords = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const todaySchedules = schedSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((s) => s.date === todayStr() && s.type !== 'weekMeta');
      const todayChecklists = clSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const checkedIn = attRecords.filter((a) => a.checkIn).length;
      const pct = activeEmps.length > 0 ? Math.round((checkedIn / activeEmps.length) * 100) : 0;

      const shiftCounts = { morning: 0, afternoon: 0, evening: 0 };
      todaySchedules.forEach((s) => { if (shiftCounts[s.shift] !== undefined) shiftCounts[s.shift]++; });
      const totalShifts = shiftCounts.morning + shiftCounts.afternoon + shiftCounts.evening;
      const shiftDesc = [shiftCounts.morning && 'Sáng', shiftCounts.afternoon && 'Chiều', shiftCounts.evening && 'Tối'].filter(Boolean).join(' · ') || 'Không có ca';

      const totalItems = todayChecklists.reduce((sum, cl) => sum + (cl.items?.length || 0), 0);
      const doneItems = todayChecklists.reduce((sum, cl) => sum + (cl.items?.filter((i) => i.checked).length || 0), 0);
      const clPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

      setKpiData([
        { icon: '👥', label: 'Tổng nhân viên', value: String(activeEmps.length), description: 'Đang hoạt động', color: 'red', path: '/employees' },
        { icon: '✅', label: 'Đã chấm công hôm nay', value: String(checkedIn), description: `${pct}% nhân viên`, color: 'green', path: '/attendance' },
        { icon: '📅', label: 'Ca làm hôm nay', value: String(totalShifts), description: shiftDesc, color: 'blue', path: '/shift-registration' },
        { icon: '🧹', label: 'Checklist hôm nay', value: `${doneItems}/${totalItems}`, description: `${clPct}% hoàn thành`, color: 'yellow', path: '/checklist' },
      ]);

      setAttendanceData(attRecords.slice(0, 5));

      const SHIFT_LABELS = { morning: 'Ca sáng (6:00 - 14:00)', afternoon: 'Ca chiều (14:00 - 22:00)', evening: 'Ca tối (22:00 - 6:00)' };
      const hour = new Date().getHours();
      const currentShift = hour < 14 ? 'morning' : hour < 22 ? 'afternoon' : 'evening';
      setShiftData(todaySchedules.map((s) => {
        const emp = emps.find((e) => e.id === s.employeeId);
        const name = emp?.name || s.employeeName || 'N/A';
        return {
          id: s.id,
          name,
          initials: name.split(' ').slice(-2).map((n) => n[0]).join(''),
          shift: SHIFT_LABELS[s.shift] || s.shift,
          status: s.shift === currentShift ? 'active' : (s.shift === 'morning' && hour >= 14) || (s.shift === 'afternoon' && hour >= 22) ? 'off' : 'upcoming',
          statusLabel: s.shift === currentShift ? 'Đang làm' : (s.shift === 'morning' && hour >= 14) || (s.shift === 'afternoon' && hour >= 22) ? 'Đã kết thúc' : 'Sắp tới',
        };
      }));

      setChecklistData(todayChecklists);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  }, []);

  const fetchEmployeeData = useCallback(async () => {
    if (!myId) return;
    try {
      const [attSnap, schedSnap, clSnap] = await Promise.all([
        attendanceService.getByDate(todayStr()),
        scheduleService.getByWeek(getWeekStart()),
        checklistService.getByDate(todayStr()),
      ]);

      const attRecords = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const myAtt = attRecords.find((a) => a.employeeId === myId) || null;
      setMyAttendance(myAtt);

      const allSchedules = schedSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const mySchedules = allSchedules.filter((s) => s.employeeId === myId && s.type !== 'weekMeta');
      setMyWeekSchedule(mySchedules);

      const todayChecklists = clSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChecklistData(todayChecklists);

      const myTodayShift = mySchedules.find((s) => s.date === todayStr());
      const SHIFT_LABELS_SHORT = { morning: 'Ca sáng', afternoon: 'Ca chiều', evening: 'Ca tối' };
      const todayShiftLabel = myTodayShift ? SHIFT_LABELS_SHORT[myTodayShift.shift] : 'Không có ca';
      const weekShifts = mySchedules.length;

      const totalItems = todayChecklists.reduce((sum, cl) => sum + (cl.items?.length || 0), 0);
      const doneItems = todayChecklists.reduce((sum, cl) => sum + (cl.items?.filter((i) => i.checked).length || 0), 0);
      const clPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

      setEmpKpiData([
        { icon: '📅', label: 'Ca làm hôm nay', value: todayShiftLabel, description: myTodayShift ? 'Đã phân công' : 'Nghỉ hôm nay', color: 'blue', path: '/shift-registration' },
        { icon: '📆', label: 'Ca trong tuần', value: String(weekShifts), description: `${7 - weekShifts} ngày nghỉ`, color: 'green', path: '/shift-registration' },
        { icon: '🧹', label: 'Checklist hôm nay', value: `${doneItems}/${totalItems}`, description: `${clPct}% hoàn thành`, color: 'yellow', path: '/checklist' },
      ]);

      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      try {
        const monthSnap = await attendanceService.getByDateRange(monthStart, monthEnd);
        const monthRecords = monthSnap.docs.map((d) => d.data()).filter((a) => a.employeeId === myId);
        const present = monthRecords.filter((a) => a.status === 'present').length;
        const late = monthRecords.filter((a) => a.status === 'late').length;
        const totalCheckedIn = monthRecords.filter((a) => a.checkIn).length;
        const daysPassed = now.getDate();
        const absent = Math.max(0, daysPassed - totalCheckedIn);

        let totalMinutes = 0;
        monthRecords.filter((a) => a.checkIn && a.checkOut).forEach((a) => {
          const [inH, inM] = (a.checkIn || '0:0').split(':').map(Number);
          const [outH, outM] = (a.checkOut || '0:0').split(':').map(Number);
          totalMinutes += (outH * 60 + outM) - (inH * 60 + inM);
        });

        setMyMonthStats({ present, late, absent, totalHours: Math.round(totalMinutes / 60) });
      } catch {
        // Monthly stats optional
      }
    } catch (err) {
      console.error('Employee dashboard fetch error:', err);
    }
  }, [myId]);

  useEffect(() => {
    if (isManager) {
      fetchManagerData();
    } else {
      fetchEmployeeData();
    }
  }, [isManager, fetchManagerData, fetchEmployeeData]);

  if (isManager) {
    return (
      <div className="dashboard">
        <WelcomeBanner />
        <QuickActions />

        <div className="dashboard__kpi-grid">
          {kpiData.map((kpi, index) => (
            <KpiCard
              key={kpi.label}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              description={kpi.description}
              color={kpi.color}
              delay={index * 80}
              onClick={() => navigate(kpi.path)}
            />
          ))}
        </div>

        <div className="dashboard__two-cols">
          <ShiftCard data={shiftData} />
          <AttendanceTable data={attendanceData} />
        </div>

        <div className="dashboard__three-cols">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <ShiftRegistrationCard />
            <ChecklistCard data={checklistData} />
          </div>
          <ActivityTimeline />
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="dashboard">
      <WelcomeBanner />
      <QuickActions />

      <div className="dashboard__kpi-grid dashboard__kpi-grid--three">
        {empKpiData.map((kpi, index) => (
          <KpiCard
            key={kpi.label}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            description={kpi.description}
            color={kpi.color}
            delay={index * 80}
            onClick={() => navigate(kpi.path)}
          />
        ))}
      </div>

      <div className="dashboard__two-cols">
        <CheckInCard
          attendance={myAttendance}
          employeeId={myId}
          employeeName={userProfile?.name || user?.displayName || ''}
          onUpdate={fetchEmployeeData}
        />
        <MyAttendanceCard {...myMonthStats} />
      </div>

      <MyScheduleCard weekSchedule={myWeekSchedule} weekDays={weekDays} />

      <div className="dashboard__two-cols">
        <ChecklistCard data={checklistData} />
        <ShiftRegistrationCard />
      </div>
    </div>
  );
};
