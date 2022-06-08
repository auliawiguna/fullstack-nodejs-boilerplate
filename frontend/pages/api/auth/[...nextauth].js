import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import AuthService from '@services/auth'

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: process.env.APP_NAME,
            credentials: {
                username: {
                    label: 'Email',
                    type: 'email',
                    placeholder : 'Your registered email address'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials, req) {
                let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/sign-in`
                try {
                    let authData = await AuthService.loginNextAuth(url, credentials.username, credentials.password)
                    if (process.env.NODE_ENV!='production') {
                        console.log('===========URL AND AUTH=============')
                        console.log(url)
                        console.log(authData)
                        console.log('====================================')
                    }
                    return authData                        
                } catch (error) {
                    console.log(error.message);
                    
                }
            }
        })
    ],
    secret:process.env.JWT_SECRET,
    pages: {
        signIn: '/pages/auth'
    },
    callbacks: {
        async jwt(data) {
            if (process.env.NODE_ENV!='production') {
                console.log('============DATA JWT================')
                console.log(data)
                console.log('====================================')
            }
            return {
                id: data.user.user.id,
                email: data.user.user.email,
                accessToken: data.usertoken,
            }
        },

        async session(dataSession) {
            if (process.env.NODE_ENV!='production') {
                console.log('==========DATA SESSION==============')
                console.log(dataSession)
                console.log('====================================')
            }
            session.token = dataSession.token
        }
    },
    theme: {
        colorScheme: 'auto',
        brandColor: '',
        logo: ''
    },
    debug: process.env.NODE_ENV != 'production'
})