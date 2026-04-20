import { create } from 'zustand';

export type ModalType = 'info' | 'confirm' | 'error' | 'success' | 'prompt';

export interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string; // used for prompt
  dismissible?: boolean;
}

interface ModalState {
  isOpen: boolean;
  options: ModalOptions | null;
  resolvePromise: ((value: unknown) => void) | null;
}

interface ModalStore extends ModalState {
  showModal: (options: ModalOptions) => Promise<unknown>;
  closeModal: (value?: unknown) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  isOpen: false,
  options: null,
  resolvePromise: null,

  showModal: (options) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        options: {
          dismissible: true,
          confirmText: 'OK',
          cancelText: 'Cancelar',
          ...options,
          type: options.type || 'info',
        },
        resolvePromise: resolve,
      });
    });
  },

  closeModal: (value = null) => {
    const { resolvePromise } = get();
    if (resolvePromise) {
      resolvePromise(value);
    }
    set({ isOpen: false });
    // setTimeout to allow fade out animation to finish before clearing options
    setTimeout(() => {
      set((state) => {
        if (!state.isOpen) return { options: null, resolvePromise: null };
        return {};
      });
    }, 200);
  },
}));

export const ModalService = {
  alert: (message: string, title = 'Informação') =>
    useModalStore.getState().showModal({ type: 'info', title, message }),
  confirm: (
    message: string,
    title = 'Confirmação',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
  ) =>
    useModalStore
      .getState()
      .showModal({ type: 'confirm', title, message, confirmText, cancelText }),
  error: (message: string, title = 'Erro') =>
    useModalStore.getState().showModal({ type: 'error', title, message }),
  success: (message: string, title = 'Sucesso') =>
    useModalStore.getState().showModal({ type: 'success', title, message }),
  prompt: (message: string, defaultValue = '', title = 'Entrada') =>
    useModalStore.getState().showModal({ type: 'prompt', title, message, defaultValue }),
};
