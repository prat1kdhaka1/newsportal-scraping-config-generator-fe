'use client'
import { AppShell, Box, Group, Paper, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import Sidebar from './Sidebar';


interface AppLayoutPropsType {
  children: React.ReactNode
}

const AppLayout = (props: AppLayoutPropsType) => {
  const { children } = props

  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();



  return (

    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: { base: 100 },
        breakpoint: '',
        collapsed: { mobile: false, desktop: false }
      }}
    >

      <Paper
        styles={{
          root: {
            backgroundColor: (colorScheme === 'dark' || colorScheme === 'auto')
              ? theme.colors.dark[5]
              : theme.colors.gray[0]
          },
        }}
      >
        <Box>
          <Box>
            <AppShell.Header
              // zIndex={300}
              withBorder={false}
            >
              <Group
                justify='space-between'
                align='center'

              >
                <Group >
                  {/* <Header title='NewsHub'></Header> */}
                </Group>
              </Group>

            </AppShell.Header>
            <AppShell.Navbar
              // p="md"
              // zIndex={300}
              className='border-none'
            >
              <Sidebar />
            </AppShell.Navbar>
          </Box>
          <Box>
            <AppShell.Main>

              {children}

            </AppShell.Main>
          </Box>
        </Box>
      </Paper>

    </AppShell>
  )
}

export default AppLayout
