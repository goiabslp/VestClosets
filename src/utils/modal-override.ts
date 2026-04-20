import { ModalService } from '../store/useModalStore';

export const overrideNativeModals = () => {
  if (typeof window === 'undefined') return;

  window.alert = (message?: unknown) => {
    ModalService.alert(String(message));
  };

  window.confirm = () => {
    console.error(
      'Native window.confirm was called! It is disabled. Use ModalService.confirm() instead as it is asynchronous.'
    );
    return false;
  };

  window.prompt = () => {
    console.error(
      'Native window.prompt was called! It is disabled. Use ModalService.prompt() instead as it is asynchronous.'
    );
    return null;
  };
};
