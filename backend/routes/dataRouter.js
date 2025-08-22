import express from "express";
import Property from "../models/Property.js";
import Showdata from "../models/PropertyData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { 
      page = 1, 
      limit = 10, 
      sort = "createdAt", 
      order = "desc",
      minPrice, 
      maxPrice, 
      developer, 
      status, 
      sale_status,
      propertyType,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    let filter = {};

    if (minPrice && maxPrice) {
      filter.min_price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.min_price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.min_price = { $lte: Number(maxPrice) };
    }

    if (developer) {
      filter.developer = developer;
    }

    if (status) {
      filter.status = status;
    }

    if (sale_status) {
      filter.sale_status = sale_status;
    }
    if(propertyType) {
      filter.propertyType = propertyType
    }

    const total = await Property.countDocuments(filter);

    const sortOption = {};
    sortOption[sort] = order === "asc" ? 1 : -1;

    const properties = await Property.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      properties
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Showdata.findOne({ "data.pageProps.property.id": id });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router