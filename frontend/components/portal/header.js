import NextLink from 'next/link'
import { useColorModeValue, Button, Flex, Stack, Link, Box } from '@chakra-ui/react'
import ThemeToggle from './theme-toggle'

const Header = ({ sessions }) => {
  const bgColor = useColorModeValue('white', 'gray.900')

  const LoginButton = () => {
      if (sessions) {
        return (
          <>
            <Button variant="ghost" px={5} fontWeight="bold">
              <NextLink
                href={ `/admin/dashboard` }
              >
                Back to Dashboard
              </NextLink>
            </Button>
          </>
        )        
      } else {
        return (
          <>
            <Button variant="ghost" px={5} fontWeight="bold">
              <NextLink
                href={ `/register` }
                >
                  Sign Up
              </NextLink>
            </Button>
            <Button variant="ghost" px={5} fontWeight="bold">
              <NextLink
                href={ `/auth` }
                >
                  Sign In
              </NextLink>
            </Button>
          </>        
        )
      }
  }


  return (
    <Flex
      pos="fixed"
      as="header"
      align="center"
      justify="center"
      top={0}
      insetX={0}
      h={16}
      px={[4, 6, null, 8]}
      bg={bgColor}
      borderBottomWidth="1px"
    >
      <Flex w="full" align="center" justify="center">
        <Flex w="full" align="center" justify="space-between">
            <Flex align="center">
              <NextLink href="/" passHref>
                  { process.env.NEXT_PUBLIC_APP_NAME }
              </NextLink>
            </Flex>
            <Flex>
              <LoginButton />
              <ThemeToggle />
            </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Header