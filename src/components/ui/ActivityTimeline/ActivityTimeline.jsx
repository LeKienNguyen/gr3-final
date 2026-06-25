import { useState, useEffect } from 'react';
import { activityService } from '@/services/activity.service';
import './ActivityTimeline.css';

const TYPE_ICONS = {
  checkin: '✅',
  checkout: '🚪',
  shift: '📅',
  checklist: '📋',
  employee: '👤',
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

export const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await activityService.getRecent(10);
        setActivities(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setActivities([]);
      }
    };
    fetch();
  }, []);

  return (
    <div className="activity-timeline">
      <div className="activity-timeline__header">
        <h3 className="activity-timeline__title">
          🕐 Hoạt động gần đây
        </h3>
      </div>
      <div className="activity-timeline__list">
        {activities.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-4)', fontSize: 'var(--font-size-caption)' }}>Chưa có hoạt động nào</p>
        ) : activities.map((activity) => (
          <div key={activity.id} className="activity-timeline__item">
            <div className="activity-timeline__dot-wrapper">
              <div className={`activity-timeline__dot activity-timeline__dot--${activity.type || 'checkin'}`}>
                {TYPE_ICONS[activity.type] || '📌'}
              </div>
            </div>
            <div className="activity-timeline__content">
              <p className="activity-timeline__text">{activity.text}</p>
              <p className="activity-timeline__time">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
