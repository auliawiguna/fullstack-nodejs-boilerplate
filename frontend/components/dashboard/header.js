import NextLink from 'next/link';
import { Button, IconButton, Flex, useColorModeValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import ThemeToggle from '../theme-toggle';
import MobileNav from './mobile-nav';
import axios from 'axios'
import { MY_APP } from '@config/constants';
import { FaSignOutAlt, FaUserCog } from "react-icons/fa"
import { useSession, signOut } from "next-auth/react"
import Swal from 'sweetalert2'


export default function Header() {
  const { data: session } = useSession()    
  const bgColor = useColorModeValue('white', 'gray.800');
  const logout = async () => {
    Swal.fire({
      title: 'Sign Out',
      text: "Terminate current session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign me out!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // remove user from local storage, publish null to user subscribers and redirect to login page
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/sign-out`
    
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
        return await axios.post(url).then((response) => {
            if (response.data.data) {
              signOut()    
            } else {
                return false
            }
        })
      }
    })
  
  }


  return (
    <Flex
      as="header"
      position="fixed"
      top={0}
      left={{ sm:0, md:64, lg:64}}
      right={0}
      align="center"
      h={16}
      px={[4, 6, 8]}
      bg={bgColor}
      zIndex="docked"
    >
      <Flex w="full" align="center" justify="center">
        <Flex w="full" align="center" justify="space-between">
          <Flex align="center">
            <NextLink href="/dashboard" passHref>
              <Button as="a" variant="ghost" px={0} fontWeight="bold">
                {MY_APP}
              </Button>
            </NextLink>
          </Flex>
          <Flex>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<FaUserCog />}
                variant='outline'
                borderWidth={0}
              />
              <MenuList>
                <MenuItem onClick={logout} icon={<FaSignOutAlt />} command='⌘Q'>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>            
            <ThemeToggle mr={`-${3}`} />
            <MobileNav />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
