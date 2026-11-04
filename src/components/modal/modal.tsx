import { FC, ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ModalUI } from '@ui';

type TModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const modalRoot = document.getElementById('modals') as HTMLElement;

export const Modal: FC<TModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
};
