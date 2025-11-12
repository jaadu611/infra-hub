"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onFinish: (data: {
    projectName: string;
    description: string;
    email: string;
    mongoUrl: string;
    authJsSecret?: string;
  }) => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  userEmail,
  onFinish,
}: NewProjectModalProps) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState<string | undefined>(userEmail);
  const [mongoUrl, setMongoUrl] = useState("");
  const [authJsSecret, setAuthJsSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userEmail && !email) setEmail(userEmail);
  }, [userEmail, email]);

  const handleNext = () => {
    if (step === 1) {
      if (!projectName.trim()) {
        toast.error("Project name is required");
        return;
      }
      if (!description.trim()) {
        toast.error("Project description is required");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!email?.trim()) {
        toast.error("Please enter your email");
        return;
      }

      if (!mongoUrl.trim()) {
        toast.error("MongoDB URL is required");
        return;
      }

      setIsLoading(true);

      try {
        onFinish({
          projectName,
          description: description.trim(),
          email: email.trim(),
          mongoUrl: mongoUrl.trim(),
          authJsSecret: authJsSecret?.trim() || undefined,
        });

        setStep(1);
        setProjectName("");
        setDescription("");
        setMongoUrl("");
        setAuthJsSecret("");
        onClose();
      } catch (err) {
        console.error("Error creating project:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to create project"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isLoading) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1
              ? "Create New Project"
              : "MongoDB and Auth Setup (Optional)"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {step === 1 && (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Project Name</label>
                <Input
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Project Description (Required)
                </label>
                <Textarea
                  placeholder="Add a short description about your project"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be added to the initial README file.
                </p>
              </div>

              <div className="flex flex-col mt-2">
                <label className="text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">MongoDB URL</label>
                <Input
                  placeholder="mongodb+srv://..."
                  value={mongoUrl}
                  onChange={(e) => setMongoUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col mt-2">
                <label className="text-sm font-medium mb-1">
                  Auth JS Secret (Optional)
                </label>
                <Input
                  placeholder="Your Auth JS secret"
                  value={authJsSecret}
                  onChange={(e) => setAuthJsSecret(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can leave this blank if not needed.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
            disabled={isLoading}
          >
            Cancel
          </Button>

          {step === 2 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="mr-2"
              disabled={isLoading}
            >
              Back
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={
              isLoading ||
              (step === 1 && !projectName.trim()) ||
              (step === 2 && (!mongoUrl.trim() || !email))
            }
          >
            {isLoading ? "Creating..." : step === 1 ? "Next" : "Finish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
