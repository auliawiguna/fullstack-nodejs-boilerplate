import * as Yup from 'yup'

export const create = Yup.object().shape({
    name: Yup.string().required('Name is required'),
})

export const edit = Yup.object().shape({
    name: Yup.string().required('Name is required'),
})
