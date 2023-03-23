import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Interceptor from "./Interceptor";
import DataTable from "react-data-table-component";
import { Row } from "react-bootstrap";

function EmployeeDetail() {
  const location = useLocation();
  const initData = {
    employeeId: "",
    username: "",
    email: "",
    password: "",
    role: "",
    employeeName: "", //
    employeeAddress: "", //
    employee_Pancard_Number: "", //
    employee_Account_Number: "", //
    employee_PF_Number: "", //
    companyId: "",
    leaveId: "",
  };
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({});
  const companyId = location.state?.companyId;
  const [leaveForm, setleaveForm] = useState({});
  let [specificLeaveList, setSpecificLeaveList] = useState([]);
  let employeeId = localStorage.getItem("employeeIdOfCurrentUser");

  const leavechangeHandler = (event) => {
    setleaveForm({
      ...leaveForm,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    let name = localStorage.getItem("usernameByLS");
    getAll(name);
    //alert(employeeList)
  }, []);

  const changeHandler = (event) => {
    setEmployeeForm({
      ...employeeForm,
      [event.target.name]: event.target.value,
    });
  };

  function getAll(name) {
    console.log(employeeForm);

    //console.log(employeeList)
    Interceptor.get(
      `https://localhost:44363/api/Company/GetEmployeeForSpecificUsers?username=${name}`
    )
      .then((response) => {
        debugger;
        //console.log(response.data);
        setEmployeeList(response.data.employees);
        // console.log(response.data)
        localStorage.setItem(
          "employeeIdOfCurrentUser",
          response.data.employeeId
        );
        // alert(response.data.employeeId)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function editClick(data) {
    setEmployeeForm(data);
  }

  function updateClick() {
    debugger;
    console.log(employeeForm);
    let name = localStorage.getItem("usernameByLS");

    Interceptor.put("https://localhost:44363/api/Employee", employeeForm)
      .then((d) => {
        if (d.data) {
          alert("Details updated sucessfully");
          getAll(name);
        }
      })
      .catch((e) => {
        alert("Error in api");
      });
  }

  function leaveClick() {
    debugger;
    leaveForm.leaveStatus = 2;
    leaveForm.employeeId = employeeId;
    console.log(leaveForm);
    Interceptor.post("https://localhost:44363/api/Leave/AddLeave", leaveForm)
      .then((d) => {
        if (d.data.status == 1) {
          setleaveForm(d.data.leaveIdInDb);
          alert("Leave created sucessfully");
          window.location.reload();
        } else {
          alert(d.data.message);
          window.location.reload();
        }
      })
      .catch((e) => {
        alert(e);
        window.location.reload();
      });
  }

  function getSpecificEmployeeLeaves(employeeId) {
    Interceptor.get(
      `https://localhost:44363/api/Leave/SpecificEmployeeLeaves?employeeId=${employeeId}`
    )
      .then((response) => {
        console.log(response.data);

        setSpecificLeaveList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(specificLeaveList);
  }

  //Datatable
  const columns = [
    {
      name: <h5 className="text-success bg-secondry">Employee Id</h5>,
      selector: "employeeId",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success">Employee Name</h5>,
      selector: "employeeName",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      //name: "Company Address",
      name: <h5 className="text-success"> Employee Address</h5>,
      selector: "employeeAddress",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h4 className="text-success">Employee Account No.</h4>,
      selector: "employee_Account_Number",
      sortable: "true",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h4 className="text-success">Employee PF No.</h4>,
      selector: "employee_PF_Number",
      sortable: "true",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h4 className="text-success">Employee Role</h4>,
      selector: "role",
      sortable: "true",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success">Actions</h5>,
      cell: (row) => (
        <div className="col-12">
          <button
            onClick={() => editClick(row)}
            className="btn btn-info p-1 btn-sm"
            data-toggle="modal"
            data-target="#editModal"
            style={{
              fontSize: "16px",
              padding: "2px 2px",
              fontWeight: "bold",
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-primary m-1 btn-sm"
            value={row.employeeId}
            data-target="#leaveModal"
            data-toggle="modal"
            style={{
              fontSize: "16px",
              padding: "2px 2px",
              fontWeight: "bold",
            }}
          >
            Leave
          </button>
          <button
            className="btn btn-secondary m-1 btn-sm"
            onClick={() => getSpecificEmployeeLeaves(row.employeeId)}
            value={row.employeeId}
            data-target="#specificleaveModal"
            data-toggle="modal"
            style={{
              fontSize: "16px",
              padding: "2px 2px",
              fontWeight: "bold",
            }}
          >
            Leave status
          </button>
        </div>
      ),
    },
  ];
  const data = employeeList ? employeeList.map((item) => ({ ...item })) : [];
  console.log(data);
  let userRole = localStorage.getItem("userIsInRole");

  return (
    <div>
      <div className="row">
        <div className="col-4 offset-4">
          <h2 className="text-secondry">Employee Details</h2>
        </div>
      </div>

      <DataTable
        className="table table-bordered table-striped table-active table-hover"
        columns={columns}
        data={data}
        pagination={true}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        highlightOnHover={true}
      />

      {/*Employee Leave Aply */}
      <form>
        <div className="modal" id="leaveModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* header */}
              <div className="modal-dialog ">
                <div className="modal-content"></div>
              </div>
              {/* Body */}
              <div className="modal-body">
                <div className="form-group row">
                  <label htmlFor="txtname" className="col-sm-4">
                    Employee Id
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtname"
                      name="employeeId"
                      placeholder="Employee Id"
                      className="form-control"
                      disabled
                      value={employeeId}
                      onChange={leavechangeHandler}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="employeeAddress" className="col-sm-4">
                    Start date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      data-date-inline-picker="true"
                      name="startDate"
                      className="form-control"
                      value={leaveForm.startDate}
                      onChange={leavechangeHandler}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="txtname" className="col-sm-4">
                    End Date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      data-date-inline-picker="true"
                      id="txtname"
                      name="endDate"
                      placeholder="Enter Employee Name"
                      className="form-control"
                      value={leaveForm.endDate}
                      onChange={leavechangeHandler}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="Reason" className="col-sm-4">
                    Leave Reason
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="Reason"
                      name="reason"
                      placeholder="Enter Reason"
                      className="form-control"
                      value={leaveForm.leaveReason}
                      onChange={leavechangeHandler}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer bg-info">
                <button
                  id="saveButton"
                  onClick={leaveClick}
                  className="btn btn-success"
                  data-dismiss="modal"
                >
                  Save
                </button>
                <button className="btn btn-danger" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/*  Edit */}
      <form>
        <div className="modal" id="editModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* header */}
              <div className="modal-dialog ">
                <div className="modal-content"></div>
              </div>
              {/* Body */}
              <div className="modal-body">
                <div className="form-group row">
                  <label for="txtId" className="col-sm-4">
                    Employee Company ID
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtId"
                      disabled
                      name="employeeId"
                      className="form-control"
                      value={companyId}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="txtname" className="col-sm-4">
                    Employee Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtname"
                      name="employeeName"
                      placeholder="Enter Employee Name"
                      className="form-control"
                      value={employeeForm.employeeName}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="employeeAddress" className="col-sm-4">
                    Employee Address
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="employeeAddress"
                      name="employeeAddress"
                      placeholder="Enter Address"
                      className="form-control"
                      value={employeeForm.employeeAddress}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="txtsalary" className="col-sm-4">
                    employee Pancard Number
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtsalary"
                      name="employee_Pancard_Number"
                      placeholder="Enter Pancard Number"
                      className="form-control"
                      value={employeeForm.employee_Pancard_Number}
                      onChange={changeHandler}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="employee_Account_Numberrr" className="col-sm-4">
                    Employee Account Number
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="number"
                      id="employee_Account_Numberrr"
                      name="employee_Account_Number"
                      placeholder="Enter  Account Number"
                      className="form-control"
                      value={employeeForm.employee_Account_Number}
                      onChange={changeHandler}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="employee_PF_Number" className="col-sm-4">
                    Employee PF Number
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="number"
                      id="employee_PF_Number"
                      name="employee_PF_Number"
                      placeholder="Enter Employee PF Number"
                      className="form-control"
                      value={employeeForm.employee_PF_Number}
                      onChange={changeHandler}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-8">
                    <input
                      type="text"
                      hidden
                      id="employee_PF_Number"
                      name="employee_PF_Number"
                      placeholder="Enter Employee PF Number"
                      className="form-control"
                      value={employeeForm.applicationUserId}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="modal-footer bg-info">
                <button
                  id="saveButton"
                  onClick={updateClick}
                  className="btn btn-success"
                  data-dismiss="modal"
                >
                  Update
                </button>
                <button className="btn btn-danger" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Specific Leave List */}

      <div class="modal" tabindex="-1" id="specificleaveModal" role="dialog">
        <div class="modal-dialog-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Designations in CompanyId={companyId}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <table class="table table-bodred table-hover">
                <thead>
                  <tr>
                    <th>Employee Id</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {specificLeaveList?.map((leave, index) => (
                    <tr key={index}>
                      <td>{leave.employeeId}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.reason}</td>
                      <td>
                        {leave.leaveStatus === 1 && "Approved"}
                        {leave.leaveStatus === 2 && "Pending"}
                        {leave.leaveStatus === 3 && "Cancelled"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
