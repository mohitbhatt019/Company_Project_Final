import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function EmployeeDetail(){
    const initData={
        employeeId:"",
        username:"",
        email:"",
        password:"",
        role:"",
        employeeName:"",//
        employeeAddress:"",//
        employee_Pancard_Number:"",//
        employee_Account_Number:"",//
        employee_PF_Number:"",//
        companyId:"",
        leaveId:""
      };
    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        let name=localStorage.getItem("usernameByLS")
        getAll(name);
        alert(employeeList)
   }, []);
   const location = useLocation();


   function getAll(name) {
        const token = localStorage.getItem('currentUser');
        //console.log(employeeList)
        axios
          .get(`https://localhost:44363/api/Company/GetEmployeeForSpecificUsers?username=${name}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            debugger
            //console.log(response.data);
            setEmployeeList(response.data);
            console.log(response.data)
          })
          .catch((error) => {
            console.error(error);
          });
      }
    return(
        <div>
           <div className='row'>  
            <div className='col-4 offset-4'>
                <h2 className='text-info'>Employee Details</h2>
            </div>
            
          
        </div>
      <table className="table table-bordered">
        <thead className="bg-info">
          <tr className="text-black">
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Address</th>
            <th>Employee Pancard Number</th>
            <th>Employee Account Number</th>
            <th>Employee PF Number</th>
            <th>Role</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employeeId}</td>
              <td>{employee.employeeName}</td>
              <td>{employee.employeeAddress}</td>
              <td>{employee.employee_Pancard_Number}</td>
              <td>{employee.employee_Account_Number}</td>
              <td>{employee.employee_PF_Number}</td>
              <td>{employee.role}</td>
              {/* <td>
              <button onClick={()=>editClick(employee)} className='btn btn-info m-2' data-toggle='modal'data-target="#editModal">Edit</button>
              <button onClick={()=>deleteClick(employee.employeeId)} className='btn btn-danger m-2'>Delete</button>
              <button className='btn btn-primary m-2' value={employeeForm.employeeId} data-target="#leaveModal" data-toggle="modal">Leave</button>
              <button className='btn btn-secondary m-2' onClick={()=>setSpecificLeaveList(employee.employeeId)} value={employee.employeeId} data-target="#specificleaveModal" data-toggle="modal">Leave status</button>
              
            </td>  */}
            </tr>
          ))}
        </tbody>
      </table>
  
        </div>
    );
}

export default EmployeeDetail