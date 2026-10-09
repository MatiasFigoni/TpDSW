import { Request, Response, NextFunction } from 'express';

export function validateAndSanitizeLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;


  if (!email || !password) {
        return res.status(400).json({ 
        message: 'Empty credentials, please make sure you fill both camps (Email and Passwords) before sending again!.' 
            });
                                }

  
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ 
      message: 'Invalid Format, please send Password and Email as TEXT format only.' 
    });
                                                                    }

  
  req.body.sanitizedLogin = {
    email: email.trim().toLowerCase(),
    password: password.trim() 
                                };

  next();
}