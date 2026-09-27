import jwt from 'jsonwebtoken';
// export default function authCheck(req, res, next){
//   // 1. Extract the token from the cookies object
//     const token = req.cookies.token;

//     // 2. If no token exists, redirect unauthenticated users to login
//     if (!token) {
//         return res.redirect('/login');
//     }

//     try {
//         // 3. Verify the token's signature and expiration
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 4. Optionally attach user payload to request for use in controllers
//         req.user = decoded;

//         // 5. Token is valid, proceed to the next route handler/controller
//         return next();
//     } catch (error) {
//         // 6. Token is invalid or expired; clear the bad cookie and redirect
//         res.clearCookie('token');
//         return res.redirect('/login');
//     }
// }
export default function authCheck(req, res, next) {
    const authHeader = req.headers.authorization;

    // 1. Check if the authorization header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 2. Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user payload to request so req.user.userId is available
        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}