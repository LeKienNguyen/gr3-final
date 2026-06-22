import './ActivityTimeline.css';

const PLACEHOLDER_ACTIVITIES = [
  { id: 1, type: 'checkin', icon: '✅', text: '<strong>Nguyễn Văn A</strong> đã Check-in ca sáng', time: '5 phút trước' },
  { id: 2, type: 'shift', icon: '📅', text: '<strong>Trần Văn B</strong> đăng ký ca chiều thứ 7', time: '15 phút trước' },
  { id: 3, type: 'checklist', icon: '📋', text: 'Checklist vệ sinh buổi sáng <strong>đã được tạo</strong>', time: '30 phút trước' },
  { id: 4, type: 'checkout', icon: '🚪', text: '<strong>Phạm Thị D</strong> đã Check-out ca sáng', time: '1 giờ trước' },
  { id: 5, type: 'checkin', icon: '✅', text: '<strong>Lê Văn C</strong> đã Check-in ca sáng', time: '2 giờ trước' },
];

export const ActivityTimeline = () => (
  <div className="activity-timeline">
    <div className="activity-timeline__header">
      <h3 className="activity-timeline__title">
        🕐 Hoạt động gần đây
      </h3>
    </div>
    <div className="activity-timeline__list">
      {PLACEHOLDER_ACTIVITIES.map((activity) => (
        <div key={activity.id} className="activity-timeline__item">
          <div className="activity-timeline__dot-wrapper">
            <div className={`activity-timeline__dot activity-timeline__dot--${activity.type}`}>
              {activity.icon}
            </div>
          </div>
          <div className="activity-timeline__content">
            <p
              className="activity-timeline__text"
              dangerouslySetInnerHTML={{ __html: activity.text }}
            />
            <p className="activity-timeline__time">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
