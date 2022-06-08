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
                    return {
                        access_token:authData.token,
                        name :authData.user.name,
                        email:authData.user.email,
                        id   :authData.user.id
                    }                        
                } catch (error) {
                    console.log(error.message);
                    
                }
            }
        })
    ],
    secret:process.env.JWT_SECRET,
    pages: {
        signIn: '/auth'
    },
    callbacks: {
        async jwt({ token, user, account, isNewUser }) {// This user return by provider {} as you mentioned above MY CONTENT {token:}
            if (user) {
                console.log(user);
                if (user.access_token) {
                    token = { 
                        accessToken: user.access_token, 
                        name       :user.name, 
                        email      :user.email ,
                        user_id    :user.id,
                    }
                }
            }

            return token;
        },
    
        // That token store in session
        async session({ session, token }) { // this token return above jwt()
            session.accessToken = token.accessToken;
            session.user_id = token.user_id;
            //if you want to add user details info
            // session.user = { name: "name", email: "email" };//this user info get via API call or decode token. Anything you want you can add

            return session;
        },
    },
    theme: {
        colorScheme: 'auto',
        brandColor: '',
        logo: ''
    },
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60

    },
    debug: process.env.NODE_ENV != 'production'
})