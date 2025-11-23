import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { Edit, Trash2, Plus } from "lucide-react";

// Data dummy untuk User
const usersData = [
  {
    id: 1,
    username: "johndoe",
    name: "John Doe",
    role: "Admin",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    username: "janesmith",
    name: "Jane Smith",
    role: "User",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    username: "bobjohnson",
    name: "Bob Johnson",
    role: "Moderator",
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    username: "alicebrown",
    name: "Alice Brown",
    role: "User",
    createdAt: "2024-01-14",
  },
  {
    id: 5,
    username: "charliewilson",
    name: "Charlie Wilson",
    role: "User",
    createdAt: "2024-01-11",
  },
];

export function UserPage() {
  const userColumns: Column<(typeof usersData)[0]>[] = [
    {
      key: "username",
      header: "Username",
      className: "font-medium",
    },
    {
      key: "name",
      header: "Name",
      className: "font-medium",
    },
    {
      key: "role",
      header: "Role",
      render: (value) => getRoleBadge(value),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (value) => new Date(value).toLocaleDateString("id-ID"),
    },
    {
      key: "actions",
      header: "Action",
      render: () => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const getRoleBadge = (role: string) => {
    const roleColors = {
      Admin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Moderator:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      User: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          roleColors[role as keyof typeof roleColors] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manajemen User
            </h1>
            <p className="text-muted-foreground">
              Kelola pengguna dan informasi akun mereka.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={userColumns}
        data={[]}
        title="Daftar User"
        totalCount={usersData.length}
        emptyMessage="Tidak ada user yang ditemukan."
      />
    </>
  );
}
