export default (permission) => async(req, res, next) => {
    try {
        if (!req.userData || typeof req.userData=='undefined') {
            return APIResponses.unAuthorized(res, "Authorisation Required")        
        } else {
            if (typeof req.userData.permissions_name == 'undefined' || req.userData.permissions_name == null) {
                return APIResponses.unAuthorized(res, "No Permission Found")
            } else {
                if (Array.isArray(permission)) {
                    if ( permission.every(element => { return req.userData.permissions_name.includes(element) })) {
                        return next()
                    } else {
                        return APIResponses.unAuthorized(res, "You Have No Permission to Access This Endpoint")
                    }                    
                } else {
                    if (req.userData.permissions_name.includes(permission)) {
                        return next()
                    } else {
                        return APIResponses.unAuthorized(res, "You Have No Permission to Access This Endpoint")
                    }                    
                }
            }
        }            
    } catch (error) {
        console.log(error.message)
        return APIResponses.unAuthorized(res, `Unauthorised : ${error.message}`)        
    }
}