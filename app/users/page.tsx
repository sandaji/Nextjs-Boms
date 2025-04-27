"use client";

import { useGetUsersQuery } from "../../state/api";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Loading from "../(components)/Loading";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
];

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();

  if (isLoading) {
    return (
      <div className="py-4 text-slate-900 dark:text-slate-100">
        <Loading />
      </div>
    );
  }

  if (isError || !users) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 py-4">
        Failed to fetch users
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6 bg-slate-200 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen">
      <Header name="Users" />
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        className="shadow rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 transition-colors duration-300 mt-6"
        sx={{
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgb(226, 232, 240)", // slate-200
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgb(224, 231, 255)", // indigo-100
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgb(241, 245, 249)", // slate-100
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgb(203, 213, 225)", // slate-300
          },
          "& .MuiCheckbox-root": {
            color: "rgb(79, 70, 229)", // indigo-600
          },
          "@media (prefers-color-scheme: dark)": {
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgb(71, 85, 105)", // slate-700
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "rgb(30, 27, 75)", // indigo-900
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgb(30, 41, 59)", // slate-800
            },
            "& .MuiDataGrid-cell": {
              borderColor: "rgb(100, 116, 139)", // slate-600
            },
            "& .MuiCheckbox-root": {
              color: "rgb(165, 180, 252)", // indigo-300
            },
          },
        }}
      />
    </div>
  );
};

export default Users;
