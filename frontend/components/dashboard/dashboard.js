import Header from './header';
import Sidebar from './sidebar';
import { Flex, useColorModeValue, Box, Heading } from '@chakra-ui/react';

const SidebarDesktop = Sidebar.SidebarDesktop

export default function Dashboard({ children, title }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const bgColorGray = useColorModeValue('gray.100');

  return (
    <>
      <Header />
      <SidebarDesktop w={64} />

      <Flex as="main" ml={{ sm:0, md:64, lg:64}} bg={bgColor}>
        <Flex direction="column" w="full">
          <Box
            w="full"
            as="section"
            px={[4, 4, 4]}
            py={4}
            mt={16}
            h="calc(100vh - 4rem)"
            bg={bgColorGray}
          >
            <Box px={0} py={4} w="full">
              <Heading as="h3" size="lg">{title ?? ''}</Heading>
            </Box>

            <Box boxShadow='xs' p='6' rounded='md' bg={bgColor}>

              {children}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
