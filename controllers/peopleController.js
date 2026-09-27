import User from '../db/models/User.js'
export async function getPatients(req, res){
    try{
        const patients = await User.find({role: 'patient'})
        if(!patients){
            return res.status(404).json({msg: "no patients found"})
        }
        return res.json({data: patients})
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export async function getDoctors(req, res){
    try{
        const doctors = await User.find({role: 'doctor'})
        if(!doctors){
            return res.status(404).json({message: "no doctors found"})
        }
        return res.json({data: doctors})
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

