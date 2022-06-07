export default async (req, res, next) => {
    try {
        let authToken = req.headers.authorization ?? false
        if (!authToken) {
            return APIResponses.unAuthorized(res, "Authorisation Required")
        }

        let bearerToken = authToken.split(' ')[1] || authToken

        let { user, token } = await personalaccesstokenModel.findToken(bearerToken, req)

        if (!user) {
            return APIResponses.unAuthorized(res, "Authorisation Failed")            
        }

        req.bearer = bearerToken
        req.currentToken = token
        req.userData = user
        next()
    } catch (error) {
        console.log(error.message)
        return APIResponses.unAuthorized(res, `Unauthorised : ${error.message}`)
    }
}