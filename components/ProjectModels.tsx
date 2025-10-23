"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Trash2,
  X,
  Database,
  Loader2,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ProjectModelsProps {
  projectId: string;
}

interface Field {
  name: string;
  type: string;
  ref?: string;
}

interface Model {
  _id: string;
  name: string;
}

const FIELD_TYPES = [
  { value: "String", label: "String", icon: "Aa" },
  { value: "Number", label: "Number", icon: "123" },
  { value: "Boolean", label: "Boolean", icon: "T/F" },
  { value: "Date", label: "Date", icon: "📅" },
  { value: "Mixed", label: "Mixed", icon: "⚡" },
  { value: "Reference", label: "Reference", icon: "🔗" }, // new reference type
];

const ProjectModels: React.FC<ProjectModelsProps> = ({ projectId }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modelName, setModelName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/models/${projectId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch models");
      setModels(data.models || []);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => setFields([...fields, { name: "", type: "String" }]);
  const removeField = (index: number) =>
    setFields(fields.filter((_, i) => i !== index));
  const updateField = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };
  const resetModal = () => {
    setModelName("");
    setFields([]);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelName.trim()) {
      alert("Please enter a model name");
      return;
    }
    if (fields.length === 0) {
      alert("Please add at least one field");
      return;
    }
    if (fields.some((f) => !f.name.trim())) {
      alert("All fields must have a name");
      return;
    }
    if (fields.some((f) => f.type === "Reference" && !f.ref)) {
      alert("Reference fields must select a model");
      return;
    }

    const schema: Record<string, { type: string; ref?: string }> = {};
    fields.forEach((f) => {
      if (f.type === "Reference") {
        schema[f.name] = { type: "ObjectId", ref: f.ref };
      } else {
        schema[f.name] = { type: f.type };
      }
    });

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/models/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName, schema }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create model");

      resetModal();
      fetchModels();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main card */}
      <Card className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-white border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30 pb-6">
          <div className="flex items-center pt-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Data Models
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Define and manage your database schemas
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center px-6"
            >
              <Plus className="w-4 h-4" />
              New Model
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Loading models...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
              <Button onClick={fetchModels} variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          ) : models.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {models.map((model) => (
                <Link
                  key={model._id}
                  href={`/model/${projectId}/${model.name}`}
                >
                  <div className="group relative overflow-hidden p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-purple-500 hover:shadow-xl cursor-pointer">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md group-hover:shadow-lg transition-shadow">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {model.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            ID: {model._id}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <Database className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
                No models yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-sm">
                Get started by creating your first data model to define your
                database structure
              </p>
              <Button
                onClick={() => setShowModal(true)}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First Model
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
              <button
                onClick={resetModal}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Create New Model
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Define your model schema with custom fields
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]"
            >
              {/* Model Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., User, Product, Order"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                />
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Fields ({fields.length})
                  </label>
                  <Button
                    type="button"
                    onClick={addField}
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Field
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No fields added yet. Click &quot;Add Field&quot; to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                      >
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Field name (e.g., email)"
                              value={field.name}
                              onChange={(e) =>
                                updateField(idx, "name", e.target.value)
                              }
                              disabled={isSubmitting}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                            />
                            {field.type === "Reference" ? (
                              <select
                                value={field.ref || ""}
                                onChange={(e) =>
                                  updateField(idx, "ref", e.target.value)
                                }
                                disabled={isSubmitting || models.length === 0}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 min-w-[130px]"
                              >
                                <option value="">Select a model</option>
                                {models.map((m) => (
                                  <option key={m._id} value={m.name}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <select
                                value={field.type}
                                onChange={(e) =>
                                  updateField(idx, "type", e.target.value)
                                }
                                disabled={isSubmitting}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 min-w-[130px]"
                              >
                                {FIELD_TYPES.filter(
                                  (t) => t.value !== "Reference"
                                ).map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                  </option>
                                ))}
                                <option value="Reference">🔗 Reference</option>
                              </select>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeField(idx)}
                          disabled={isSubmitting}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3 justify-end">
              <Button
                type="button"
                onClick={resetModal}
                disabled={isSubmitting}
                variant="outline"
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || !modelName.trim() || fields.length === 0
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> Create Model
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectModels;
