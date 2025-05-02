import { Modal } from '@mantine/core';
interface ConfirmModalProps {
  children: React.ReactNode;
  title: string
  opened: boolean;
  close: VoidFunction;
}
const ConfirmModal = ({ children, title, opened, close }: ConfirmModalProps) => {

  return (
    <>
      <Modal opened={opened} onClose={close} title={title}>
        {children}
      </Modal>
    </>
  )
}

export default ConfirmModal