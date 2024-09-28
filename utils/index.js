const isAuth = ((req) => {
    const token = req.headers.authorization
    if (!token) return false
    try {
        return true
    } catch (err) {
        return false
    }
})

module.exports = isAuth