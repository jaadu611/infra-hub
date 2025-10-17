"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const documents = [
  {
    id: "doc_1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    updated: "2024-03-15",
  },
  {
    id: "doc_2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    updated: "2024-03-14",
  },
  {
    id: "doc_3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    updated: "2024-03-13",
  },
  {
    id: "doc_4",
    name: "Alice Williams",
    email: "alice@example.com",
    status: "active",
    updated: "2024-03-12",
  },
  {
    id: "doc_5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    status: "pending",
    updated: "2024-03-11",
  },
];

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage your collection documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-elegant">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">{doc.id}</TableCell>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(doc.status)}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(doc.updated).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/documents/${doc.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-indigo-400/40!"
                    >
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Documents;
