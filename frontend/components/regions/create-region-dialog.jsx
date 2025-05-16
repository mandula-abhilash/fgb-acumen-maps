"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { createCustomRegion } from "@/lib/api/regions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function CreateRegionDialog({
  open,
  onOpenChange,
  onRegionCreated,
  initialName = "",
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (open && initialName) {
      setFormData((prev) => ({ ...prev, name: initialName }));
    }
  }, [open, initialName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newRegion = await createCustomRegion(formData);
      toast({
        title: "Success",
        description: "Region created successfully",
      });
      onRegionCreated?.(newRegion);
      handleCloseDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to create region. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setFormData({ name: "", description: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Region</DialogTitle>
          <DialogDescription>Create a new custom region</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Region Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter region name"
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter region description"
                rows={3}
                disabled={isSaving}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSaving}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-web-orange hover:bg-web-orange/90 text-white w-full sm:w-auto order-1 sm:order-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Region"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
