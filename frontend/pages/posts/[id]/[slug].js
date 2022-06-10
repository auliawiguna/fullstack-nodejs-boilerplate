import { useRouter } from 'next/router'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Notfound from '@components/404'
import Head from 'next/head'
import { Box } from "@chakra-ui/react"
import { useState, useEffect } from 'react'

const klik = () => {
    console.log('====================================');
    console.log('click');
    console.log('====================================');
}

const Post = (props) => {
    useEffect(() => {
        console.log(props)
    }, [props])

    const notFoundPage = dynamic(() => import('./notFoundPage'))
    const router = useRouter()

    if (props.post == false) {
        return  (
            <>
                <Box border='1px' borderColor='gray.200'>
                Card
                </Box>            
                <Head>
                    <title>Not Found</title>
                </Head>
                <Notfound />
            </>
        )      
    } else {
        return (
            <>
                <Head>
                    <title>{ props.post.title }</title>
                    <meta name="description" content={ props.post.title } />
                </Head>
                <h1>{ props.post.title }</h1>
                { props.post.content }
                <button onClick={klik}>asas</button>
            </>
        )            
    }

}

Post.getInitialProps = async ({ query }) => {

    try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${query.id}`)
        const data = result.data
    
        return {
            post : data.data ?? false
        }            
    } catch (error) {
        return {
            post : false
        }            
    }
}

export default Post