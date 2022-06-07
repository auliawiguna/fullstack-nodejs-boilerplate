import _ from 'lodash'

export default async(req, res, next) => {
    try {
        if (!req.userData || typeof req.userData=='undefined') {
            return APIResponses.unAuthorized(res, "Authorisation Required")        
        } else {
            if (_.isNil(req.userData.validated_at)) {
                return APIResponses.unAuthorized(res, "You have to verify your account before proceeding")
            } else {
                next()
            }
        }            
    } catch (error) {
        console.log(error.message)
        return APIResponses.unAuthorized(res, `Unauthorised : ${error.message}`)        
    }
}