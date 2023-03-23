// //New Data Table
// //Datatable
// const columns=[
//     {
//       name:<h5 className="text-success bg-secondry">Employee Id</h5>,
//       selector:"employeeId",
//       sortable:true,
//       style:{
//         fontSize:"20px",
//         fontWeight:"bold"
//       }
//     },
//     {
//       name:<h5 className="text-success">Employee Name</h5>,
//       selector:"employeeName",
//       sortable:true,
//       style:{
//         fontSize:"20px",
//         fontWeight:"bold"
//       }
//     },
//     {
//       name:<h5 className="text-success">Employee Address</h5>,
//       selector:"employeeAddress",
//       sortable:"true",
//       style:{
//         fontStyle:"20px",
//         fontWeight:"bold"
//       }
//     },
//     {
//       name:<h4 className="text-success">Employee Account No.</h4>,
//       selector:"employee_Account_Number",
//       sortable:"true",
//       style:{
//         fontSize:"20px",
//         fontWeight:"bold"
//       }
//     },
//     {
//       name:<h4 className="text-success">Employee PF No.</h4>,
//       selector:"employee_PF_Number",
//       sortable:"true",
//       style:{
//         fontSize:"20px",
//         fontWeight:"bold"
//       }
//     },
//     {
//       name:<h4 className="text-success">Employee Role</h4>,
//       selector:"role",
//       sortable:"true",
//       style:{
//         fontSize:"20px",
//         fontWeight:"bold"
//       }
//     },
//     {
//       name:<h4 className="text-success">Actions</h4>,
//       cell:(row)=>{
//         <div className="col-12">
//           <button
//               onClick={() => editClick(row.employee)}
//               className="btn btn-info m-2 btn-sm"
//               data-toggle="modal"
//               data-target="#editModal"
//             >
//               Edit
//             </button>

//             <button
//               className="btn btn-primary m-2 btn-sm"
//               value={row.employeeForm.employeeId}
//               data-target="#leaveModal"
//               data-toggle="modal"
//             >
//               Leave
//             </button>
//             <button
//               className="btn btn-secondary m-2 btn-sm"
//               onClick={() =>
//                 getSpecificEmployeeLeaves(row.employee.employeeId)
//               }
//               value={row.employee.employeeId}
//               data-target="#specificleaveModal"
//               data-toggle="modal"
//             >
//               Leave status
//             </button>
//         </div>
//       }
//     }
//   ]
//   const data=employeeList?employeeList.map((item)=>({...item})):[]
//   console.log(data)

//   return (
// <div>
//   <div className="row">
//     <div className="col-4 offset-4">
//       <h2 className="text-secondry">Employee Details</h2>
//     </div>
//   </div>
  

//   <DataTable className="table table-bordered table-striped table-active table-hover">
//   columns={columns}
//   data={data}
//   pagination={true}
//   paginationPerPage={10}
//   paginationRowsPerPageOptions={[10, 20, 30]}
//   highlightOnHover={true}
//   </DataTable>


/////////Old Data Table
// ****************************************OLD**************************

// return (
// <div>
//   <div className="row">
//     <div className="col-4 offset-4">
//       <h2 className="text-secondry">Employee Details</h2>
//     </div>
//   </div>
//   <table className="table table-borderd table-striped table-active table-hover">
//     <thead className="bg-light">
//       <tr className="text-black">
//         <th>Employee ID</th>
//         <th>Employee Name</th>
//         <th>Employee Address</th>
//         <th>Employee Pancard Number</th>
//         <th>Employee Account Number</th>
//         <th>Employee PF Number</th>
//         <th>Role</th>
//         <th>Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {employeeList?.map((employee, index) => (
//         <tr key={index}>
//           <td>{employee.employeeId}</td>
//           <td>{employee.employeeName}</td>
//           <td>{employee.employeeAddress}</td>
//           <td>{employee.employee_Pancard_Number}</td>
//           <td>{employee.employee_Account_Number}</td>
//           <td>{employee.employee_PF_Number}</td>
//           <td>{employee.role}</td>
//           <td>
//             <button
//               onClick={() => editClick(employee)}
//               className="btn btn-info m-2 btn-sm"
//               data-toggle="modal"
//               data-target="#editModal"
//             >
//               Edit
//             </button>

//             <button
//               className="btn btn-primary m-2 btn-sm"
//               value={employeeForm.employeeId}
//               data-target="#leaveModal"
//               data-toggle="modal"
//             >
//               Leave
//             </button>
//             <button
//               className="btn btn-secondary m-2 btn-sm"
//               onClick={() =>
//                 getSpecificEmployeeLeaves(employee.employeeId)
//               }
//               value={employee.employeeId}
//               data-target="#specificleaveModal"
//               data-toggle="modal"
//             >
//               Leave status
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>