import { useState } from 'react';

type UseModalReturnType = {
  isOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  toggleModal: (val: boolean) => void;
};

const useModal = (): UseModalReturnType => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const showModal = () => setIsOpen(true);
  const hideModal = () => setIsOpen(false);

  return {
    showModal,
    hideModal,
    toggleModal: setIsOpen,
    isOpen,
  };
};

export default useModal;
