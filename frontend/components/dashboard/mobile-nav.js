import { useRef } from 'react'
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { Menu } from '../icons'
import Sidebar from './sidebar';

export default function MobileNav() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const btnRef = useRef()

  const SidebarMobile = Sidebar.SidebarMobile

  return (
    <>
      <IconButton
        aria-label="Navigation Menu"
        variant="ghost"
        display={{ sm: 'flex', md: 'none', lg: 'none'}}
        icon={<Menu h={5} />}
        onClick={onToggle}
        ref={btnRef}
      />
      <Drawer
        size="xs"
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        placement="left"
      >
        <DrawerOverlay zIndex="overlay" />
        <DrawerContent zIndex="drawer">
          <DrawerBody p={0}>
            <SidebarMobile w="full" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
