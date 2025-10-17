import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Database, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getDatabaseStats } from "@/lib/db";

export default async function DatabaseSettings() {
  const stats = await getDatabaseStats();

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your database configuration
        </p>
      </div>

      <div className="grid gap-6">
        {/* Collections Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>
              Create and manage database collections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-primary hover:opacity-90 text-white p-6 transition-opacity"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-popover">
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                  <DialogDescription>
                    Add a new collection to your database
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="collectionName">Collection Name</Label>
                    <Input
                      id="collectionName"
                      placeholder="e.g., users, products, orders"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schema">Schema (Optional)</Label>
                    <Textarea
                      id="schema"
                      placeholder="Define your collection schema in JSON format"
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Database Info Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
            <CardDescription>
              View your database statistics and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{stats.totalDocuments}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  API Requests Today
                </p>
                <p className="text-2xl font-bold">{stats.apiRequestsToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Export Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Backup & Export</CardTitle>
            <CardDescription>Download your database backup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Last backup: Not available
            </p>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Backup
              </Button>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
