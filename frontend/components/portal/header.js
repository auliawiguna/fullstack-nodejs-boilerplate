import NextLink from 'next/link'
import { useColorModeValue, Button, Flex, Stack, Link, Box } from '@chakra-ui/react'
import ThemeToggle from './theme-toggle'

const Header = ({ sessions }) => {
  const bgColor = useColorModeValue('white', 'gray.900')

    const LoginButton = () => {
        if (sessions) {
            return (
                <>
                    <NextLink
                        href={ `/admin/dashboard` }
                        >
                        <Button as="a" variant="ghost" px={5} fontWeight="bold">
                            Back to Dashboard
                        </Button>
                    </NextLink>
                </>
            )        
        } else {
            return (
                <>
                    <NextLink
                        href={ `/register` }
                        >
                        <Button as="a" variant="ghost" px={5} fontWeight="bold">
                            Sign Up
                        </Button>
                    </NextLink>
                    <NextLink
                        href={ `/auth` }
                        >
                        <Button as="a" variant="ghost" px={5} fontWeight="bold">
                            Sign In
                        </Button>
                    </NextLink>
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
                        <Button as="a" variant="ghost" px={0} fontWeight="bold">
                            { process.env.NEXT_PUBLIC_APP_NAME }
                        </Button>
                    </NextLink>
                </Flex>
                <Flex>
                    <LoginButton se />
                    <ThemeToggle />
                </Flex>
            </Flex>
        </Flex>
    </Flex>
  );
}

export default Header