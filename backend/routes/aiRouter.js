import express from "express";
import OpenAI from "openai";
import Property from "../models/Property.js";

const router = express.Router();

// ✅ OpenAI client
const openai = new OpenAI({
  apiKey: "AIzaSyCZMJ2-bOuXX8d-LddWajul_7Wv-SQoikU",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// ✅ Enhanced filter extraction with more property types
async function extractFilters(userQuery) {
  const prompt = `
  User ne property search ke liye ye query di hai: "${userQuery}"
  
  Tum Shora ho, rorereality.ae ki AI assistant jo users ko property dhundne mein help karti ho.

  Is query se comprehensive property search filters extract karo aur JSON format mein return karo:

  {
    "area": "area name agar mention kiya ho (e.g., Damac Hills, Downtown Dubai)",
    "developer": "developer name agar mention kiya ho (e.g., DAMAC, Emaar, Sobha)",
    "property_type": "Villa/Apartment/Penthouse/Studio/Townhouse agar mention kiya ho",
    "bedrooms": number_of_bedrooms_agar_mention_kiya_ho,
    "bathrooms": number_of_bathrooms_agar_mention_kiya_ho,
    "min_price": number_agar_mention_kiya_ho,
    "max_price": number_agar_mention_kiya_ho,
    "min_area_sqft": square_feet_minimum_agar_mention_kiya_ho,
    "max_area_sqft": square_feet_maximum_agar_mention_kiya_ho,
    "status": "Under Construction/Ready/Off Plan agar mention kiya ho",
    "sale_status": "Available/Sold/Reserved agar mention kiya ho",
    "amenities": ["Swimming Pool", "Gym", "Parking"] // agar specific amenities mention kiye ho,
    "floor_range": {"min": number, "max": number} // agar floor preference mention kiya ho,
    "furnished": "Furnished/Unfurnished/Semi-furnished agar mention kiya ho",
    "payment_plan": "Cash/Installment/Mortgage agar mention kiya ho"
  }

  Examples:
  "Damac Hills mein 3 bedroom villa" → {"area": "Damac Hills", "property_type": "Villa", "bedrooms": 3}
  "DAMAC ke apartments swimming pool ke saath" → {"developer": "DAMAC", "property_type": "Apartment", "amenities": ["Swimming Pool"]}
  "50 lakh se 1 crore tak" → {"min_price": 5000000, "max_price": 10000000}
  "ready to move properties" → {"status": "Ready"}
  "furnished studio apartment" → {"property_type": "Studio", "furnished": "Furnished"}
  "2000 sqft se zyada" → {"min_area_sqft": 2000}
  "high floor apartment" → {"property_type": "Apartment", "floor_range": {"min": 10}}

  Sirf JSON return karo, koi extra text nahi:
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userQuery },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const filters = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    // Clean and validate filters
    return cleanFilters(filters);
  } catch (err) {
    console.error("Filter extraction error:", err);
    return {};
  }
}

// ✅ Clean and validate extracted filters
function cleanFilters(filters) {
  const cleanedFilters = {};
  
  // String filters - case insensitive
  if (filters.area && filters.area.trim()) cleanedFilters.area = filters.area.trim();
  if (filters.developer && filters.developer.trim()) cleanedFilters.developer = filters.developer.trim();
  if (filters.property_type && filters.property_type.trim()) cleanedFilters.property_type = filters.property_type.trim();
  if (filters.status && filters.status.trim()) cleanedFilters.status = filters.status.trim();
  if (filters.sale_status && filters.sale_status.trim()) cleanedFilters.sale_status = filters.sale_status.trim();
  if (filters.furnished && filters.furnished.trim()) cleanedFilters.furnished = filters.furnished.trim();
  if (filters.payment_plan && filters.payment_plan.trim()) cleanedFilters.payment_plan = filters.payment_plan.trim();
  
  // Number filters
  if (filters.bedrooms && Number.isInteger(filters.bedrooms) && filters.bedrooms > 0) cleanedFilters.bedrooms = filters.bedrooms;
  if (filters.bathrooms && Number.isInteger(filters.bathrooms) && filters.bathrooms > 0) cleanedFilters.bathrooms = filters.bathrooms;
  if (filters.min_price && filters.min_price > 0) cleanedFilters.min_price = filters.min_price;
  if (filters.max_price && filters.max_price > 0) cleanedFilters.max_price = filters.max_price;
  if (filters.min_area_sqft && filters.min_area_sqft > 0) cleanedFilters.min_area_sqft = filters.min_area_sqft;
  if (filters.max_area_sqft && filters.max_area_sqft > 0) cleanedFilters.max_area_sqft = filters.max_area_sqft;
  
  // Array filters
  if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    cleanedFilters.amenities = filters.amenities.filter(a => a && a.trim());
  }
  
  // Object filters
  if (filters.floor_range && typeof filters.floor_range === 'object') {
    const floorRange = {};
    if (filters.floor_range.min && filters.floor_range.min > 0) floorRange.min = filters.floor_range.min;
    if (filters.floor_range.max && filters.floor_range.max > 0) floorRange.max = filters.floor_range.max;
    if (Object.keys(floorRange).length > 0) cleanedFilters.floor_range = floorRange;
  }
  
  return cleanedFilters;
}

// ✅ Build comprehensive MongoDB query from filters
function buildQuery(filters) {
  const query = {};
  
  // Text-based filters with regex for partial matching
  if (filters.area) {
    query.area = { $regex: new RegExp(filters.area, "i") };
  }
  
  if (filters.developer) {
    query.developer = { $regex: new RegExp(filters.developer, "i") };
  }
  
  if (filters.property_type) {
    query.property_type = { $regex: new RegExp(filters.property_type, "i") };
  }
  
  // Exact match filters
  if (filters.bedrooms) {
    query.bedrooms = filters.bedrooms;
  }
  
  if (filters.bathrooms) {
    query.bathrooms = filters.bathrooms;
  }
  
  if (filters.status) {
    query.status = { $regex: new RegExp(filters.status, "i") };
  }
  
  if (filters.sale_status) {
    query.sale_status = { $regex: new RegExp(filters.sale_status, "i") };
  }
  
  if (filters.furnished) {
    query.furnished = { $regex: new RegExp(filters.furnished, "i") };
  }
  
  if (filters.payment_plan) {
    query.payment_plan = { $regex: new RegExp(filters.payment_plan, "i") };
  }
  
  // Price range filter
  if (filters.min_price || filters.max_price) {
    query.$and = query.$and || [];
    
    if (filters.min_price && filters.max_price) {
      // Property price range should overlap with user's budget
      query.$and.push({
        $or: [
          { min_price: { $lte: filters.max_price }, max_price: { $gte: filters.min_price } },
          { min_price: { $gte: filters.min_price, $lte: filters.max_price } }
        ]
      });
    } else if (filters.min_price) {
      query.$and.push({ max_price: { $gte: filters.min_price } });
    } else if (filters.max_price) {
      query.$and.push({ min_price: { $lte: filters.max_price } });
    }
  }
  
  // Area size filter
  if (filters.min_area_sqft || filters.max_area_sqft) {
    query.area_sqft = {};
    if (filters.min_area_sqft) query.area_sqft.$gte = filters.min_area_sqft;
    if (filters.max_area_sqft) query.area_sqft.$lte = filters.max_area_sqft;
  }
  
  // Floor range filter
  if (filters.floor_range) {
    query.floor = {};
    if (filters.floor_range.min) query.floor.$gte = filters.floor_range.min;
    if (filters.floor_range.max) query.floor.$lte = filters.floor_range.max;
  }
  
  // Amenities filter - property should have all requested amenities
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $all: filters.amenities.map(a => new RegExp(a, "i")) };
  }
  
  return query;
}

// ✅ Generate sorting based on user preference
function getSorting(userQuery, filters) {
  const query = userQuery.toLowerCase();
  
  // Price-based sorting
  if (query.includes('cheapest') || query.includes('budget') || query.includes('affordable')) {
    return { min_price: 1 }; // Ascending price
  }
  if (query.includes('expensive') || query.includes('luxury') || query.includes('premium')) {
    return { min_price: -1 }; // Descending price
  }
  
  // Size-based sorting
  if (query.includes('biggest') || query.includes('largest') || query.includes('spacious')) {
    return { area_sqft: -1 }; // Largest first
  }
  if (query.includes('compact') || query.includes('small')) {
    return { area_sqft: 1 }; // Smallest first
  }
  
  // Status-based priority
  if (query.includes('ready') || query.includes('immediate')) {
    return { status: 1, min_price: 1 };
  }
  
  // Default sorting: Ready properties first, then by price
  return { status: 1, min_price: 1 };
}

// ✅ Generate comprehensive Shora response
async function generateResponse(userQuery, properties, filters, appliedQuery) {
  const filtersApplied = Object.keys(filters).length > 0 ? 
    Object.entries(filters).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}`).join(', ') : 
    'No specific filters';

  let topPropertiesDetails = "";
  if (properties.length > 0) {
    properties.slice(0, 3).forEach((p, i) => {
      topPropertiesDetails += `
${i + 1}. **${p.name}**
   📍 Location: ${p.area}
   🏗️ Developer: ${p.developer}
   🏠 Type: ${p.property_type || 'Not specified'}
   🛏️ Bedrooms: ${p.bedrooms || 'Not specified'}
   🚿 Bathrooms: ${p.bathrooms || 'Not specified'}
   💰 Price: AED ${p.min_price?.toLocaleString()} - AED ${p.max_price?.toLocaleString()}
   📏 Area: ${p.area_sqft ? p.area_sqft.toLocaleString() + ' sqft' : 'Not specified'}
   ✅ Status: ${p.status}
   🏷️ Availability: ${p.sale_status}
   ${p.amenities?.length ? '🏊 Amenities: ' + p.amenities.slice(0, 3).join(', ') + (p.amenities.length > 3 ? '...' : '') : ''}
`;
    });
  }

  const prompt = `
  User query: "${userQuery}"
  Applied filters: ${filtersApplied}
  Found: ${properties.length} matching properties
  
  Tum Shora ho - rorereality.ae ki friendly AI assistant. Tum users ko Dubai real estate mein help karti ho.

  Top matching properties:
  ${topPropertiesDetails}

  Generate a natural, helpful response in English that:
  1. Greet warmly as Shora from RoreReality.ae
  2. Acknowledge their search request
  3. Tell how many properties were found
  4. Highlight key details of top 2-3 properties in a conversational way
  5. If filters were applied, mention them naturally
  6. If no properties found, suggest alternatives or ask for refined criteria
  7. Offer to help with more specific searches
  8. Keep tone friendly, professional, and helpful
  
  Make the response feel natural and conversational, not like a list.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userQuery },
      ],
    });

    return completion.choices[0]?.message?.content || "Hi! I'm Shora from RoreReality.ae. I couldn't process your request right now, but I'm here to help you find the perfect property. Could you please try again?";
  } catch (err) {
    console.error("Response generation error:", err);
    return "Hi! I'm Shora from RoreReality.ae. I'm experiencing some technical difficulties right now, but I'm here to help you find your dream property. Please try your search again!";
  }
}

// ✅ Enhanced chat endpoint with comprehensive filtering
router.get("/", async (req, res) => {
  try {
    const { msg } = req.query;
    if (!msg || msg.trim().length === 0) {
      return res.status(400).json({ 
        error: "Please provide a search message!",
        example: "Try: '3 bedroom villa in Damac Hills under 2 crore'" 
      });
    }

    console.log(`🔍 User Query: ${msg}`);

    // 1️⃣ Extract comprehensive filters
    const filters = await extractFilters(msg.trim());
    console.log(`📋 Extracted Filters:`, filters);

    // 2️⃣ Build MongoDB query
    const mongoQuery = buildQuery(filters);
    console.log(`🗄️ MongoDB Query:`, JSON.stringify(mongoQuery, null, 2));

    // 3️⃣ Get sorting preference
    const sortQuery = getSorting(msg, filters);
    console.log(`📊 Sort Query:`, sortQuery);

    // 4️⃣ Fetch properties with comprehensive selection
    const properties = await Property.find(mongoQuery)
      .sort(sortQuery)
      .limit(50) // Increased limit for better results
      .select(`
        name area developer property_type bedrooms bathrooms 
        min_price max_price area_sqft status sale_status 
        amenities floor furnished payment_plan description
      `)
      .lean();

    console.log(`✅ Found ${properties.length} properties`);

    // 5️⃣ Generate AI response
    const aiResponse = await generateResponse(msg, properties, filters, mongoQuery);

    // 6️⃣ Send comprehensive response
    res.json({
      success: true,
      message: aiResponse,
      search_summary: {
        query: msg,
        filters_applied: filters,
        total_found: properties.length,
        showing: Math.min(properties.length, 50)
      },
      properties: properties.slice(0, 20), // Return top 20 for display
      metadata: {
        mongodb_query: mongoQuery,
        sort_applied: sortQuery,
        response_time: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("💥 Chat endpoint error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Hi! I'm Shora from RoreReality.ae. I'm experiencing some technical difficulties, but I'm here to help you find your perfect property. Please try again!",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// ✅ Additional endpoint for getting available filter options
router.get("/filters", async (req, res) => {
  try {
    const filterOptions = await Property.aggregate([
      {
        $group: {
          _id: null,
          areas: { $addToSet: "$area" },
          developers: { $addToSet: "$developer" },
          property_types: { $addToSet: "$property_type" },
          statuses: { $addToSet: "$status" },
          bedroom_options: { $addToSet: "$bedrooms" },
          price_range: { 
            $push: { min: "$min_price", max: "$max_price" }
          }
        }
      }
    ]);

    const options = filterOptions[0] || {};
    
    res.json({
      success: true,
      available_filters: {
        areas: (options.areas || []).filter(a => a).sort(),
        developers: (options.developers || []).filter(d => d).sort(),
        property_types: (options.property_types || []).filter(pt => pt).sort(),
        statuses: (options.statuses || []).filter(s => s).sort(),
        bedroom_options: (options.bedroom_options || []).filter(b => b !== null).sort((a, b) => a - b),
        price_range: {
          min: Math.min(...(options.price_range || []).map(p => p.min).filter(p => p)),
          max: Math.max(...(options.price_range || []).map(p => p.max).filter(p => p))
        }
      }
    });
  } catch (err) {
    console.error("Filter options error:", err);
    res.status(500).json({ success: false, message: "Could not fetch filter options" });
  }
});

export default router;