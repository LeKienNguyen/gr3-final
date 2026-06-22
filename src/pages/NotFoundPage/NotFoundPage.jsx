import { Link } from 'react-router-dom';
import { Button } from '@/components/common';
import './NotFoundPage.css';

export const NotFoundPage = () => (
  <div className="not-found">
    <span className="not-found__code">404</span>
    <h1 className="not-found__title">Không tìm thấy trang</h1>
    <p className="not-found__description">
      Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
    </p>
    <Link to="/dashboard">
      <Button>Về trang chủ</Button>
    </Link>
  </div>
);
