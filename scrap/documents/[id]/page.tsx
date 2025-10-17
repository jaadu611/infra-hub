// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { ArrowLeft, Save, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface DocumentDetailProps {
//   params: { id: string };
// }

// const DocumentDetail = ({ params }: DocumentDetailProps) => {
//   const { id } = params;
//   const router = useRouter();

//   const [documentData, setDocumentData] = useState(`{
//   "id": "${id}",
//   "name": "John Doe",
//   "email": "john@example.com",
//   "status": "active",
//   "created_at": "2024-01-15T10:30:00Z",
//   "updated_at": "2024-03-15T14:20:00Z",
//   "metadata": {
//     "subscription": "premium",
//     "verified": true
//   }
// }`);

//   const handleSave = () => {
//     console.log("Saving document:", documentData);
//   };

//   const handleDelete = () => {
//     console.log("Deleting document:", id);
//   };

//   return (
//     <div className="p-8 space-y-8 animate-fade-in">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Document Details
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Edit your document data
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <Button variant="destructive" onClick={handleDelete}>
//             <Trash2 className="h-4 w-4 mr-2" />
//             Delete
//           </Button>
//           <Button variant="default" onClick={handleSave}>
//             <Save className="h-4 w-4 mr-2" />
//             Save Changes
//           </Button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="md:col-span-2 shadow-elegant">
//           <CardHeader>
//             <CardTitle>JSON Editor</CardTitle>
//             <CardDescription>
//               Edit your document data in JSON format
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Textarea
//               value={documentData}
//               onChange={(e) => setDocumentData(e.target.value)}
//               className="font-mono text-sm min-h-[500px]"
//               placeholder="Enter JSON data..."
//             />
//           </CardContent>
//         </Card>

//         <Card className="shadow-elegant">
//           <CardHeader>
//             <CardTitle>Document Info</CardTitle>
//             <CardDescription>Metadata and properties</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <p className="text-sm text-muted-foreground">Document ID</p>
//               <p className="font-mono text-sm mt-1">{id}</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Collection</p>
//               <p className="font-medium mt-1">users</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Created</p>
//               <p className="text-sm mt-1">Jan 15, 2024</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Last Modified</p>
//               <p className="text-sm mt-1">Mar 15, 2024</p>
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Size</p>
//               <p className="text-sm mt-1">2.4 KB</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DocumentDetail;
