import { Request, Response } from "express";
import pool from "../config/db";


// Add Stock Movement
export const addStockMovement = async (
  req: Request,
  res: Response
) => {

  const connection = await pool.getConnection();

  try {

    const {
      product_id,
      quantity_changed,
      movement_type,
      reason
    } = req.body;


    await connection.beginTransaction();


    // Check product stock
    const [products]: any = await connection.query(
      "SELECT current_stock FROM products WHERE id = ?",
      [product_id]
    );


    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }


    let currentStock = products[0].current_stock;


    if (movement_type === "IN") {
      currentStock += quantity_changed;
    }


    if (movement_type === "OUT") {

      if (currentStock < quantity_changed) {
        return res.status(400).json({
          message: "Insufficient stock"
        });
      }

      currentStock -= quantity_changed;
    }


    // Update product stock
    await connection.query(
      "UPDATE products SET current_stock = ? WHERE id = ?",
      [
        currentStock,
        product_id
      ]
    );


    // Insert stock log
    await connection.query(
      `INSERT INTO stock_movements
      (product_id, quantity_changed, movement_type, reason)
      VALUES (?, ?, ?, ?)`,
      [
        product_id,
        quantity_changed,
        movement_type,
        reason
      ]
    );


    await connection.commit();


    res.json({
      message: "Stock movement added successfully"
    });


  } catch(error) {

    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  } finally {

    connection.release();

  }

};



// Get Stock Movement History
export const getStockMovements = async (
  req: Request,
  res: Response
) => {

  try {

    const [rows] = await pool.query(
      "SELECT * FROM stock_movements"
    );

    res.json(rows);

  } catch(error) {

    console.error(error);

    res.status(500).json({
      message:"Server Error"
    });

  }

};