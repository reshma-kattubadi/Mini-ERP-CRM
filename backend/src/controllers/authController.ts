import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;


        const [rows]: any = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if (rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const user = rows[0];


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d"
            }
        );


        res.json({
            message: "Login successful",
            token,
            role: user.role
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};