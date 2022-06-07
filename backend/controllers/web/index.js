export default class IndexController {
    index = async (req, res) => {
        return APIResponses.success(res, {code : 200}, 'Hello')
    }
}