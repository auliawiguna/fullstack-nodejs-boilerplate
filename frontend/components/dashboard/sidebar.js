import {
  Box,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { NavLink } from './nav-link';
import {
  Home,
  UserGroup,
  Folder,
  Calendar,
  Inbox,
  ChartSquareBar,
  LogoMark,
  LogoOnDark,
  Template,
  ClipboardList
} from '../icons'
import { FaHome, FaUsers, FaBookmark, FaRobot, FaTable } from "react-icons/fa"

const SidebarLink = ({ href, children, icon }) => (
  <NavLink href={href}>
    <Flex align="center">
      <Box as={icon} mr={3} w={6} />
      <Text fontSize="sm" fontWeight="medium">
        {children}
      </Text>
    </Flex>
  </NavLink>
)

const SidebarAnchor = ({ href, children, icon }) => (
  <NavLink href={href}>
    <Flex align="center">
      {children}
    </Flex>
  </NavLink>
);


function PageLinks() {
  return (
    <VStack w="full" spacing={1}>
      <SidebarAnchor href="/admin/dashboard">
        <Box mr={1} w={6}><FaHome /></Box>
        <Text fontSize="sm" fontWeight="medium">
          Dashboard
        </Text>
      </SidebarAnchor>
      <SidebarAnchor href="/admin/users">
        <Box mr={1} w={6}><FaUsers /></Box>
        <Text fontSize="sm" fontWeight="medium">
          Users
        </Text>
      </SidebarAnchor>
      <SidebarAnchor href="/admin/permissions">
        <Box mr={1} w={6}><FaBookmark /></Box>
        <Text fontSize="sm" fontWeight="medium">
          Permissions
        </Text>
      </SidebarAnchor>
      <SidebarAnchor href="/admin/roles">
        <Box mr={1} w={6}><FaRobot /></Box>
        <Text fontSize="sm" fontWeight="medium">
          Roles
        </Text>
      </SidebarAnchor>
      <SidebarAnchor href="/admin/permission-matrix">
        <Box mr={1} w={6}><FaTable /></Box>
        <Text fontSize="sm" fontWeight="medium">
          Permission Matrix
        </Text>
      </SidebarAnchor>
    </VStack>
  );
}

function SidebarContainer(props) {
  return (
    <Box
      as="aside"
      position="fixed"
      top={0}
      w={64}
      display={{sm: 'none', md: 'block', lg: 'block'}}
      h="full"
      {...props}
    />
  );
}

function SidebarContainerMobile(props) {
  return (
    <Box
      as="aside"
      position="fixed"
      top={0}
      w={64}
      display={{sm: 'block', md: 'none', lg: 'block'}}
      h="full"
      {...props}
    />
  );
}

const SidebarDesktop = (props) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <>
    <SidebarContainer bg={bgColor}>
      <Flex w="full" align="center" h={16} p={3}>
        <Flex boxSize="full" align="center" px={3}>
          <Flex boxSize="full" align="center">
            <Box
              as={LogoMark}
              h={8}
              w="auto"
              display={{ base: 'block', lg: 'none' }}
            />

            <Box
              as={LogoOnDark}
              h={8}
              w="auto"
              display={{ base: 'none', lg: 'block' }}
            />
          </Flex>
        </Flex>
      </Flex>
      <VStack
        as="nav"
        aria-label="Main navigation desktop"
        position="relative"
        h="calc(100vh - 4rem)"
        p={3}
        overflowY="auto"
        {...props}
      >
        <PageLinks />
      </VStack>
    </SidebarContainer>

    </>
  )
}

const SidebarMobile = (props) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <>
    <SidebarContainerMobile bg={bgColor}>
      <Flex w="full" align="center" h={16} p={3}>
        <Flex boxSize="full" align="center" px={3}>
          <Flex boxSize="full" align="center">
            <Box
              as={LogoMark}
              h={8}
              w="auto"
              display={{ base: 'block', lg: 'none' }}
            />

            <Box
              as={LogoOnDark}
              h={8}
              w="auto"
              display={{ base: 'none', lg: 'block' }}
            />
          </Flex>
        </Flex>
      </Flex>
      <VStack
        as="nav"
        aria-label="Main navigation"
        position="relative"
        h="calc(100vh - 4rem)"
        p={3}
        overflowY="auto"
        {...props}
      >
        <PageLinks />
      </VStack>
    </SidebarContainerMobile>

    </>
  )
}

export default {
  SidebarDesktop,
  SidebarMobile
}