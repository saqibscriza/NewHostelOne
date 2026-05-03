import axios from "axios";
// const token = `Bearer ${sessionStorage.getItem("token")}`;
const token = sessionStorage.getItem("token");

// const forgetTooken = `Bearer ${sessionStorage.getItem('ERPForgetToken')}`;
// console.log("token in utils:", token);

// const Domain = 'http://192.168.21.232:5000';
// const Domain = 'http://192.168.20.109:5000';
// const Domain = 'https://auth.edu2all.in/sch';
const Domain = "https://test.edu2all.in/hostel";

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
export const addHostelApi = async (data, hostelType) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.post(`${Domain}/hostel/create`, data, {
      params: {
        hostelType: hostelType,
      },
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
    var res = await axios.delete(`${Domain}/hostel/delete`, {
      params: { hostelId: id }, // ✅ IMPORTANT
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
      }
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

export const addAmenityApi = async (name, file) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const formData = new FormData();
    formData.append("file", file); // ✅ send image

    const res = await axios.post(
      `${Domain}/amenities/add?name=${name}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res;
  } catch (error) {
    console.log("Add Amenity Error:", error);
    return [];
  }
};


export const getAllAmenitiesApi = async () => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res2 = await axios.delete(`${Domain}/amenities/delete?id=${id}`);

    return res2;
  } catch (error) {
    console.log("DELETE ERROR 👉", error);
    return [];
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
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

// get all room data



export const getRoomAllData = async (params) => {
  try {
    const storedToken = localStorage.getItem("token");

    const res = await axios.get(`${Domain}/room/getall`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
      params: params, // ✅ now dynamic
    });

    return res;
  } catch (error) {
    console.log("ROOM Api =========", error);
    return null;
  }
};

// get room by id

export const getRoomById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${Domain}/room/getById`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        roomId: id, 
      },
    });

    return res;
  } catch (error) {
    console.log("GET ROOM BY ID ERROR 👉", error);
    return null;
  }
};