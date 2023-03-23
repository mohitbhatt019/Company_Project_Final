import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Interceptor from "./Interceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTasks, faList } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
function EmployeeList() {
  const initData = {
    username: "",
    email: "",
    password: "",
    role: "",
    employeeName: "", //
    employeeAddress: "", //
    employee_Pancard_Number: "", //
    employee_Account_Number: "", //
    employee_PF_Number: "", //
    companyId: "", //
    leaveStatus: "",
  };

  const location = useLocation();
  const companyId = location.state?.companyId;
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({});
  const [designationForm, setDesignationForm] = useState({});
  const [assignDesignationForm, setassignDesignationForm] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const roles = ["Company", "Employee"];
  let userRole = localStorage.getItem("userIsInRole");

  const [designatioEmployee, setDesignatioEmployee] = useState([]);
  const [date, setDate] = useState(new Date());

  const [leaveList, setleaveList] = useState([]);
  const [leaveForm, setleaveForm] = useState({});
  const [specificCompanyLeaveee, setspecificCompanyLeaveee] = useState([]);

  // const [specificLeaveList, setSpecificLeaveList] = useState([]);

  const statusDropdown = document.getElementById("status");
  const leavechangeHandler = (event) => {
    setleaveForm({
      ...leaveForm,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    getAll(companyId);
  }, [companyId]);

  const changeHandler = (event) => {
    setEmployeeForm({
      ...employeeForm,
      [event.target.name]: event.target.value,
    });
  };

  const changeHand = (event) => {
    setDesignationForm({
      ...designationForm,
      [event.target.name]: event.target.value,
    });
  };

  const changeAssignDesignation = (event) => {
    setassignDesignationForm({
      ...assignDesignationForm,
      [event.target.name]: event.target.value,
    });
  };

  function getAll(companyId) {
    Interceptor.get(
      `https://localhost:44363/api/Company/EmployeesInTheCompany?companyId=${companyId}`
    )
      .then((response) => {
        //debugger
        //console.log(response.data);
        setEmployeeList(response.data.empInDb);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function saveClick() {
    debugger;
    //let token=localStorage.getItem("currentUser");
    employeeForm.role = selectedRole;
    employeeForm.companyId = companyId;
    //console.log(employeeForm)
    Interceptor.post("https://localhost:44363/api/Employee", employeeForm)
      .then((d) => {
        if (d) {
          setEmployeeForm({ companyId: companyId }); // Clear form fields except companyId
          getAll(companyId);
          window.Location.reload();
          alert("Employee Save Sucessfully");
          window.location.reload();
        } else {
          alert("Employee not saved");
          window.Location.reload();
        }
      })
      .catch((e) => {
        alert("Employee Already registered");
        window.location.reload();
      });
  }

  function handleNewEmployeeClick() {
    // setEmployeeForm(initData);

    document.getElementById("txtId").value = companyId;
    document.getElementById("txtId").disabled = true;
  }

  function saveDesignation() {
    debugger;
    //let token=localStorage.getItem("currentUser")
    console.log(designationForm);
    Interceptor.post(
      "https://localhost:44363/api/Company/AddDesignation",
      designationForm
    )
      .then((d) => {
        if (d.data.status == 2) {
          window.location.reload();
          alert(d.data.message);
          // getAll();
          //console.location.reload()
        } else {
          alert(d.data.message);
        }
      })
      .catch((e) => {
        window.location.reload();
        alert("Issue in api");
      });
  }

  function saveAssignDesignation() {
    debugger;
    //let token=localStorage.getItem("currentUser")
    console.log(assignDesignationForm);
    Interceptor.post(
      "https://localhost:44363/api/Company/AddEmployeeDesignation",
      assignDesignationForm
    )
      .then((d) => {
        if (d) {
          alert("Designation Assigned sucessfully");
          window.location.reload();
        } else {
          alert("Designation not Assigned");
        }
      })
      .catch((e) => {
        console.location.reload();
        alert("Issue in api");
      });
  }

  function designationsList() {
    debugger;
    let token = localStorage.getItem("currentUser");
    console.log(companyId);
    Interceptor.get(
      "https://localhost:44363/api/Company/EmployeesWithDesignationsInCompany/" +
        companyId
    )
      .then((d) => {
        if (d.data) {
          //console.log(d.data)
          setDesignatioEmployee(d.data);
          //alert("api Run")
        }
      })
      .catch((e) => {
        alert("No designation is assigned in the company");
      });
  }

  function deleteEmployeeDesignation(employeeId) {
    debugger;
    let ans = window.confirm("Want to delete data???");
    if (!ans) return;
    console.log(employeeId);
    Interceptor.delete(
      "https://localhost:44363/api/Company/DeleteEmployeesWithDesignationsInCompany?employeeId=" +
        employeeId
    )
      .then((d) => {
        if (d) {
          //alert(employeeId);
          alert("Data deleted successfully");
          designationsList();
          getAll();
        } else {
          alert(d.data.message);
        }
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
  }

  function editClick(data) {
    setEmployeeForm(data);
  }

  function updateClick() {
    debugger;
    console.log(employeeForm);
    Interceptor.put("https://localhost:44363/api/Employee", employeeForm)
      .then((d) => {
        if (d.data) {
          alert("Employee Details updated sucessfully");
          getAll(companyId);
        }
      })
      .catch((e) => {
        alert("Error in api");
      });
  }

  function deleteClick(employeeId) {
    debugger;
    //alert(id)
    let ans = window.confirm("Want to delete data???");
    if (!ans) return;

    Interceptor.delete(
      "https://localhost:44363/api/Employee?employeeId=" + employeeId
    )
      .then((d) => {
        if (d) {
          alert("Data deleted successfully");
          getAll(companyId);
        } else {
          alert(d.data.message);
        }
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
  }

  function leaveClick() {
    debugger;
    leaveForm.leaveStatus = 2;
    console.log(leaveForm);

    Interceptor.post("https://localhost:44363/api/Leave/AddLeave", leaveForm)
      .then((d) => {
        if (d.status == 1) {
          setleaveForm(d.data.leaveIdInDb);
          alert(d.message);
        } else {
          alert("Leave already applied, first delete it then apply new leave");
        }
      })
      .catch((e) => {
        alert(e);
      });
  }

  function leavesList() {
    debugger;
    Interceptor.get("https://localhost:44363/api/Leave/AllLeaves")
      .then((response) => {
        if (response.data) {
          setleaveList(response.data);
          console.log(leaveForm);
          //alert("Api running")
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        alert("Something went wrong with API");
      });
  }
  // statusDropdown.addEventListener("change", function() {
  //   const selectedValue = statusDropdown.value;
  //   ApproveLeave( selectedValue);
  // });

  function ApproveLeave(leaveId, value) {
    debugger;

    Interceptor.put(
      `https://localhost:44363/api/Leave/UpdateLeaveStatus?leaveId=${leaveId}&leaveStatus=${value}`
    )
      .then((response) => {
        if (response) {
          alert("Leave status changed successfully");
          specificCompanyLeave(companyId);
          leavesList();
        } else {
          alert("Leave status not changed");
        }
      })
      .catch((error) => {
        alert("Something went wrong with the API");
        console.log(error);
      });
  }

  function DeleteLeave(leaveId) {
    debugger;
    Interceptor.delete(
      `https://localhost:44363/api/Leave/DeleteLeaveRequest?leaveId=${leaveId}`
    )
      .then((response) => {
        if (response.data.status === 1) {
          specificCompanyLeave(companyId);
          leavesList();
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        alert("Something went wrong with the API");
      });
  }

  function specificCompanyLeave(companyId) {
    debugger;
    Interceptor.get(
      "https://localhost:44363/api/Leave/GetLeavesByCompanyId?companyId=" +
        companyId
    )
      .then((d) => {
        if (d) {
          //console.log(d.data)
          setspecificCompanyLeaveee(d.data);
          //alert("api Run")
        }
        console.log(specificCompanyLeaveee);
      })
      .catch((e) => {
        alert("Error in specifice CompanyLeave");
      });
  }

  //DataTable
  const columns = [
    {
      name: <h5 className="text-success bg-secondry"> Employee Id</h5>,
      selector: "employeeId",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success"> Employee Name</h5>,
      selector: "employeeName",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success"> Employee Address</h5>,
      selector: "employeeAddress",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success"> employee Pancard</h5>,
      selector: "employee_Pancard_Number",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success"> employee Account Number</h5>,
      selector: "employee_Account_Number",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success"> employee PF Number</h5>,
      selector: "employee_PF_Number",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success"> employee Role</h5>,
      selector: "role",
      sortable: true,
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
            className="btn btn-primary m-2"
            data-toggle="modal"
            value={row.employee}

            data-target="#editModal"
            style={{
              fontSize: "15px",
              padding: "10px 10px",
              fontWeight: "bold",
            }}
          >
            Edit 
          </button>

          <button
            onClick={() => deleteClick(row.employeeId)}
            className="btn btn-danger m-2"
            style={{
              fontSize: "15px",
              padding: "10px 10px",
              fontWeight: "bold",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const data = employeeList ? employeeList.map((item) => ({ ...item })) : [];

 
  return (
    <div>
      <div className="row">
        <div className="col-2 offset-1">
          <button
            className="btn btn-primary btn-lg btn-block mb-3 m-4"
            data-toggle="modal"
            data-target="#dsgModal"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            ADD DESIGNATION
          </button>
        </div>
        <div className="col-2">
          <button
            className="btn btn-primary btn-lg btn-block mb-3 m-4"
            data-toggle="modal"
            data-target="#assModal"
          >
            <FontAwesomeIcon icon={faTasks} className="mr-2" />
            Assign DESIGNATION
          </button>
        </div>
        <div className="col-2">
          <button
            className="btn btn-primary btn-lg btn-block mb-3  m-4"
            data-toggle="modal"
            data-target="#dsgListModal"
            onClick={designationsList}
          >
            <FontAwesomeIcon icon={faList} className="mr-2" />
            Designation List
          </button>
        </div>
        {userRole === "Admin" ? (
          <div className="col-2">
            <button
              className="btn btn-primary btn-lg btn-block mb-3  m-4"
              data-toggle="modal"
              data-target="#leaveListModal"
              onClick={leavesList}
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              Leave List
            </button>
          </div>
        ) : null}
        {/* <div className="col-2">
        <h2 className="text-secondary">Employee List</h2>
      </div> */}
        <div className="col-2">
          <button
            className="btn btn-primary btn-lg btn-block mb-3  m-4"
            data-toggle="modal"
            data-target="#newModal"
            onClick={handleNewEmployeeClick}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Employee
          </button>
        </div>
      </div>
      <div className="row">
        {userRole === "Company" || userRole === "Admin" ? (
          <div className="col-12 mb-3">
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={() => specificCompanyLeave(companyId)}
              data-toggle="modal"
              data-target="#specificCompanyLeave"
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              Company Leave Details
            </button>
          </div>
        ) : null}
      </div>
      <DataTable
        className="table table-borderd table-striped table-active table-hover"
        columns={columns}
        data={data}
        pagination={true}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        highlightOnHover={true}
      />

      {/* Save */}
      <form>
        <div className="modal" id="newModal" role="dialog">
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
                      name="employeeId"
                      className="form-control"
                      value={companyId}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-lg-4" for="txtusername">
                    Username
                  </label>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      id="txtusername"
                      onChange={changeHandler}
                      value={employeeForm.username}
                      placeholder="Enter Username"
                      className="Form-control"
                      name="Username"
                    />
                    {/* { <p className='text-danger'>{registerFormError.Username}</p> } */}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-lg-4" for="txtconfirmpassword">
                    Email
                  </label>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      onChange={changeHandler}
                      value={employeeForm.email}
                      id="txtconfirmpassword"
                      placeholder="Enter Email"
                      className="Form-control"
                      name="Email"
                    />
                    {/* { <p className='text-danger'>{registerFormError.Email}</p> } */}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-lg-4" for="txtpassword">
                    Password
                  </label>
                  <div className="col-lg-8">
                    <input
                      type="password"
                      onChange={changeHandler}
                      id="txtpassword"
                      value={employeeForm.password}
                      placeholder="Enter Password"
                      className="Form-control"
                      name="Password"
                    />
                    {/* { <p className='text-danger'>{registerFormError.Password}</p> } */}
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
                {/*
            <div className='form-group row'>
              <label for="EmployeeCompanyId" className='col-sm-4'>
                Employee Company Id
              </label>
              <div className='col-sm-8'>
                <input type="number" id="EmployeeCompanyId" name="companyId" placeholder="Enter Company Id"
                className="form-control" value={employeeForm.companyId} onChange={changeHandler}
                />
              </div>
            </div> */}

                <div className="form-group row">
                  <label className="col-lg-4" htmlFor="role">
                    User Role
                  </label>
                  <div className="col-lg-8">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      id="role"
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="modal-footer bg-info">
                <button
                  id="saveButton"
                  onClick={saveClick}
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

      {/* Designation */}

      <div class="modal" tabindex="-1" id="dsgModal" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Designation</h5>
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
              <div className="form-group row">
                <label for="txtdesignations" className="col-sm-4">
                  Designation
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="txtdesignations"
                    name="name"
                    placeholder="Enter DESIGNATION name"
                    className="form-control"
                    onChange={changeHand}
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                onClick={saveDesignation}
                data-dismiss="modal"
                class="btn btn-primary"
              >
                Save
              </button>
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

      {/*Assign Designation */}

      <div class="modal" tabindex="-1" id="assModal" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Assign Designation</h5>
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
              <div className="form-group row">
                <label for="txtdesignation" className="col-sm-4">
                  Designation
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="txtdesignation"
                    name="designationName"
                    placeholder="Enter DESIGNATION Name"
                    className="form-control"
                    //value={designationForm.name}
                    onChange={changeAssignDesignation}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label for="txtempid" className="col-sm-4">
                  Employee ID
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    id="txtempid"
                    name="employeeId"
                    placeholder="Enter Employee ID"
                    className="form-control"
                    //value={designationForm.name}
                    onChange={changeAssignDesignation}
                  />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                onClick={saveAssignDesignation}
                class="btn btn-primary"
                data-dismiss="modal"
              >
                Save
              </button>
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

      {/* Designation List dsgListModal */}

      <div class="modal" tabindex="-1" id="dsgListModal" role="dialog">
        <div class="modal-dialog" role="document">
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
                    <th>Employee Name</th>
                    <th>Designation Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {designatioEmployee.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.employeeName}</td>
                      <td>{employee.designations}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            deleteEmployeeDesignation(employee.employeeId)
                          }
                          class="btn btn-primary"
                        >
                          Delete
                        </button>
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
                      value={employeeList.employeeName}
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
                    {userRole == "Company" || userRole == "Admin" ? (
                      <input
                        type="text"
                        disabled
                        id="txtsalary"
                        name="employee_Pancard_Number"
                        placeholder="Enter Pancard Number"
                        className="form-control"
                        value={employeeForm.employee_Pancard_Number}
                        onChange={changeHandler}
                      />
                    ) : (
                      <input
                        type="text"
                        disabled
                        id="txtsalary"
                        name="employee_Pancard_Number"
                        placeholder="Enter Pancard Number"
                        className="form-control"
                        value={employeeForm.employee_Pancard_Number}
                        onChange={changeHandler}
                      />
                    )}
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

      {/* Employee Leave Aply
      <form>
          <div className='modal' id="leaveModal" role="dialog">
            <div className="modal-dialog">
              <div className='modal-content'>
                { header }
                <div className='modal-dialog '>
                  <div className='modal-content'>
  
                  </div>
                  
                </div>
                // { Body }
                <div className='modal-body'>



            <div className='form-group row'>
              <label for="txtname" className='col-sm-4'>
                Employee Id
              </label>
              <div className='col-sm-8'>
                <input type="text" id="txtname" name="employeeId" placeholder="Employee Id"
                className="form-control"  value={leaveForm.employeeId} onChange={leavechangeHandler}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label for="employeeAddress" className='col-sm-4'>
                Start date
              </label>
              <div className='col-sm-8'>
              <input type="date" data-date-inline-picker="true" name="startDate" className="form-control" value={leaveForm.startDate} onChange={leavechangeHandler}
                />
              </div>
            </div>

            <div className='form-group row'>
              <label for="txtname" className='col-sm-4'>
                End Date
              </label>
              <div className='col-sm-8'>
                <input type="date" data-date-inline-picker="true" id="txtname" name="endDate" placeholder="Enter Employee Name"
                className="form-control" value={leaveForm.endDate} onChange={leavechangeHandler}
                />
              </div>
            </div>

            <div className='form-group row'>
              <label for="Reason" className='col-sm-4'>
                Leave Reason
              </label>
              <div className='col-sm-8'>
                <input type="text" id="Reason" name="reason" placeholder="Enter Reason"
                className="form-control" value={leaveForm.leaveReason} onChange={leavechangeHandler}
                />
              </div>
            </div>


          </div>

          
                //{ Footer }
                <div className='modal-footer bg-info'>
                  <button id='saveButton'
                      onClick={leaveClick} 
                    className="btn btn-success" data-dismiss="modal">
                      Save 
                  </button>
                  <button className='btn btn-danger' data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form> */}

      {/*Admin Leave List */}

      <div class="modal" tabindex="-1" id="leaveListModal" role="dialog">
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
                    <th>Leave Id</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveList.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.leaveId}</td>
                      <td>{employee.startDate}</td>
                      <td>{employee.endDate}</td>
                      <td>{employee.reason}</td>
                      <td>
                        {/* <select id={`status-${employee.employeeId}`} name={`status-${employee.employeeId}`}>
            <option value="null">Select Status</option>
            <option value="1">Approve</option>
            <option value="2">Pending</option>
            <option value="3">Cancelled</option>
          </select> */}
                        {employee.leaveStatus === 1 && "Approve"}
                        {employee.leaveStatus === 2 && "Pending"}
                        {employee.leaveStatus === 3 && "Cancelled"}
                      </td>
                      <td>
                        <button
                          className="btn btn-success m-1"
                          onClick={() => ApproveLeave(employee.leaveId, 1)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-info m-1"
                          onClick={() => ApproveLeave(employee.leaveId, 3)}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => DeleteLeave(employee.leaveId)}
                        >
                          Delete
                        </button>
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

      {/* Specific Leave List */}

      {/* <div class="modal" tabindex="-1" id="specificleaveModal" role="dialog">
  <div class="modal-dialog-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Designations in CompanyId={companyId}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table class='table table-bodred table-hover'>
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
    {leaveList.map((leave, index) => (
      <tr key={index}>
        <td>{leave.employeeId}</td>
        <td>{leave.startDate}</td>
        <td>{leave.endDate}</td>
        <td>{leave.reason}</td>
        <td>
          {leave.leaveStatus === 1 && 'Approved'}
          {leave.leaveStatus === 2 && 'Pending'}
          {leave.leaveStatus === 3 && 'Cancelled'}
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div> */}

      {/* Company Leave List */}
      {/*Admin Leave List */}

      <div class="modal" tabindex="-1" id="specificCompanyLeave" role="dialog">
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
                    <th>Leave Id</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {specificCompanyLeaveee.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.leaveId}</td>
                      <td>{employee.startDate}</td>
                      <td>{employee.endDate}</td>
                      <td>{employee.reason}</td>
                      <td>
                        {/* <select id={`status-${employee.employeeId}`} name={`status-${employee.employeeId}`}>
            <option value="null">Select Status</option>
            <option value="1">Approve</option>
            <option value="2">Pending</option>
            <option value="3">Cancelled</option>
          </select> */}
                        {employee.leaveStatus === 1 && "Approve"}
                        {employee.leaveStatus === 2 && "Pending"}
                        {employee.leaveStatus === 3 && "Cancelled"}
                      </td>
                      <td>
                        <button
                          className="btn btn-success m-1"
                          onClick={() => ApproveLeave(employee.leaveId, 1)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-info m-1"
                          onClick={() => ApproveLeave(employee.leaveId, 3)}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => DeleteLeave(employee.leaveId)}
                        >
                          Delete
                        </button>
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

export default EmployeeList;
