import { WelcomeBanner } from '@/components/ui/WelcomeBanner';
import { KpiCard } from '@/components/ui/KpiCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { ShiftCard } from '@/components/ui/ShiftCard';
import { AttendanceTable } from '@/components/ui/AttendanceTable';
import { ChecklistCard } from '@/components/ui/ChecklistCard';
import { ShiftRegistrationCard } from '@/components/ui/ShiftRegistrationCard';
import { ActivityTimeline } from '@/components/ui/ActivityTimeline';
import './DashboardPage.css';

const KPI_DATA = [
  { icon: '👥', label: 'Tổng nhân viên', value: '24', description: 'Đang hoạt động', color: 'red' },
  { icon: '✅', label: 'Đã chấm công hôm nay', value: '18', description: '75% nhân viên', color: 'green' },
  { icon: '📅', label: 'Ca làm hôm nay', value: '3', description: 'Sáng · Chiều · Tối', color: 'blue' },
  { icon: '🧹', label: 'Checklist đã hoàn thành', value: '2/5', description: '40% hoàn thành', color: 'yellow' },
];

export const DashboardPage = () => (
  <div className="dashboard">
    <WelcomeBanner />

    <QuickActions />

    <div className="dashboard__kpi-grid">
      {KPI_DATA.map((kpi, index) => (
        <KpiCard
          key={kpi.label}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          description={kpi.description}
          color={kpi.color}
          delay={index * 80}
        />
      ))}
    </div>

    <div className="dashboard__two-cols">
      <ShiftCard />
      <AttendanceTable />
    </div>

    <div className="dashboard__three-cols">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <ShiftRegistrationCard />
        <ChecklistCard />
      </div>
      <ActivityTimeline />
    </div>
  </div>
);
