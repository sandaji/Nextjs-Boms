"use client";

import React from "react";
import CreateUserModal from "./CreateUser";
import { useCreateUserMutation, useGetUsersQuery } from "../../state/api";
import Header from "../(components)/Header";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../(components)/Loading";
import { PlusCircleIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { userColumns } from "@/utils/UserColumns";

interface ToolbarProps {
  onAdd: () => void;
}

const Toolbar = ({ onAdd }: ToolbarProps) => (
  <div className="flex justify-between items-center mb-6">
    <Header name="Users" />
    <button
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      onClick={onAdd}
    >
      <PlusCircleIcon className="w-5 h-5" />
      Create User
    </button>
  </div>
);

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createUser] = useCreateUserMutation();

  const handleCreateUser = async (userData: { name: string; email: string }) => {
    await createUser(userData);
  };

  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => userColumns, []);

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
        Failed to fetch users. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6 bg-slate-200 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Toolbar */}
      <Toolbar onAdd={() => setIsModalOpen(true)} />

      {/* DataGrid */}
      <DataGrid
        rows={users}
        columns={memoizedColumns}
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

      {/* Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default React.memo(Users);