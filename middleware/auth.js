import jwt from 'jsonwebtoken'
import config from 'config'

export default function(request, response, next) {
    // Get token from header
    const token = request.header('x-auth-token')

    // Check if not token
    if (!token) {
        return response.status(401).json({ msg: 'No token, authorization denied' })
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        request.user = decoded.user
        next()
    } catch (err) {
        response.status(401).json({ msg: 'Token is not valid' })
    }
}
