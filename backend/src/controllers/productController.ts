import { Request, Response } from "express";
import pool from "../config/db";

// Add Product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      sku,
      category,
      unit_price,
      current_stock,
      min_stock_alert,
      warehouse_location,
    } = req.body;

    await pool.query(
      `INSERT INTO products
      (product_name, sku, category, unit_price,
      current_stock, min_stock_alert, warehouse_location)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        product_name,
        sku,
        category,
        unit_price,
        current_stock,
        min_stock_alert,
        warehouse_location,
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const [rows]: any = await pool.query(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
  
      res.json(rows[0]);
  
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        message: "Server Error"
      });
    }
  };
  export const updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const {
        product_name,
        sku,
        category,
        unit_price,
        current_stock,
        min_stock_alert,
        warehouse_location
      } = req.body;
  
  
      await pool.query(
        `UPDATE products SET
        product_name = ?,
        sku = ?,
        category = ?,
        unit_price = ?,
        current_stock = ?,
        min_stock_alert = ?,
        warehouse_location = ?
        WHERE id = ?`,
        [
          product_name,
          sku,
          category,
          unit_price,
          current_stock,
          min_stock_alert,
          warehouse_location,
          id
        ]
      );
  
  
      res.json({
        message: "Product updated successfully"
      });
  
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "Server Error"
      });
    }
  };