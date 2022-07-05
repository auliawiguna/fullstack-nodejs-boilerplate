import axios from 'axios'
import { BehaviorSubject } from 'rxjs'

let userSubject
try {
    userSubject = new BehaviorSubject(process.browser && JSON.parse(atob(localStorage.getItem('user'))))
} catch (error) {
    userSubject = new BehaviorSubject(false)        
}

/**
 * Login action
 *
 * @param   {string}  url       Backend URL
 * @param   {string}  username  Email
 * @param   {string}  password  Password
 *
 * @return  {string}            mixed
 */
const login = async (url, username, password) => {
    return await axios.post(url, {
        email: username,
        password: password,
        device_name: "web"
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            localStorage.setItem('user', window.btoa(JSON.stringify(authData)))
            userSubject.next(authData)

            return authData
        } else {
            return false
        }
    })
}

/**
 * Sign up action
 *
 * @param   {string}  url       Backend URL
 * @param   {string}  email       Email
 * @param   {string}  first_name  First name
 * @param   {string}  last_name   Last name
 * @param   {string}  password  Password
 *
 * @return  {string}              [return description]
 */
const signup = async (url, email, first_name, last_name, password) => {
    return await axios.post(url, {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password,
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            return authData
        } else {
            return false
        }

    })
}

/**
 * Validate registration token
 *
 * @param   {string}  url       Backend URL
 * @param   {string}  token
 *
 * @return  {mixed}
 */
const validateAccount = async (url, token) => {
    return await axios.post(url, {
        token: parseInt(token),
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            return authData
        } else {
            return false
        }

    })
}

/**
 * Send reset password request
 *
 * @param   {string}  url       Backend URL
 * @param   {string}  email
 *
 * @return  {mixed}
 */
const resetPassword =  async (url, email) => {
    return await axios.post(url, {
        email: email,
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            return authData
        } else {
            return false
        }
    })
}

/**
 * Handle finalise reset password
 *
 * @param   {string}  url       Backend URL
 * @param   {string}  token     6 digits token
 * @param   {string}  email     Email address
 * @param   {string}  password  New password
 *
 * @return  {mixed}
 */
const postResetPassword =  async (url, token, email, password) => {
    return await axios.post(url, {
        email: email,
        password: password,
        token: parseInt(token),
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            return authData
        } else {
            return false
        }
    })
}

const loginNextAuth = async (url, username, password) => {
    return await axios.post(url, {
        email: username,
        password: password,
        device_name: "web"
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            return authData
        } else {
            return false
        }
    })
}


const logout = async () => {
}

const validateToken = async (url, token) => {
    return await axios.post(url, {
        token: token,
    }).then((response) => {
        if (response.data.data.token) {
            let authData = response.data.data
            localStorage.setItem('user', window.btoa(JSON.stringify(authData)))
            userSubject.next(authData)

            return authData
        } else {
            return false
        }
    }).catch((error) => {
        return false
    })
}

const AuthService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },    
    login,
    loginNextAuth,
    logout,
    signup,
    validateAccount,
    validateToken,
    resetPassword,
    postResetPassword
}

export default AuthService