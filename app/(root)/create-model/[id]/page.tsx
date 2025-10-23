/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Field {
  name: string;
  type: "String" | "Number" | "Boolean" | "Date" | "Mixed" | "ObjectId";
  required: boolean;
  unique?: boolean;
  default?: string | number | boolean | null;
  ref?: string;
  min?: number;
  max?: number;
}

const defaultField: Field = { name: "", type: "String", required: false };

interface CreateModelPageProps {
  params: Promise<{ id: string }>;
}

const CreateModelPage: React.FC<CreateModelPageProps> = ({ params }) => {
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id);
    };
    fetchParams();
  }, [params]);

  const [modelName, setModelName] = useState("");
  const [fields, setFields] = useState<Field[]>([defaultField]);
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Fetch existing models
  useEffect(() => {
    if (!projectId || projectId === "null") return;

    const fetchModels = async () => {
      try {
        const res = await fetch(`/api/models/${projectId}`);
        if (!res.ok) {
          console.error(
            `Failed to fetch models. Status: ${res.status} ${res.statusText}`
          );
          return;
        }
        const data = await res.json();
        setAvailableModels(data.models || []);
      } catch (err) {
        console.error("Error fetching models:", err);
      }
    };

    fetchModels();
  }, [projectId]);

  const handleAddField = () => setFields([...fields, { ...defaultField }]);
  const handleRemoveField = (index: number) =>
    setFields(fields.filter((_, i) => i !== index));
  const handleFieldChange = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K]
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const handleCreateModel = async () => {
    if (!modelName.trim()) {
      toast.error("Model name cannot be empty");
      return;
    }

    const schema: Record<string, any> = {};
    fields.forEach((f) => {
      if (!f.name.trim()) return;
      const type: any = f.type === "ObjectId" ? "ObjectId" : eval(f.type);
      const fieldObj: any = { type };
      if (f.required) fieldObj.required = true;
      if (f.unique) fieldObj.unique = true;
      if (f.default !== undefined) fieldObj.default = f.default;
      if (f.ref) fieldObj.ref = f.ref;
      if (f.min !== undefined) fieldObj.min = f.min;
      if (f.max !== undefined) fieldObj.max = f.max;
      schema[f.name] = fieldObj;
    });

    setLoading(true);
    try {
      const res = await fetch(`/api/models/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName: modelName.trim(), schema }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create model");
      }

      const data = await res.json();
      toast.success(data.message);

      setAvailableModels(data.models || []);

      setModelName("");
      setFields([defaultField]);
    } catch (err) {
      console.error("Error creating model:", err);
      toast.error((err as Error).message || "Failed to create model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Create a New Model
          </h1>
          <p className="text-purple-100 max-w-2xl">
            Define your model&apos;s fields and schema. You can add multiple
            fields, set types, and configure constraints like required or
            unique.
          </p>
        </div>
      </div>

      {/* Model Form */}
      <div className="grid gap-6 md:grid-cols-1 mx-auto">
        {/* Model Name Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Model Name
            </h2>
            <Input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </CardContent>
        </Card>

        {/* Fields */}
        {fields.map((field, idx) => (
          <Card
            key={idx}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Input
                  type="text"
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(idx, "name", e.target.value)
                  }
                  className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                />

                <Select
                  value={field.type}
                  onValueChange={(val) =>
                    handleFieldChange(idx, "type", val as Field["type"])
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Field Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "String",
                      "Number",
                      "Boolean",
                      "Date",
                      "Mixed",
                      "ObjectId",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.required}
                    onCheckedChange={(val) =>
                      handleFieldChange(idx, "required", val as boolean)
                    }
                  />
                  <span className="text-sm">Required</span>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.unique}
                    onCheckedChange={(val) =>
                      handleFieldChange(idx, "unique", val as boolean)
                    }
                  />
                  <span className="text-sm">Unique</span>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveField(idx)}
                  className="ml-auto flex items-center gap-2 bg-red-500! hover:bg-red-600! text-white shadow-lg rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* ObjectId Ref */}
              {field.type === "ObjectId" && availableModels.length > 0 && (
                <Select
                  value={field.ref || ""}
                  onValueChange={(val) => handleFieldChange(idx, "ref", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Reference Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 max-w-4xl mx-auto">
          <Button
            onClick={handleAddField}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-xl"
          >
            + Add Field
          </Button>
          <Button
            onClick={handleCreateModel}
            disabled={loading}
            className={`flex-1 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-xl"
            }`}
          >
            {loading ? "Creating..." : "Create Model"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateModelPage;
