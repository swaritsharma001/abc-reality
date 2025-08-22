import mongoose from "mongoose"
const PropertySchema = new mongoose.Schema({
  area: { type: String },
  area_unit: { type: String },
  completion_datetime: { type: String },
  coordinates: { type: String },
  cover_image_url: { type: String },
  developer: { type: String },
  has_escrow: { type: Boolean },
  is_partner_project: { type: Boolean },
  max_price: { type: Number },
  min_price: { type: Number },
  min_price_aed: { type: Number },
  min_price_per_area_unit: { type: Number },
  name: { type: String },
  post_handover: { type: Boolean },
  price_currency: { type: String },
  sale_status: { type: String },
  status: { type: String },
  id: { type: Number}
})

//export them
const Property = mongoose.model("Property", PropertySchema)
//export them

export default Property