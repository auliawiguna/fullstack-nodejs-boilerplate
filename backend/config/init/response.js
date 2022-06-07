const responses = {
    success : (res, data, message) => {
      return res.status(200).json({
        data,
        message,
        error: false,
      })
    },
  
    noContent : (res) => {
      return res.status(204)
    },
  
    badRequest : (res, message) => {
      return res.status(400).json({ error: true, message })
    },
  
    unAuthorized : (res, message) => {
      return res.status(401).json({ error: true, message })
    },
  
    forbidden : (res, message) => { return res.status(403).json({ error: true, message }) },
  
    serverError : (res, message) => { return res.status(500).json({ error: true, message }) },
  
    notFound : (res, message) => { return res.status(404).json({ error: true, message }) },
  
    unprocessableEntity : (res, message) => { return res.status(422).json({ error: true, message }) }
  
}
  
export default responses