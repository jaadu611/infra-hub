"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Search, Plus, MoreVertical, FolderOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, Document, Project } from "@/context/UserProvider";

type Collection = {
  name: string;
  documents: Document[];
  createdAt?: string;
  size?: number;
};

const CollectionsPage = () => {
  const { user } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.projects) return;

    setLoading(true);
    try {
      const allCollections =
        user.projects.flatMap(
          (project: Project) =>
            project.documents?.map((doc) => ({
              name: doc.collection,
              documents:
                user.documents?.filter(
                  (d) => d.collection === doc.collection
                ) || [],
              createdAt: project.createdAt || new Date().toISOString(),
              size:
                user.documents?.filter((d) => d.collection === doc.collection)
                  .length || 0,
            })) || []
        ) || [];

      const uniqueCollections: Collection[] = Array.from(
        new Map(allCollections.map((c) => [c.name, c])).values()
      );

      setCollections(uniqueCollections);
    } catch (err) {
      console.error("Failed to load collections:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading your collections...</p>
      </div>
    );
  }

  // ✅ Empty fallback
  if (!loading && filteredCollections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-3" />
        <h2 className="text-xl font-semibold mb-2">No collections found</h2>
        <p className="text-muted-foreground mb-4">
          Create your first collection to get started.
        </p>
        <Button
          className="bg-gradient-primary text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4 mr-2" /> New Collection
        </Button>
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground mt-2">
            Manage your database collections
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:opacity-90 transition-opacity text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCollections.map((collection) => (
          <Card
            key={collection.name}
            className="hover:shadow-elegant transition-shadow group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Created{" "}
                      {new Date(
                        collection.createdAt as string
                      ).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 hover:bg-blue-400! transition-all duration-100 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documents</span>
                <span className="font-medium">
                  {collection.documents.length.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">
                  {(
                    collection.documents.reduce((acc, d) => acc + d.size, 0) /
                    1024
                  ).toFixed(2)}{" "}
                  KB
                </span>
              </div>
              <Link href={`/documents?collection=${collection.name}`}>
                <Button variant="outline" className="w-full mt-2">
                  View Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
