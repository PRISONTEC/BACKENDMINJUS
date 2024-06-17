import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { key_secret, DecodedToken } from '../../interfaces/interface';
import { decode } from 'punycode';

/* interface AuthenticatedRequest extends Request {
    userId: string;
  } */

class validarToken {
    private secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }


    static verifyToken = (req: Request, res: Response, next: NextFunction): void => {
        const token = req.header('Authorization');
        if (!token) {
            res.status(401).json({ error: 'Access denied' });
            return;
        }

        try {
            const decoded = jwt.verify(token, key_secret/* , (async (err)=>{console.log("error",err?.message)}) */);   
            next();
        } catch (error) {
            /* res.status(401).json({ error: 'Invalid token' }); */
            res.send("token expiro")
        }
    };
}

export default validarToken;
