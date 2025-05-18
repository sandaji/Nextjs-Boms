import { GridColDef } from "@mui/x-data-grid";

// Define user columns using Material-UI's GridColDef interface
export const userColumns: GridColDef[] = [
  {
    field: "userId",
    headerName: "ID",
    width: 90,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    sortable: true,
    filterable: true,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
    sortable: true,
    filterable: true,
    headerAlign: "left",
    align: "left",
  },
  // Add more columns as needed
];