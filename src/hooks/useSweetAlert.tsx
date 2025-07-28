import { useState, useCallback } from 'react';

export interface SweetAlertOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const useSweetAlert = () => {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    options: SweetAlertOptions;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    options: {
      type: 'info',
      title: ''
    }
  });

  const showAlert = useCallback((options: SweetAlertOptions, onConfirm?: () => void) => {
    setAlertState({
      isOpen: true,
      options,
      onConfirm
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ type: 'success', title, message }, onConfirm);
  }, [showAlert]);

  const showError = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ type: 'error', title, message }, onConfirm);
  }, [showAlert]);

  const showWarning = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ type: 'warning', title, message }, onConfirm);
  }, [showAlert]);

  const showInfo = useCallback((title: string, message?: string, onConfirm?: () => void) => {
    showAlert({ type: 'info', title, message }, onConfirm);
  }, [showAlert]);

  const showConfirm = useCallback((
    title: string, 
    message?: string, 
    onConfirm?: () => void,
    confirmText = 'Yes',
    cancelText = 'No'
  ) => {
    showAlert({ 
      type: 'warning', 
      title, 
      message, 
      showCancel: true, 
      confirmText, 
      cancelText 
    }, onConfirm);
  }, [showAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };
};