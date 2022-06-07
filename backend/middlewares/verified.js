export default async(req, res, next) => {
    try {
        if (!req.userData || typeof req.userData=='undefined') {
            return APIResponses.unAuthorized(res, "Authorisation Required")        
        } else {
            if (typeof req.userData.validated_at == 'undefined' || req.userData.validated_at == null || req.userData.validated_at == '') {
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