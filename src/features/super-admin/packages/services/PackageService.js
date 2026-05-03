import axios from "axios";

const BASE_URL = "http://89.116.122.211:5005";

// Map UI → API values
const FEATURE_MAP = {
  mess: "MESS_MANAGEMENT",
  canteen: "INVENTORY_MANAGEMENT",
};

// CREATE PACKAGE
export const createPackage = async (data) => {
  const form = new FormData();

  form.append("packageName", data.packageName);
  form.append("monthlyPrice", data.monthlyPrice);
  form.append("annualPrice", data.annualPrice);
  form.append("maxBeds", data.maxBeds);
  form.append("maxStaff", data.maxStaff);

  // append features properly
  data.features.forEach((feature) => {
    if (FEATURE_MAP[feature]) {
      form.append("features", FEATURE_MAP[feature]);
    }
  });

  const response = await axios.post(`${BASE_URL}/package/create`, form);

  return response.data;
};

// // GET ALL PACKAGES
// export const getPackages = async () => {
//   const response = await axios.get(`${BASE_URL}/package/all`);
//   return response.data;
// };

//========================================================================================================
//========================================================================================================
//========================================================================================================
