import express from "express";
import OpenAI from "openai";
import Property from "../models/Property.js";

const router = express.Router();

// ✅ OpenAI client
const openai = new OpenAI({
  apiKey: "AIzaSyCZMJ2-bOuXX8d-LddWajul_7Wv-SQoikU",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// ✅ Company Information
const COMPANY_INFO = {
  name: "roarrealty.ae",
  office: "1507, Al Manara Tower, Business Bay, Dubai, United Arab Emirates",
  phone: "+971 585005438",
  email: "anurag@roarrealty.ae"
};

// ✅ Intent detection - Check if user wants property search or just chatting
async function detectIntent(userQuery) {
  const prompt = `
  User ne ye message bheja hai: "${userQuery}"

  Tum judge karo ki user ka intent kya hai. Sirf JSON response do:

  {
    "intent": "property_search" ya "general_chat" ya "company_info",
    "confidence": 0.1 to 1.0 scale mein confidence level,
    "reason": "short explanation"
  }

  Intent types:
  - "property_search": User property dhund raha hai (villa, apartment, specific area, price, bedrooms, etc.)
  - "company_info": User company/contact ke baare mein puch raha hai
  - "general_chat": User sirf greeting kar raha hai ya general baat kar raha hai

  Examples:
  "hi" → {"intent": "general_chat", "confidence": 0.9, "reason": "simple greeting"}
  "hello" → {"intent": "general_chat", "confidence": 0.9, "reason": "greeting"}
  "3 bedroom villa" → {"intent": "property_search", "confidence": 0.95, "reason": "specific property requirement"}
  "contact number" → {"intent": "company_info", "confidence": 0.9, "reason": "asking for contact info"}
  "your office" → {"intent": "company_info", "confidence": 0.85, "reason": "asking about office location"}

  Sirf JSON return karo:
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
    const intent = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      intent: intent.intent || "general_chat",
      confidence: intent.confidence || 0.5,
      reason: intent.reason || "default classification"
    };
  } catch (err) {
    console.error("Intent detection error:", err);
    return { intent: "general_chat", confidence: 0.3, reason: "error in detection" };
  }
}

// ✅ Enhanced filter extraction with more property types
async function extractFilters(userQuery) {
  const prompt = `
  User ne property search ke liye ye query di hai: "${userQuery}"

  Tum Shora ho, roarrealty.ae ki AI assistant jo users ko property dhundne mein help karti ho.

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
    "amenities": ["Swimming Pool", "Gym", "Parking"], // agar specific amenities mention kiye ho,
    "floor_range": {"min": number, "max": number}, // agar floor preference mention kiya ho,
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

// ✅ Generate general chat response
async function generateGeneralResponse(userQuery) {
  const prompt = `
  User ne ye message bheja hai: "${userQuery}"

  Tum Shora ho, roarrealty.ae ki friendly AI assistant jo Dubai real estate mein specialize karti ho.

  User ko warm welcome karo aur property search ke liye encourage karo. Response mein include karo:

  1. Friendly greeting as Shora from RoreReality.ae
  2. Ask how you can help them find their dream property
  3. Give examples of what they can search for (like "3 bedroom villa in Downtown Dubai" or "affordable apartments in Damac Hills")
  4. Keep it warm, professional, and inviting

  Generate a natural, conversational response in English.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userQuery },
      ],
    });

    return completion.choices[0]?.message?.content || 
      "Hello! I'm Shora from roarrealty.ae 👋 I'm here to help you find your perfect property in Dubai! Whether you're looking for a luxury villa, cozy apartment, or investment opportunity, just let me know your requirements. Try asking something like '3 bedroom apartment in Downtown Dubai' or 'villas under 2 crore'. How can I assist you today?";
  } catch (err) {
    console.error("General response error:", err);
    return "Hello! I'm Shora from roarrealty.ae 👋 I'm here to help you find the perfect property in Dubai. What kind of property are you looking for today?";
  }
}

// ✅ Generate company info response
async function generateCompanyInfoResponse(userQuery) {
  const prompt = `
  User ne company information ke baare mein poocha hai: "${userQuery}"

  Company details:
  - Name: roarrealty.ae
  - Office: 1507, Al Manara Tower, Business Bay, Dubai, United Arab Emirates  
  - Phone: +971 585005438
  - Email: anurag@roarrealty.ae

  Tum Shora ho, company ki AI assistant. User ko company information provide karo in a friendly, professional way.

  Generate a natural response with the relevant information they asked for.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userQuery },
      ],
    });

    return completion.choices[0]?.message?.content || 
      `Here's our contact information:\n\n📍 **Office:** 1507, Al Manara Tower, Business Bay, Dubai, United Arab Emirates\n📞 **Phone:** +971 585005438\n✉️ **Email:** anurag@roarrealty.ae\n\nFeel free to reach out to us anytime! I'm also here to help you search for properties. What are you looking for?`;
  } catch (err) {
    console.error("Company info response error:", err);
    return `Here's how to reach us:\n\n📍 Office: 1507, Al Manara Tower, Business Bay, Dubai, UAE\n📞 Phone: +971 585005438\n✉️ Email: anurag@roarreality.ae\n\nHow can I help you with your property search today?`;
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

// ✅ Generate comprehensive Shora response for property search
async function generatePropertyResponse(userQuery, properties, filters, appliedQuery) {
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

  and always reply in english
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

// ✅ Enhanced chat endpoint with intent detection
router.get("/", async (req, res) => {
  try {
    const { msg } = req.query;
    if (!msg || msg.trim().length === 0) {
      return res.status(400).json({ 
        error: "Please provide a message!",
        example: "Try: 'Hi' or '3 bedroom villa in Damac Hills under 2 crore'" 
      });
    }

    console.log(`🔍 User Query: ${msg}`);

    // 1️⃣ Detect user intent first
    const intentResult = await detectIntent(msg.trim());
    console.log(`🎯 Intent Detection:`, intentResult);

    let response;

    // 2️⃣ Handle based on intent
    if (intentResult.intent === 'property_search' && intentResult.confidence > 0.7) {
      // Property search flow
      console.log("🏠 Processing property search...");

      const filters = await extractFilters(msg.trim());
      console.log(`📋 Extracted Filters:`, filters);

      const mongoQuery = buildQuery(filters);
      console.log(`🗄️ MongoDB Query:`, JSON.stringify(mongoQuery, null, 2));

      const sortQuery = getSorting(msg, filters);
      console.log(`📊 Sort Query:`, sortQuery);

      const properties = await Property.find(mongoQuery)
        .sort(sortQuery)
        .limit(500)
        .select(`
          name area developer property_type bedrooms bathrooms 
          min_price max_price area_sqft status sale_status 
          amenities floor furnished payment_plan description
        `)
        .lean();

      //console.log(`✅ Found ${properties.length} properties`);

      const aiResponse = await generatePropertyResponse(msg, properties, filters, mongoQuery);

      response = {
        success: true,
        intent: 'property_search',
        message: aiResponse,
        search_summary: {
          query: msg,
          filters_applied: filters,
          total_found: properties.length,
          showing: Math.min(properties.length, 50)
        },
        properties: properties.slice(0, 20),
        metadata: {
          mongodb_query: mongoQuery,
          sort_applied: sortQuery,
          response_time: new Date().toISOString()
        }
      };

    } else if (intentResult.intent === 'company_info') {
      // Company information flow
      console.log("🏢 Providing company information...");
      const aiResponse = await generateCompanyInfoResponse(msg);

      response = {
        success: true,
        intent: 'company_info',
        message: aiResponse,
        company_info: COMPANY_INFO
      };

    } else {
      // General chat flow
     // console.log("💬 Handling general chat...");
      const aiResponse = await generateGeneralResponse(msg);

      response = {
        success: true,
        intent: 'general_chat',
        message: aiResponse,
        suggestions: [
          "3 bedroom villa in Downtown Dubai",
          "Affordable apartments under 1 crore",
          "Luxury penthouses with sea view",
          "Ready to move properties in Damac Hills"
        ]
      };
    }

    res.json(response);

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
