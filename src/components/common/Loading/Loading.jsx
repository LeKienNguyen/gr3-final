import './Loading.css';

export const Loading = ({
  size = 'md',
  text = 'Đang tải...',
  fullscreen = false,
}) => (
  <div className={`loading${fullscreen ? ' loading--fullscreen' : ''}`} role="status">
    <div className={`loading__spinner loading__spinner--${size}`} aria-hidden="true" />
    {text && <span className="loading__text">{text}</span>}
    <span className="sr-only">{text}</span>
  </div>
);
