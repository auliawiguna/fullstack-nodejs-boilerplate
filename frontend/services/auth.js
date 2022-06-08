import axios from 'axios'
import { BehaviorSubject } from 'rxjs'

let userSubject
try {
    userSubject = new BehaviorSubject(process.browser && JSON.parse(atob(localStorage.getItem('user'))))
} catch (error) {
    userSubject = new BehaviorSubject(false)        
}

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


const logout = async (url) => {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    return await axios.post(url).then((response) => {
        if (response.data.data) {
            localStorage.removeItem('user')
            Router.push('/login')
            userSubject.next(null)

            return true
    } else {
            return false
        }
    })
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
    validateToken
}

export default AuthService