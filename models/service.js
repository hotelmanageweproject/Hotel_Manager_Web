// bookingModel.js
import db from "../config/db.js"; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getService = async (
  serviceid,
  servicename,
  note,
  departmentid,
  departmentname,
  manager,
  description,
  search,
  limit,
  offset,
  sort
) => {
  let whereConditions = [];
  let query = "";
  if (serviceid) whereConditions.push(`s.serviceid = ${serviceid}`);
  if (servicename) whereConditions.push(`s.name LIKE '%${servicename}%'`);
  if (note) whereConditions.push(`s.note LIKE '%${note}%'`);
  if (departmentid) whereConditions.push(`d.departmentid = ${departmentid}`);
  if (departmentname) whereConditions.push(`d.name LIKE '%${departmentname}%'`);
  if (manager) whereConditions.push(`d.manager LIKE '%${manager}%'`);
  if (description)
    whereConditions.push(`d.description LIKE '%${description}%'`);
  // Thêm các điều kiện tương tự cho các tham số khác nếu chúng không phải là NULL
  if (search) {
    query = `
    SELECT s.serviceid, s.name AS servicename, s.note, d.departmentid, d.name AS departmentname, d.manager, d.description
    FROM services s
    JOIN departments d ON s.departmentid = d.departmentid
    WHERE s.serviceid::text LIKE '%${search}%' OR s.name LIKE '%${search}%' OR s.note LIKE '%${search}%' OR d.departmentid::text LIKE '%${search}%' OR d.name LIKE '%${search}%' OR d.manager LIKE '%${search}%' OR d.description LIKE '%${search}%'
    ORDER BY s.serviceid ASC LIMIT ${limit} OFFSET ${offset}`;
  } else {
    query = `
    SELECT s.serviceid, s.name AS servicename, s.note, d.departmentid, d.name AS departmentname, d.manager, d.description
    FROM services s
    JOIN departments d ON s.departmentid = d.departmentid
  `;
    if (whereConditions.length > 0) {
      query += "WHERE " + whereConditions.join(" AND ") + " ";
    }
    if (sort === "AtoZ") {
      query += `ORDER BY s.serviceid ASC `;
    } else if (sort === "ZtoA") {
      query += `ORDER BY s.serviceid DESC `;
    }
    query += `LIMIT ${limit} OFFSET ${offset}`;
  }

  const result = await db.query(query);
  return result.rows;
};

const getServiceDetails = async (serviceid) => {
  const query = `SELECT sv.serviceid ,s.staffid AS managerid, s.departmentid, s.personalid, s.firstname, s.lastname, s.birthdate, s.gender, s.email, s.phone, s.address, s.currentsal, s.startdate, s.enddate
FROM staff s
JOIN departments dpt ON dpt.manager = s.staffid
JOIN services sv ON sv.departmentid = dpt.departmentid
WHERE sv.serviceid = $1::bigint;
`;
  const values = [serviceid];
  const result = await db.query(query, values);
  return result.rows;
};

// Query thêm dữ liệu
const addService = (
  serviceid,
  servicename,
  note,
  departmentid,
  departmentname,
  manager,
  description
) => {
  return new Promise((resolve, reject) => {
    let query = ``;
    let values = [];
    if (serviceid && servicename && departmentid) {
      query = `INSERT INTO services (serviceid, name, departmentid, note) VALUES ($1, $2, $3, $4) RETURNING serviceid`;
      values = [serviceid, servicename, departmentid, note];
    } else if (!serviceid && departmentid && departmentname && manager) {
      query = `INSERT INTO departments (departmentid, name, manager, description) VALUES ($1, $2, $3::bigint, $4) RETURNING departmentid`;
      values = [departmentid, departmentname, manager, description];
    } else {
      return reject(new Error("Invalid input parameters"));
    }

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return reject(err);
      } else {
        console.log("Query executed successfully");
        if (result.rows.length > 0) {
          resolve(result.rows[0].serviceid || result.rows[0].departmentid);
        } else {
          reject(new Error("It seems the value you entered does not exist."));
        }
      }
    });
  });
};

// Query xóa dữ liệu
const deleteService = (serviceid, departmentid) => {
  return new Promise((resolve, reject) => {
    let query = "";
    let values = [];
    if (serviceid !== "" && departmentid === "") {
      query = `DELETE FROM services WHERE serviceid = $1 RETURNING serviceid`;
      values = [serviceid];
      // Xóa dữ liệu trong bảng services: INPUT: serviceID
      // OUTPUT: serviceID vừa xóa sẽ được trả về (Có hoặc không)
    } else if (departmentid !== "" && serviceid === "") {
      query = `DELETE FROM departments WHERE departmentid = $1 RETURNING departmentid`;
      values = [departmentid];
      // Xóa dữ liệu trong bảng departments: INPUT: departmentID
      // OUTPUT: departmentID vừa xóa sẽ được trả về (Có hoặc không)
    }
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        reject(err);
      } else {
        console.log("Service deleted successfully");
        if (result.rows.length > 0) {
          resolve(result.rows[0].serviceid || result.rows[0].departmentid);
        } else {
          reject(new Error("It seems the value you entered does not exist."));
        }
      }
    });
  });
};
// Query cập nhật dữ liệu
const updateService = (
  serviceid,
  servicename,
  note,
  departmentid,
  departmentname,
  manager,
  description
) => {
  return new Promise((resolve, reject) => {
    let query = "";
    if (
      serviceid !== "" &&
      departmentname === "" &&
      manager === "" &&
      description === ""
    ) {
      const fields = {
        name: servicename,
        note,
        manager,
        description,
        departmentid,
      };
      let updates = [];

      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== "") {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      query = `UPDATE services SET ${updates.join(
        ", "
      )} WHERE serviceid = ${serviceid} RETURNING serviceid`;
      // Cập nhật dữ liệu trong bảng services: INPUT: serviceID, servicename, departmentID, note
      // OUTPUT: serviceID vừa cập nhật sẽ được trả về
    } else if (
      serviceid === "" &&
      departmentid !== "" &&
      (departmentname !== "" || manager !== "" || description !== "")
    ) {
      // Thay đổi departmentname thành name trong truy vấn
      const fields = { name: departmentname, note, manager, description };
      let updates = [];

      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== "") {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }

      query = `UPDATE departments SET ${updates.join(
        ", "
      )} WHERE departmentid = '${departmentid}' RETURNING departmentid`;
      // Cập nhật dữ liệu trong bảng departments: INPUT: departmentID, departmentname, manager, description
      // OUTPUT: departmentID vừa cập nhật sẽ được trả về
    }

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        reject(err);
      } else {
        console.log("Service updated successfully");
        if (result.rows.length > 0) {
          resolve(result.rows[0].serviceid || result.rows[0].departmentid);
        } else {
          reject(new Error("It seems the value you entered does not exist."));
        }
      }
    });
  });
};
// Export module
export default {
  getService,
  deleteService,
  updateService,
  addService,
  getServiceDetails,
};
