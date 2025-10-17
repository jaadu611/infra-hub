// import { getAllUsers, UserType } from "@/lib/db";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, Plus, MoreVertical } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default async function UserManagement({
//   searchParams,
// }: {
//   searchParams?: { q?: string };
// }) {
//   const searchQuery = searchParams?.q ?? "";
//   const users = await getAllUsers();

//   const filteredUsers = users.filter(
//     ({ user: { name, email } }: { user: { name: string; email: string } }) =>
//       name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       email.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "bg-purple-500/10 text-purple-500 border-purple-500/20";
//       case "editor":
//         return "bg-blue-500/10 text-blue-500 border-blue-500/20";
//       case "viewer":
//         return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//       default:
//         return "bg-muted text-muted-foreground";
//     }
//   };

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();

//   return (
//     <div className="p-8 space-y-8 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
//           <p className="text-muted-foreground mt-2">
//             Manage user access and permissions
//           </p>
//         </div>
//         <Button
//           className="bg-gradient-primary hover:opacity-90 text-white transition-opacity"
//           style={{ background: "var(--gradient-primary)" }}
//         >
//           <Plus className="h-4 w-4" />
//           Invite User
//         </Button>
//       </div>

//       {/* SSR search form */}
//       <form method="GET" className="relative flex items-center">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         <Input
//           name="q"
//           defaultValue={searchQuery}
//           placeholder="Search users..."
//           className="pl-10"
//         />
//         <Button
//           type="submit"
//           className="ml-2 text-white bg-gradient-primary hover:opacity-90 transition-opacity"
//           style={{ background: "var(--gradient-primary)" }}
//         >
//           Search
//         </Button>
//       </form>

//       <div className="rounded-lg border bg-card shadow-elegant">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>User</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Project</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredUsers.map((user: UserType) => (
//               <TableRow key={user._id} className="hover:bg-muted/50">
//                 <TableCell className="p-4">
//                   <div className="flex items-center gap-3">
//                     <Avatar>
//                       <AvatarFallback
//                         className="bg-gradient-primary text-white text-xs"
//                         style={{ background: "var(--gradient-primary)" }}
//                       >
//                         {getInitials(user.name)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="font-medium">{user.name}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>
//                   {user.projects && user.projects.length > 0 ? (
//                     <div className="flex flex-wrap gap-1">
//                       {user.projects.map(
//                         (project: { name: string; _id: string }) => (
//                           <Badge
//                             key={project._id}
//                             variant="outline"
//                             className="bg-blue-100 text-blue-700 border-blue-200"
//                           >
//                             {project.name}
//                           </Badge>
//                         )
//                       )}
//                     </div>
//                   ) : (
//                     <span className="text-muted-foreground">No Project</span>
//                   )}
//                 </TableCell>

//                 <TableCell>
//                   <Badge variant="outline" className={getRoleColor(user.role)}>
//                     {user.role}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="hover:bg-indigo-400/40!"
//                       >
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="bg-popover">
//                       <DropdownMenuItem>Edit Role</DropdownMenuItem>
//                       <DropdownMenuItem>View Activity</DropdownMenuItem>
//                       <DropdownMenuItem>Reset Password</DropdownMenuItem>
//                       <DropdownMenuItem className="text-destructive">
//                         Remove User
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
