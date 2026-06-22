import { Modal } from '../Modal';
import { Button } from '../Button';
import './ConfirmDialog.css';

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
    <p className="confirm-dialog__message">{message}</p>
    <div className="confirm-dialog__actions">
      <Button variant="ghost" onClick={onCancel} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </div>
  </Modal>
);
