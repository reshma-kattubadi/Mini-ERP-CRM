import { Request, Response } from "express";
import pool from "../config/db";


// Create Challan
export const createChallan = async (
  req: Request,
  res: Response
) => {

  const connection = await pool.getConnection();

  try {

    const {
      customer_id,
      products,
      status
    } = req.body;


    await connection.beginTransaction();


    // Generate challan number
    const challanNumber =
      "CH-" + Date.now();


    let totalQuantity = 0;


    for (const item of products) {

      totalQuantity += item.quantity;


      // Check stock if confirmed
      if (status === "Confirmed") {

        const [rows]: any =
          await connection.query(
            "SELECT current_stock FROM products WHERE id=?",
            [item.product_id]
          );


        if (rows.length === 0) {
          throw new Error("Product not found");
        }


        if (rows[0].current_stock < item.quantity) {
          throw new Error(
            "Insufficient stock"
          );
        }


        await connection.query(
          `UPDATE products 
           SET current_stock = current_stock - ?
           WHERE id=?`,
          [
            item.quantity,
            item.product_id
          ]
        );
      }
    }


    // Insert challan
    const [result]: any =
      await connection.query(
        `INSERT INTO challans
        (challan_number, customer_id, total_quantity, status)
        VALUES (?, ?, ?, ?)`,
        [
          challanNumber,
          customer_id,
          totalQuantity,
          status
        ]
      );


    const challanId = result.insertId;


    // Insert products snapshot
    for (const item of products) {

      await connection.query(
        `INSERT INTO challan_items
        (challan_id, product_id, product_name, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?)`,
        [
          challanId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price
        ]
      );

    }


    await connection.commit();


    res.status(201).json({
      message:"Challan created successfully",
      challan_number: challanNumber
    });


  } catch(error:any) {


    await connection.rollback();

    console.error(error);


    res.status(400).json({
      message:error.message
    });


  } finally {

    connection.release();

  }

};
export const getChallans = async (
    req: Request,
    res: Response
  ) => {
  
    try {
  
      const [rows] = await pool.query(
        `
        SELECT 
        challans.id,
        challans.challan_number,
        customers.customer_name,
        challans.total_quantity,
        challans.status,
        challans.created_at
  
        FROM challans
  
        JOIN customers 
        ON challans.customer_id = customers.id
  
        ORDER BY challans.created_at DESC
        `
      );
  
  
      res.json(rows);
  
  
    } catch(error) {
  
      console.error(error);
  
      res.status(500).json({
        message:"Server Error"
      });
  
    }
  
  };