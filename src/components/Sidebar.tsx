import { X, ExternalLink, Calendar, Eye, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Sidebar = ({ 
  allTags, 
  selectedTags, 
  onTagToggle, 
  selectedBookmark,
  onClose 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  return (
    <aside className="fixed top-0 right-0 h-full w-80 bg-card border-l shadow-2xl z-50 animate-slide-in-right">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedBookmark ? "Bookmark Details" : "Filters"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {selectedBookmark ? (
            /* Bookmark Detail View */
            <div className="p-4 space-y-4">
              {/* Favicon & Title */}
              <div className="flex items-start gap-3">
                {getFavicon(selectedBookmark.url) && (
                  <img 
                    src={getFavicon(selectedBookmark.url)} 
                    alt=""
                    className="w-12 h-12 rounded-lg shadow-card"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground break-words">
                    {selectedBookmark.title}
                  </h3>
                  <a 
                    href={selectedBookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline flex items-center gap-1 mt-1"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <Separator />

              {/* Description */}
              {selectedBookmark.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                  <p className="text-sm text-foreground">{selectedBookmark.description}</p>
                </div>
              )}

              {/* Tags */}
              {selectedBookmark.tags && selectedBookmark.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <TagIcon className="h-4 w-4" /> Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBookmark.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Metadata */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Added: {formatDate(selectedBookmark.createdAt)}</span>
                </div>
                {selectedBookmark.lastVisited && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last visited: {formatDate(selectedBookmark.lastVisited)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Visits: {selectedBookmark.visitCount || 0}</span>
                </div>
              </div>

              {/* Full URL */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">URL</h4>
                <p className="text-xs text-foreground break-all bg-muted p-2 rounded">
                  {selectedBookmark.url}
                </p>
              </div>
            </div>
          ) : (
            /* Tag Filters */
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <TagIcon className="h-4 w-4" /> Filter by Tags
              </h3>
              {allTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags available</p>
              ) : (
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-smooth ${
                        selectedTags.includes(tag)
                          ? "bg-accent text-accent-foreground font-medium"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              {selectedTags.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedTags.forEach(onTagToggle)}
                  className="w-full mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
};

export default Sidebar;
