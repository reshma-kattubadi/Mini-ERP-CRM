import { Request, Response } from "express";
import pool from "../config/db";


export const getDashboard = async (
  req: Request,
  res: Response
) => {

  try {

    const [customers]: any = await pool.query(
      "SELECT COUNT(*) AS totalCustomers FROM customers"
    );


    const [products]: any = await pool.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );


    const [stock]: any = await pool.query(
      "SELECT SUM(current_stock) AS totalStock FROM products"
    );


    const [challans]: any = await pool.query(
      "SELECT COUNT(*) AS totalChallans FROM challans"
    );


    const [confirmed]: any = await pool.query(
      `
      SELECT COUNT(*) AS confirmedSales
      FROM challans
      WHERE status='Confirmed'
      `
    );


    res.json({

      totalCustomers:
        customers[0].totalCustomers,

      totalProducts:
        products[0].totalProducts,

      totalStock:
        stock[0].totalStock || 0,

      totalChallans:
        challans[0].totalChallans,

      confirmedSales:
        confirmed[0].confirmedSales

    });


  } catch(error){

    console.error(error);

    res.status(500).json({
      message:"Server Error"
    });

  }

};