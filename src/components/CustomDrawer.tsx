import { Drawer } from '@mantine/core'
interface CustomDrawerPropsType {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomDrawer = (props: CustomDrawerPropsType) => {
  const { opened, onClose, title, children } = props;

  return (
    <div>
      <Drawer opened={opened} onClose={onClose} title={title}
        position='right'
        size={'35%'}
      >
        {children}
      </Drawer>

    </div>
  )
}

export default CustomDrawer