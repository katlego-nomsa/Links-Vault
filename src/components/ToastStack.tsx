import type { Notification } from '../types';
import './ToastStack.css';

interface ToastStackProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<Notification['type'], string> = {
  success: '✓',
  error: '⚠',
  info: 'ℹ',
};

// Shows feedback for background actions (saved / updated / deleted).
export default function ToastStack({ notifications, onDismiss }: ToastStackProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="toast-stack">
      {notifications.map((n) => (
        <div key={n.id} className={`toast toast-${n.type}`} onClick={() => onDismiss(n.id)}>
          <span className="toast-icon">{ICONS[n.type]}</span>
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
}