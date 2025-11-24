import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BookmarkForm = ({ isOpen, onClose, onSubmit, bookmark }) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title || "",
        url: bookmark.url || "",
        description: bookmark.description || "",
        tags: bookmark.tags ? bookmark.tags.join(", ") : "",
      });
    } else {
      setFormData({
        title: "",
        url: "",
        description: "",
        tags: "",
      });
    }
  }, [bookmark, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tagsArray = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      ...formData,
      tags: tagsArray,
    });

    setFormData({
      title: "",
      url: "",
      description: "",
      tags: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{bookmark ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Bookmark"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this bookmark..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tech, design, inspiration (comma-separated)"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-accent hover:opacity-90">
              {bookmark ? "Update" : "Add"} Bookmark
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkForm;
