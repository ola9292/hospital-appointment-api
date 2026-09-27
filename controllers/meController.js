// import { getDBConnection } from '../db/db.js'

// export async function getCurrentUser(req, res) {
//   try {
//     const db = await getDBConnection();
//     let query = 'SELECT name FROM users WHERE id = ?'

//     let userId = req.session.userId
//     if(!userId){
//         return res.json({isLoggedIn: false})
//     }
//     const user = await db.get(query, [userId])  
//     return res.status(200).json({isLoggedIn:true, name: user.name})
//   } catch (err) {
//     console.error('getCurrentUser error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// } 

export async function getCurrentUser(req, res) {
    try {
        return res.status(200).json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}