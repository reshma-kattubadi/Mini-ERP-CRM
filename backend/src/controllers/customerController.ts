import { Request, Response } from "express";
import pool from "../config/db";

// Add Customer
export const addCustomer = async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
    } = req.body;

    const sql = `
      INSERT INTO customers
      (customer_name, mobile, email, business_name, gst_number,
       customer_type, address, status, follow_up_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
    ]);

    res.status(201).json({
      message: "Customer added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Customers
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getCustomerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const [rows]: any = await pool.query(
        "SELECT * FROM customers WHERE id = ?",
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  };
  export const updateCustomer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const {
        customer_name,
        mobile,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status,
        follow_up_date,
        notes,
      } = req.body;
  
      await pool.query(
        `UPDATE customers
         SET customer_name=?, mobile=?, email=?, business_name=?,
         gst_number=?, customer_type=?, address=?, status=?,
         follow_up_date=?, notes=?
         WHERE id=?`,
        [
          customer_name,
          mobile,
          email,
          business_name,
          gst_number,
          customer_type,
          address,
          status,
          follow_up_date,
          notes,
          id,
        ]
      );
  
      res.json({
        message: "Customer updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  };