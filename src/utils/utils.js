import axios from "axios";
const token = `Bearer ${sessionStorage.getItem("token")}`;
const getToken = () => {
 return `Bearer ${sessionStorage.getItem("token")}`;
};
// const token = sessionStorage.getItem("token");

// const forgetTooken = `Bearer ${sessionStorage.getItem('ERPForgetToken')}`;
// console.log("token in utils:", token);

// const Domain = 'http://192.168.21.232:5000';
// const Domain = 'http://192.168.20.109:5000';
// const Domain = 'https://auth.edu2all.in/sch';
// const Domain = "https://test.edu2all.in/hostel";
const Domain = "https://test.hostelo.in/back";

// ******************************************************************************************************
// ISHWAR //
// ******************************************************************************************************

// ******************************************************************************************************
// Login //
// ******************************************************************************************************

export const loginApi = async (data) => {
  try {
    var res = await axios.post(`${Domain}/login/all`, data);
    const token = res.data.token;
    sessionStorage.setItem("token", token);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// Logout //
export const logoutApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.delete(`${Domain}/login/logout`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//************************ Chef APIs ************************ */

export const getChefDashboardApi = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${Domain}/chef/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.log("GET CHEF DASHBOARD ERROR 👉", error);
    return error?.response || null;
  }
};

//************************ Select Hostel At Login ************************ */
//Get Admin Hostels
export const getAdminHostelsApi = async (userToken) => {
  try {
    var res = await axios.get(`${Domain}/login/select-hostel`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return res;
  } catch (error) {
    // console.error("Error fetching admin hostels:", error);
    return null;
  }
};

// Select Hostel
export const selectHostelApi = async (hostelId, userToken) => {
  try {
    var res = await axios.post(
      `${Domain}/login/select-hostel?hostelId=${hostelId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return res;
  } catch (error) {
    console.error("Error selecting hostel:", error);
    return null;
  }
};

//************************ Hostel APIs ************************ */

//********* Add Hostel********* */

export const addHostelApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    var res = await axios.post(`${Domain}/hostel/create`, data);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// const toCleanParams = (data) => {
//   const source =
//     data instanceof FormData ? Object.fromEntries(data.entries()) : data || {};

//   return Object.fromEntries(
//     Object.entries(source)
//       .filter(([, value]) => {
//         if (value instanceof File) return false;
//         if (value === undefined || value === null) return false;
//         if (typeof value === "string" && value.trim() === "") return false;
//         if (typeof value === "string" && value.trim() === "undefined") {
//           return false;
//         }
//         if (typeof value === "string" && value.trim() === "null") return false;
//         return true;
//       })
//       .map(([key, value]) => [
//         key,
//         typeof value === "string" ? value.trim() : value,
//       ]),
//   );
// };

const toHostelCreateParams = (data) => {
  const params = toCleanParams(data);
  const adminMode = params.__adminMode;
  const adminFields = [
    "adminName",
    "adminEmail",
    "adminPassword",
    "adminPhone",
    "adminAddress",
  ];

  delete params.__adminMode;

  if (adminMode === "existing" || (!adminMode && params.adminId)) {
    adminFields.forEach((field) => {
      delete params[field];
    });
    return params;
  }

  delete params.adminId;
  return params;
};

// export const addHostelApi = async (data) => {
//   try {
//     axios.defaults.headers.common["Authorization"] = token;
//     const params = toHostelCreateParams(data);

//     var res = await axios.post(
//       `${Domain}/hostel/create`,
//       {},
//       {
//         params,
//       },
//     );

//     if (res) {
//       return res;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     return error?.response;
//   }
// };

//********* Update Hostel********* */
export const updateHostelApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.put(
      `${Domain}/hostel/update/${id}`,
      {
        hostelImage: data.hostelImage || "", // ✅ body
      },
      {
        params: {
          hostelName: data.hostelName,
          address: data.address,
          hostelType: data.hostelType,
        },
      },
    );
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//*********** Get Hostel By Id *************** */
export const getHostelById = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/hostel/getById/${id}`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//********* Get All Hostel Details********* */
export const getAllHostelDetailsApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/hostel/getAll`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//********* Delete Hostel Details By Id********* */
export const deleteHostelById = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.delete(`${Domain}/hostel/delete/${id}`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// ************************* Package APIs ************************* */
//********* Get All Package Details********* */
export const getAllPackageApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/package/all`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//************************** GET ALL Admin ***************************/
export const getAllAdminApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/admin/getAllAdmin`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//************************** STAFF  API INTEGRATION ***************************/

//********* Get All Staff Details********* */

export const getAllStaffApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/staff/all`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const addStaffApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.post(`${Domain}/staff/add`, data);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const updateStaffApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.put(`${Domain}/staff/update/${id}`, data);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];

    const res = await axios.put(`${Domain}/staff/update/${id}`, null, {
      params: data, // 🔥 THIS is the correct way
    });

    return res;
  }
};

export const deleteStaffApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.delete(`${Domain}/staff/delete/${id}`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const getStaffByIdApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/staff/getById/${id}`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//*************************** Role Apis **************************** */

export const getAllRoleApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/roles/all`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const addRoleApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.post(
      `${Domain}/roles/add?identityName=${data.identityName}&roleName=${data.roleName}`,
      data,
    );
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const deleteRoleApi = async (roleId) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.delete(`${Domain}/roles/delete/${roleId}`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const updateRoleApi = async (roleId, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.put(
      `${Domain}/roles/update/${roleId}`,
      {}, // 🔥 body empty
      {
        params: {
          identityName: data.identityName,
          roleName: data.roleName,
        },
      },
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//********* Get AllStaffEmployee By Id ********* */
export const getAllStaffEmployeeIdApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/staff/next-employee-id`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//*************************** AccountSettings Updates Hostel and get all data by ID **************************** */

export const updateHostelByIdApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.put(
      `${Domain}/hostel/update/${id}`,
      null, // body empty
      {
        params: data, // 👈 ye important hai
      },
    );
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getHostelByIdApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get(`${Domain}/hostel/getById`);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// ******************************************** SignUp API ******************************************** */

export const signUpApi = async (data) => {
  try {
    var res = await axios.post(`${Domain}/login/signup`, data);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

//***************************************** Hostel Registration API ******************************************* */

export const registerHostelApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.post(`${Domain}/hostel/register`, data);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const addHostelRegisterApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.post(`${Domain}/hostel/user-create`, data, {
      params: data, // ✅ send data as query params
    });
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// ******************************************** Student APIs ******************************************** */

export const getAllStudentApi = async ({ page = 0, size = 10 }) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/student/all`, {
      params: {
        page,
        size,
      },
    });

    return res?.data || [];
  } catch (error) {
    console.log("GET STUDENT ERROR 👉", error);
    return [];
  }
};

export const getFeeSummaryByIdApi = async (studentId) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/fee/student-fee-summary`, {
      params: { studentId },
    });
    return res?.data;
  } catch (error) {
    console.log("GET STUDENT BY ID ERROR 👉", error);
    return null;
  }
};

export const getFeeDashboard = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/fee/dashboard`);
    return res?.data;
  } catch (error) {
    console.log("GET FEE DASHBOARD ERROR 👉", error);
    return null;
  }
};

// get FeeReceipt data by id
export const getFeeReceipt = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/fee/receipt`, {
      params: { transactionId: id },
    });
    return res?.data;
  } catch (error) {
    console.log("GET FEE RECEIPT ERROR 👉", error);
    return null;
  }
};

export const getFeePaymentHistory = async (studentId, page = 1) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/fee/student/payment-history`, {
      params: {
        studentId,
        page, // ✅ add this
        size: 10,
      },
    });
    return res?.data;
  } catch (error) {
    console.log("GET FEE PAYMENT HISTORY ERROR 👉", error);
    return null;
  }
};

export const postCollectFeeApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.post(`${Domain}/fee/collect`, null, {
      params: data, // ✅ send data as query params
    });
    return res;
  } catch (error) {
    console.log("COLLECT FEE ERROR 👉", error);
    return null;
  }
};

// *************************** ADMIN SUPPORT TICKETS APIS **************************** */

export const getAllSupportTicketsApi = async () => {
  try {
    console.log("getAllSupportTicketsApi started");

    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/support/getAlltickets`);

    console.log("getAllSupportTicketsApi success =>", res.data);
    return res.data;
  } catch (error) {
    console.log("GET ALL SUPPORT TICKETS ERROR 👉", error);
    return [];
  }
};

export const updateSupportTicketApi = async (id, payload) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.patch(`${Domain}/support/tickets/${id}`, null, {
      params: {
        userName: payload.studentName,
        subject: payload.subject,
        priority: payload.priority,
        status: payload.status,
      },
    });

    return res.data;
  } catch (error) {
    console.log("UPDATE SUPPORT TICKET ERROR 👉", error);
    return null;
  }
};

export const getSupportTicketByIdApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/support/tickets/${id}`);

    return res.data;
  } catch (error) {
    console.log("GET SUPPORT TICKET BY ID ERROR 👉", error);
    return null;
  }
};

// *************************** Student Panel Apis  **************************** */
// Fees Module

export const getFeeStudentDetails = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/fee/student/my-fee-details`);
    return res.data;
  } catch (error) {
    console.log("GET FEE STUDENT DETAILS ERROR 👉", error);
    return null;
  }
};

export const getStudentTransectionsApi = async (page = 1) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/fee/student/my-transactions`, {
      params: {
        page: page,
      },
    });
    return res.data;
  } catch (error) {
    console.log("GET STUDENT TRANSACTION HISTORY ERROR 👉", error);
    return null;
  }
};

// Student Profile
export const getStudentProfileApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/student/profile`);
    return res.data;
  } catch (error) {
    console.log("GET STUDENT PROFILE ERROR 👉", error);
    return null;
  }
};

// admin student get stundent by id api

export const getStudentByIdApi = async (studentId) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get(`${Domain}/student/getById`, {
      params: {
        studentId: studentId,
      },
    });

    return res;
  } catch (error) {
    console.log("GET STUDENT BY ID ERROR 👉", error);
    return null;
  }
};

// api

export const updateStudentProfileApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.put(`${Domain}/student/edit-profile`, data);
    return res.data;
  } catch (error) {
    console.log("UPDATE STUDENT PROFILE ERROR 👉", error);
    return null;
  }
};

// Student Support Tickets

export const createSupportTicketApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.post(`${Domain}/support/createTicket`, null, {
      params: data,
    });
    return res.data;
  } catch (error) {
    console.log("CREATE SUPPORT TICKET ERROR 👉", error);
    return null;
  }
};

/************************************ CHEFF **********************************/

/******Inventory********/
export const addInventoryCategoryApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.post(`${Domain}/inventory/category/add`, data);
    return res.data;
  } catch (error) {
    console.log("ADD INVENTORY CATEGORY ERROR 👉", error);
    return null;
  }
};

// Get all inventory categories
export const getAllInventoryCategoryApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/inventory/category/getAll`);
    return res.data;
  } catch (error) {
    console.log("GET ALL INVENTORY CATEGORY ERROR 👉", error);
    return [];
  }
};

// Get all inventory Items
export const getAllInventoryItemApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/inventory/item/getAll`);
    return res.data;
  } catch (error) {
    console.log("GET ALL INVENTORY CATEGORY ERROR 👉", error);
    return [];
  }
};

// Get category details by category id
export const getCategoryItemsByIdApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/inventory/category/${id}`);
    return res.data;
  } catch (error) {
    console.log("GET INVENTORY CATEGORY BY ID ERROR 👉", error);
    return null;
  }
};

// Delete inventory category by id
export const deleteInventoryCategoryApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.delete(`${Domain}/inventory/category/delete/${id}`);
    return res.data;
  } catch (error) {
    console.log("DELETE INVENTORY CATEGORY ERROR 👉", error);
    return null;
  }
};

// Delete inventory item by id
export const deleteInventoryItemApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.delete(`${Domain}/inventory/item/delete/${id}`);
    return res.data;
  } catch (error) {
    console.log(
      "DELETE INVENTORY ITEM ERROR 👉",
      error?.response?.data || error,
    );
    return null;
  }
};

// Update inventory category by id
export const updateInventoryCategoryApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.put(
      `${Domain}/inventory/category/update/${id}`,
      data,
    );
    return res.data;
  } catch (error) {
    console.log("UPDATE INVENTORY CATEGORY ERROR 👉", error);
    return null;
  }
};

// // Update inventory category item by id
// export const updateInventoryCategoryItemApi = async (id, data) => {
//   try {
//     axios.defaults.headers.common["Authorization"] = token;
//     const res = await axios.put(
//       `${Domain}/inventory/categoryItem/update/${id}`,
//       data,
//     );
//     return res.data;
//   } catch (error) {
//     console.log("UPDATE INVENTORY CATEGORY ITEM ERROR 👉", error);
//     return null;
//   }
// };

export const updateCategoryItemsApi = async (categoryId, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const formData = new FormData();

    data.itemName.forEach((name) => {
      formData.append("itemName", name);
    });

    data.skuId.forEach((sku) => {
      formData.append("skuId", sku);
    });

    const res = await axios.put(
      `${Domain}/inventory/categoryItem/update/${categoryId}`,
      formData,
    );

    return res.data;
  } catch (error) {
    console.log(
      "UPDATE CATEGORY ITEMS ERROR 👉",
      error?.response?.data || error,
    );
    return null;
  }
};

// // Update inventory item Only by id
export const updateInventoryItemOnlyApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.put(`${Domain}/inventory/item/update/${id}`, null, {
      params: {
        itemName: data.itemName,
        skuId: data.skuId,
        categoryId: data.categoryId,
      },
    });

    return res.data;
  } catch (error) {
    console.log("UPDATE INVENTORY ITEM ERROR 👉", error);
    return null;
  }
};

// Update  inventory item by id
export const updateInventoryItemApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.put(`${Domain}/inventory/item/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.log("UPDATE INVENTORY ITEM ERROR 👉", error);
    return null;
  }
};

// INVENTORY Stock Dashboard API

export const getInventoryStockDashboardApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/inventory/stock/dashboard`);
    return res.data;
  } catch (error) {
    console.log("GET INVENTORY STOCK DASHBOARD ERROR 👉", error);
    return null;
  }
};

export const addStockApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.post(`${Domain}/inventory/stock/add`, data);
    return res.data;
  } catch (error) {
    console.log("ADD STOCK ERROR 👉", error);
    return null;
  }
};

// FeedBack Stats
export const getFeedbackStatsApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/chef/feedback/stats`);
    return res.data;
  } catch (error) {
    console.log("GET FeedBack stats ERROR 👉", error);
    return null;
  }
};

//FeedBack List
export const getFeedbackListApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${Domain}/chef/feedback/list`);
    return res.data;
  } catch (error) {
    console.log("GET FeedBack ERROR 👉", error);
    return null;
  }
};

// ******************************************************************************************************
// ASIM //
// ******************************************************************************************************

// ===================Package Apis======================

// post  api for crating package

export const AddPackage = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.post(`${Domain}/package/create`, data);
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// get all package api

export const getPackages = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${Domain}/package/all`);
    return response.data;
  } catch (error) {
    // console.error("GET PACKAGES ERROR:", error);
    throw error; // important
  }
};

// get  package by id api

export const getPackageById = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${Domain}/package/getById/${id}`);

    return response.data;
  } catch (error) {
    // console.error("GET PACKAGE BY ID ERROR:", error);
    throw error;
  }
};

// update package api

export const updatePackageApi = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.put(`${Domain}/package/update/${id}`, data);

    return response.data; // ONLY return data
  } catch (error) {
    // console.error("UPDATE PACKAGE ERROR:", error);
    throw error;
  }
};

// delete Api

export const deletePackageApi = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res2 = await axios.delete(`${Domain}/package/delete/${id}`);
    if (res2) {
      return res2;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// =========== Admin Rooms =============

// POST amenity APi

export const addAmenityApi = async (data) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const formData = new FormData();

    formData.append("name", data.name);

    // image optional
    if (data.file) {
      formData.append("file", data.file);
    }

    const res = await axios.post(`${Domain}/amenities/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  } catch (error) {
    console.log("Add Amenity Error:", error);
    return error?.response || [];
  }
};

// GET api for aminities

export const getAllAmenitiesApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res2 = await axios.get(`${Domain}/amenities/all`);

    if (res2) {
      return res2;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// DELETE amenity APi

export const deleteAmenityById = async (id) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.delete(`${Domain}/amenities/delete?id=${id}`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("DELETE ERROR 👉", error);
    return error?.response || [];
  }
};

// PUT amenity APi

export const editAmenityById = async (id, name) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // ✅ IMPORTANT: encode name (handles spaces)
    const res = await axios.put(
      `${Domain}/amenities/update?id=${id}&name=${encodeURIComponent(name)}`,
    );

    return res;
  } catch (error) {
    console.log("UPDATE ERROR 👉", error);
    return [];
  }
};
//====================================================

// POST Add new category APi

export const AddnewCategory = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.post(`${Domain}/category/add`, data);

    return res;
  } catch (error) {
    console.log("Add Category Error:", error);
    return [];
  }
};

// ================Add Occupancy==============

// POST api add occupancy

export const AddOccupancyApi = async (formData) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.post(`${Domain}/occupancy/add`, formData);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Add Occupancy Error:", error);
    return [];
  }
};

// GET api to get occupancy

export const getAllOccupancyApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/occupancy/all`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Get Occupancy Error:", error);
    return [];
  }
};

// PUT api occupancy

export const updateOccupancyById = async (id, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.put(
      `${Domain}/occupancy/update?id=${id}&occupancyName=${data.get("occupancyName")}`,
    );

    return res;
  } catch (error) {
    console.log("Update Occupancy Error:", error);
    return [];
  }
};

// DELETE API occupancy

export const deleteOccupancyById = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.delete(`${Domain}/occupancy/delete?id=${id}`);

    return res;
  } catch (error) {
    console.log("Delete Occupancy Error:", error);
    return [];
  }
};

// GET api get all room category

export const getAllCategoryApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/category/all`);

    return res;
  } catch (error) {
    console.log("GET CATEGORY ERROR 👉", error);
    return [];
  }
};

// ===========Room Details==============

// GET api for room details in category

// POST API  Add room details

export const addRoomApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.post(
      `${Domain}/room/add?roomNameNumber=${data.roomNameNumber}&blockFloor=${data.blockFloor}&categoryId=${data.categoryId}&availableBeds=${data.availableBeds}&totalBeds=${data.totalBeds}&totalRoomPrice=${data.totalRoomPrice}&securityDeposit=${data.securityDeposit}`,
    );

    return res;
  } catch (error) {
    console.log("Add Room Error:", error);
    return [];
  }
};

// GET API Room details

export const getRoomAllData = async (params) => {
  try {
    const token = sessionStorage.getItem("token");

    console.log("FINAL TOKEN 👉", token);

    const res = await axios.get(`${Domain}/room/getall`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    console.log("FULL RESPONSE 👉", res);

    return res;
  } catch (error) {
    console.log("ERROR 👉", error?.response);
    return null;
  }
};

// admin room details delete api

export const deleteRoomApi = async (roomId) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.delete(`${Domain}/room/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        roomId: roomId,
      },
    });

    return res;
  } catch (error) {
    console.log("DELETE ROOM API ERROR 👉", error);
    return null;
  }
};

// get room by id

export const getRoomById = async (roomId) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${Domain}/room/getById`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        roomId: roomId, // 👈 matches swagger
      },
    });

    return res;
  } catch (error) {
    console.log("ROOM BY ID API ERROR 👉", error);
    return null;
  }
};

// Admin api

// POST api add student

export const addStudentApi = async (data) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.post(`${Domain}/student/add`, data);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("ADD STUDENT ERROR 👉", error);
    return [];
  }
};

// GET by ID api for student view

// GET api for student

export const getAllStudentsApi = async (params) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${Domain}/student/all`, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        searchKey: params?.searchKey || "",
        course: params?.course || "",
        year: params?.year || "",
        gender: params?.gender || "",
        page: params?.page || 1,
        size: params?.size || 10,
      },
    });

    return res;
  } catch (error) {
    console.log("GET STUDENTS ERROR 👉", error);

    return {
      data: {
        status: "error",
        students: [],
      },
    };
  }
};

// Admin student  UPDATE (PUT)

export const updateStudentApi = async (id, data) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.put(`${Domain}/student/update/${id}`, data);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("UPDATE STUDENT ERROR 👉", error);

    return [];
  }
};

// admin student get by id

// =================
// =================
// =================

// Admin Queries GET api

export const getAllQueriesApi = async (params = {}) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get(`${Domain}/enrollment/admin/all-requests`, {
      params: {
        status: params.status,
        hostelId: params.hostelId,
        page: params.page || 0,
        size: params.size || 10,
      },
    });

    return res;
  } catch (error) {
    console.log("GET QUERIES ERROR 👉", error);
    return [];
  }
};

// APPROVE
export const approveRequestApi = async (requestId) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.put(`${Domain}/enrollment/approve/${requestId}`);

    return res;
  } catch (error) {
    console.log("APPROVE ERROR 👉", error);
    return null;
  }
};

// REJECT
export const rejectRequestApi = async (requestId, reason) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.put(
      `${Domain}/enrollment/reject/${requestId}`,
      null,
      {
        params: {
          rejectionReason: reason || "Rejected by admin",
        },
      },
    );

    return res;
  } catch (error) {
    console.log("REJECT ERROR 👉", error);
    return null;
  }
};

// ================= SUPER ADMIN QUERY APIS =================

export const getAllSuperAdminQueriesApi = async (params = {}) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get(`${Domain}/admin/getAllQuery`, {
      params: {
        type: params.type,
        searchKey: params.searchKey,
        status: params.status,
        page: params.page || 1,
        size: params.size || 50,
      },
    });

    return res;
  } catch (error) {
    console.log("GET SUPER ADMIN QUERIES ERROR 👉", error);
    return error?.response || [];
  }
};

export const getSuperAdminQueryByIdApi = async (params = {}) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.get(`${Domain}/admin/getQueryById`, {
      params: {
        type: params.type,
        id: params.id,
      },
    });

    return res;
  } catch (error) {
    console.log("GET SUPER ADMIN QUERY BY ID ERROR 👉", error);
    return error?.response || [];
  }
};

export const updateSuperAdminQueryStatusApi = async (id, params = {}) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const requestParams = toCleanParams({
      type: params.type,
      status: params.status,
    });
    const requestBody = toCleanParams({
      issueStatus: params.issueStatus,
      propertyName: params.propertyName,
      ownerName: params.ownerName,
      studentName: params.studentName,
      hostelName: params.hostelName,
      contactNumber: params.contactNumber,
      email: params.email,
      address: params.address,
      message: params.message,
      roomType: params.roomType,
    });

    const res = await axios.put(
      `${Domain}/admin/updateQueryStatus/${id}`,
      requestBody,
      {
        params: requestParams,
      },
    );

    return res;
  } catch (error) {
    console.log("UPDATE SUPER ADMIN QUERY ERROR 👉", error);
    return error?.response || null;
  }
};

//*************************** User Apis **************************** */
//*************************** User Apis **************************** */
//*************************** User Apis **************************** */

// GET API for get all hostels for user

export const getHostelAllData = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    var res = await axios.get(`${Domain}/hostel/public/getAll`);

    return res || [];
  } catch (error) {
    return [];
  }
};

// GET BY ID API use to get  Hostel data

export const getHostelDataById = async (id) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    var res = await axios.get(`${Domain}/hostel/getById/${id}`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// POST API for send request to Admin

export const createEnrollmentRequest = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.post(`${Domain}/hostel/enrollment/request`, null, {
      params: data,
    });

    return res || [];
  } catch (error) {
    return [];
  }
};

// *************************** Dashboard API **************************** //

export const getDashboardAdminApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    var res = await axios.get(`${Domain}/dashboard/admin`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("DASHBOARD API ERROR 👉", error);
    return [];
  }
};

// Admin profile Get API

export const getAdminProfileApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/admin/profile`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("GET ADMIN PROFILE ERROR 👉", error);
    return [];
  }
};

// Admin profilt PUT api

export const updateAdminPersonalDetailsApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.put(`${Domain}/admin/updatePersonalDetails`, null, {
      params: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        pinCode: data.pinCode,
        country: data.country,
        state: data.state,
        city: data.city,
      },
    });

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("UPDATE ADMIN PROFILE ERROR 👉", error);
    return [];
  }
};

// Admin Package GET api

export const getAllPackageData = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}package/all`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// admin Notice DELETE api

export const deleteNoticeApi = async (noticeId) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.delete(`${Domain}/notice/delete/${noticeId}`);

    return res;
  } catch (error) {
    console.log("DELETE NOTICE ERROR 👉", error);
    return null;
  }
};

// Admin Notice GET api

export const getAllNoticesApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}/notice/all`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// Admin Notic POST api

export const createNoticeApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.post(`${Domain}/notice/create`, null, {
      params: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
      },
    });

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("CREATE NOTICE ERROR 👉", error);
    return [];
  }
};

// admin notice PUT api

export const updateNoticeApi = async (noticeId, data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.put(`${Domain}/notice/update/${noticeId}`, null, {
      params: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: true,
      },
    });

    return res;
  } catch (error) {
    console.log("UPDATE NOTICE ERROR 👉", error);
    return null;
  }
};

// ====

export const Getadminswitchaccount = async (params = {}) => {
  try {
    const token = sessionStorage.getItem("token");
    var res = await axios.get(`${Domain}/login/my-hostels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return error?.response || [];
  }
};

// ================= STUDENT GET API =================

export const getStudentMyRoomApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    var res = await axios.get(`${Domain}student/my-room`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

// === Student dashboard GET api

export const getStudentDashboardApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const res = await axios.get(`${Domain}student/dashboard`);

    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
};

// Chef Add menu planner POST api

export const addMessPlannerApi = async (data) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    var res = await axios.post(
      `${Domain}/messMenu/addPlanner`,
      {},
      {
        params: data,
      },
    );

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return error?.response;
  }
};

export const getMessMenuFullWeekApi = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${Domain}/messMenu/getFullWeek`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.log("GET MESS MENU FULL WEEK ERROR 👉", error);
    return error?.response || null;
  }
};

// Mess menu GET by date API

export const getMessMenuByDateApi = async (date) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${Domain}/messMenu/planner/getByDate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date,
      },
    });

    return res;
  } catch (error) {
    console.log("GET MESS MENU BY DATE ERROR 👉", error);
    return error?.response || null;
  }
};

//

export const updateMessPlannerApi = async (data) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.put(
      `${Domain}/messMenu/updatePlanner`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        params: data,
      },
    );
    return res;
  } catch (error) {
    return error?.response;
  }
};

// delete category api for admin

export const deleteCategoryById = async (id) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.delete(`${Domain}/category/delete?id=${id}`);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("DELETE CATEGORY ERROR 👉", error);
    return error?.response || [];
  }
};

// edit category of admin room

export const editCategoryById = async (id, data) => {
  try {
    const token = sessionStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axios.put(`${Domain}/category/update?id=${id}`, data);

    if (res) {
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR 👉", error);

    return error?.response || [];
  }
};
