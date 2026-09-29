import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: ReactNode;
}

// this is One reusable button used everywhere (add, save, cancel, delete).
export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}