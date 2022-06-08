import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AuthService from '@services/auth'
import Swal from 'sweetalert2'
import { ROUTE } from '@config/constants'
import { SessionProvider, signIn, signOut } from 'next-auth/react'

export { RouteGuard }

function RouteGuard({ children }) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath)

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false)
        router.events.on('routeChangeStart', hideContent)

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent)
            router.events.off('routeChangeComplete', authCheck)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const authCheck = async (url) => {
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/login', '/']
        const pageShouldBeRedirectedIfAuthenticated = ['/login', '/register', '/forgot-password', '/confirm-password']
        const path = url.split('?')[0]
        let checkToken = AuthService.userValue

        let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/auth-validate`
        let checkTokenAuth = await AuthService.validateToken(apiUrl, checkToken.token)
        setAuthorized(true)
        return

        if (typeof checkTokenAuth.token != 'undefined') {
            //Auth
            setAuthorized(true)
            if (pageShouldBeRedirectedIfAuthenticated.includes(path)) {
                //In login or register page
                router.push({
                    pathname: ROUTE.DASHBOARD,
                })
            }    
        } else {
            //Guest
            if (!publicPaths.includes(path)) {
                //Auth Page
                setAuthorized(false)

                Swal.fire({
                  title: 'Error!',
                  text: "Unauthorised!",
                  icon: 'error',
                  confirmButtonText: 'Close'
                })      
                
                return router.push({
                    pathname: '/login',
                    query: { returnUrl: router.asPath }
                })                    
            } else {
                setAuthorized(true)
            }
        }
    }

    return (authorized && children)
}