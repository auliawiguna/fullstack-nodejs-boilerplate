import * as Yup from 'yup'

export const signup = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    password: Yup.string().min(8).required('Password is required'),
    password_confirmation: Yup.string().min(8).oneOf([Yup.ref('password'), null], 'Passwords must match')
})

export const signin = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
})
