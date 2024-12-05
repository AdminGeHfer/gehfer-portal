import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserListActions } from "./UserListActions";

interface UserListRowProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onResetPassword: (user: any) => void;
  onSendPasswordReset: (email: string) => void;
}

export function UserListRow({
  user,
  onEdit,
  onDelete,
  onResetPassword,
  onSendPasswordReset
}: UserListRowProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      default:
        return 'Usuário';
    }
  };

  return (
    <TableRow className="hover:bg-primary/5">
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {getRoleLabel(user.role)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {user.modules?.map((module: string) => (
            <Badge key={module} variant="secondary">
              {module}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.active ? "default" : "destructive"}>
          {user.active ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell>
        <UserListActions
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
          onSendPasswordReset={onSendPasswordReset}
        />
      </TableCell>
    </TableRow>
  );
}