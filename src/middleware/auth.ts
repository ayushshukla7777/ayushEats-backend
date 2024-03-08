import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import user from '../models/users';

export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});


export async  function jwtParse(req : Request, res : Response, next : NextFunction){
    const authorization = req.headers.authorization;
    if(! authorization?.startsWith('Bearer ')){
        throw new Error('Invalid Authorization Token')
    }
    const token = authorization?.split(' ')[1];
    const decodedToken = jwt.decode(token as string) as jwt.JwtPayload;
    const auth0Id =decodedToken.sub;
    const currentUser = await user.findOne({auth0Id:auth0Id })
    req.body.userId = currentUser?._id;
    req.body.auth0Id = currentUser?.auth0Id;
    next()
}