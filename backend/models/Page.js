import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  PropertiesSold: {
    type: String
  },
  happyClient: {
    type: String
  },
  Experience: {
    type: String
  },
  Satisfaction: {
    type: String
  },
  SiteName: {
    type: String
  },
  HeroTitle: {
    type: String
  },
  HeroSubtitle: {
    type: String
  },
  HeroImage: {
    type: String
  },
  primaryEmail: {
    type: String
  },
  supportEmail: {
    type: String
  },
  PhoneNumber: {
    type: String
  },
  Address: {
    type: String
  },
  Facebook: {
    type: String
  },
  Instagram: {
    type: String
  },
  Twitter: {
    type: String
  },
  LinkedIn: {
    type: String
  }
})

export default mongoose.model("Page", pageSchema)