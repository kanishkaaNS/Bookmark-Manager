import { Pin, MoreVertical, Archive, Edit, Trash2, Link as LinkIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BookmarkCard = ({ 
  bookmark, 
  onPin, 
  onEdit, 
  onDelete, 
  onArchive,
  onCardClick,
  onVisit
}) => {
  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
  };

  const handleVisit = (e) => {
    e.stopPropagation();
    onVisit(bookmark.id);
    window.open(bookmark.url, '_blank');
  };

  return (
    <div 
      className="group relative bg-card rounded-xl p-4 shadow-card hover:shadow-hover transition-smooth cursor-pointer animate-scale-in border border-border"
      onClick={() => onCardClick(bookmark)}
    >
      {/* Pin & Menu */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 transition-smooth ${
            bookmark.pinned 
              ? "text-accent hover:text-accent/80" 
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onPin(bookmark.id);
          }}
        >
          <Pin className={`h-4 w-4 ${bookmark.pinned ? "fill-current" : ""}`} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(bookmark); }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyLink(); }}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(bookmark.id); }}>
              <Archive className="mr-2 h-4 w-4" />
              {bookmark.archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(bookmark.id); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="space-y-3 pr-16">
        {/* Favicon & Title */}
        <div className="flex items-start gap-3">
          {getFavicon(bookmark.url) && (
                  <img 
                    src={getFavicon(bookmark.url)} 
                    alt=""
                    className="w-10 h-10 rounded-lg shadow-sm shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {bookmark.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {bookmark.url}
            </p>
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>{bookmark.visitCount || 0} visits</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-accent hover:text-accent/80 hover:bg-accent/10"
            onClick={handleVisit}
          >
            Visit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
