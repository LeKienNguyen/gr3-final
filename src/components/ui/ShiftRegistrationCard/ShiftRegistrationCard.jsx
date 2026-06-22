import './ShiftRegistrationCard.css';

export const ShiftRegistrationCard = () => (
  <div className="shift-registration">
    <div className="shift-registration__header">
      <h3 className="shift-registration__title">
        📆 Đăng ký ca làm
      </h3>
    </div>
    <div className="shift-registration__body">
      <p className="shift-registration__description">
        Nhân viên được phép đăng ký hoặc chỉnh sửa ca làm trước 48 giờ.
        Sau thời hạn này chỉ Quản lý mới có thể chỉnh sửa.
      </p>
      <div className="shift-registration__info-box">
        <span className="shift-registration__info-icon">ℹ️</span>
        <div className="shift-registration__info-content">
          <p className="shift-registration__info-title">Quy định đăng ký ca</p>
          <p className="shift-registration__info-text">
            Nhân viên có thể tự đăng ký hoặc đổi ca <strong>trước 48 giờ</strong> so với thời gian ca bắt đầu.
            Sau thời hạn này, chỉ <strong>Quản lý</strong> mới được phép chỉnh sửa hoặc phân công lại ca làm.
          </p>
        </div>
      </div>
    </div>
  </div>
);
