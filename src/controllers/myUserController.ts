import { Request, Response } from "express";
import User from '../models/users'


async function getCurrentUser(req:Request, res:Response) {
    try {
        
        const currentUser = await User.findOne({ _id: req.body.userId })
        if(!currentUser){
            return res.status(404).json({message:'User not found'})
        }
        return res.status(200).json(currentUser)
    } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error retriving User Info'})
    }
}

async function createCurrentUser(req: Request, res: Response) {
    try {
        const { auth0Id } = req.body;
        const currentUser = await User.findOne({ auth0Id });

        if (currentUser) {
            console.log("User already exist");
            return res.status(200).json({ message: 'User already exist' })
        }

        await User.create(req.body)
        console.log('Added new user');

        return res.status(201).json({ message: 'Added new user' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Creating userr" })
    }

}

async function updateCurrentUser(req: Request, res: Response) {
    try {
        const currentUser = await User.findById(req.body.userId)
        
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const addressLine1 = req.body.addressLine1;
        const country = req.body.country;
        const city = req.body.city;
        const name = req.body.name;
        currentUser.name= name;
        currentUser.country =country;
        currentUser.city =city;
        currentUser.addressLine1=addressLine1;
        await currentUser.save();
        console.log('Successfully Updated user info');
        
        
        res.status(201).json({ message: 'Successfully Updated user info' })

    } catch (error) {
        res.status(500).json({ message: "Error updating the user" })
    }
}


export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser
}