import NextLink from 'next/link';
import { Button, IconButton, Flex, useColorModeValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import ThemeToggle from '../theme-toggle';
import MobileNav from './mobile-nav';
import { MY_APP } from '@config/constants';
import { FaHamburger, FaSignOutAlt, FaUserCog } from "react-icons/fa"
import { AddIcon } from '@chakra-ui/icons'

const logout = async () => {
  alert('a')
}

export default function Header() {
  const bgColor = useColorModeValue('white', 'gray.800');

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
