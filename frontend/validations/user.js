import * as Yup from 'yup'

export const create = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required'),
    role_id: Yup.array()
    .min(1, 'Pick at least two items')
})

export const edit = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email().required('Email is required'),
    role_id: Yup.array()
    .min(1, 'Pick at least two items')
})
