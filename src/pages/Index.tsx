import { useState, useEffect, useMemo } from "react";
import { Filter, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BookmarkCard from "@/components/BookmarkCard";
import BookmarkForm from "@/components/BookmarkForm";
import ConfirmDialog from "@/components/ConfirmDialog";

const Index = () => {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; bookmarkId: string | null; action?: string }>({ 
    isOpen: false, 
    bookmarkId: null 
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Load bookmarks and theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    } else {
      // Add sample bookmarks if none exist
      const sampleBookmarks = [
        {
          id: "1",
          title: "GitHub",
          url: "https://github.com",
          description: "The world's leading software development platform. Host and review code, manage projects, and build software.",
          tags: ["development", "coding", "git"],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: true,
          archived: false,
          visitCount: 42,
          lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          title: "Stack Overflow",
          url: "https://stackoverflow.com",
          description: "The largest online community for programmers to learn, share their knowledge, and build their careers.",
          tags: ["development", "programming", "help"],
          createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: true,
          archived: false,
          visitCount: 35,
          lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          title: "Figma",
          url: "https://figma.com",
          description: "A collaborative interface design tool for creating beautiful UI/UX designs and prototypes.",
          tags: ["design", "ui", "collaboration"],
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 28,
          lastVisited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          title: "MDN Web Docs",
          url: "https://developer.mozilla.org",
          description: "Comprehensive resources for web developers, including documentation for HTML, CSS, and JavaScript.",
          tags: ["documentation", "web", "learning"],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 19,
          lastVisited: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "5",
          title: "Dribbble",
          url: "https://dribbble.com",
          description: "Discover the world's top designers and creative professionals showcasing their work.",
          tags: ["design", "inspiration", "portfolio"],
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 15,
          lastVisited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "6",
          title: "CSS-Tricks",
          url: "https://css-tricks.com",
          description: "Daily articles about CSS, HTML, JavaScript, and all things related to web design and development.",
          tags: ["css", "web", "tutorial"],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 12,
          lastVisited: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "7",
          title: "Dev.to",
          url: "https://dev.to",
          description: "A community of software developers getting together to help one another out.",
          tags: ["development", "community", "blog"],
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 8,
          lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "8",
          title: "Tailwind CSS",
          url: "https://tailwindcss.com",
          description: "A utility-first CSS framework for rapidly building custom user interfaces.",
          tags: ["css", "framework", "documentation"],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 22,
          lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "9",
          title: "CodePen",
          url: "https://codepen.io",
          description: "An online code editor and front-end web development playground to showcase and experiment with code.",
          tags: ["coding", "playground", "inspiration"],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 17,
          lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "10",
          title: "Product Hunt",
          url: "https://producthunt.com",
          description: "Discover the latest mobile apps, websites, and technology products that everyone's talking about.",
          tags: ["products", "startup", "inspiration"],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          pinned: false,
          archived: false,
          visitCount: 6,
          lastVisited: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setBookmarks(sampleBookmarks);
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    bookmarks.forEach((bookmark) => {
      if (bookmark.tags) {
        bookmark.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [bookmarks]);

  // Toggle tag filter
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks.filter((bookmark) => !bookmark.archived);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((bookmark) =>
        bookmark.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "visited":
          return new Date(b.lastVisited || 0).getTime() - new Date(a.lastVisited || 0).getTime();
        case "popular":
          return (b.visitCount || 0) - (a.visitCount || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [bookmarks, searchTerm, selectedTags, sortBy]);

  // Filter archived bookmarks
  const archivedBookmarks = useMemo(() => {
    let filtered = bookmarks.filter((bookmark) => bookmark.archived);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((bookmark) =>
        bookmark.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "visited":
          return new Date(b.lastVisited || 0).getTime() - new Date(a.lastVisited || 0).getTime();
        case "popular":
          return (b.visitCount || 0) - (a.visitCount || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [bookmarks, searchTerm, selectedTags, sortBy]);

  // Separate pinned and unpinned bookmarks
  const pinnedBookmarks = useMemo(() => {
    return filteredBookmarks.filter((bookmark) => bookmark.pinned);
  }, [filteredBookmarks]);

  const unpinnedBookmarks = useMemo(() => {
    return filteredBookmarks.filter((bookmark) => !bookmark.pinned);
  }, [filteredBookmarks]);

  // Add or update bookmark
  const handleSubmitBookmark = (formData) => {
    if (editingBookmark) {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === editingBookmark.id
            ? { ...b, ...formData, updatedAt: new Date().toISOString() }
            : b
        )
      );
      toast({
        title: "Bookmark updated",
        description: "Your changes have been saved.",
      });
    } else {
      const newBookmark = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        pinned: false,
        archived: false,
        visitCount: 0,
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved.",
      });
    }
    setIsFormOpen(false);
    setEditingBookmark(null);
  };

  // Pin/unpin bookmark
  const handlePin = (id) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    
    if (bookmark.pinned) {
      // Show confirmation when unpinning
      setConfirmDialog({ 
        isOpen: true, 
        bookmarkId: id,
        action: "unpin"
      });
    } else {
      // Pin directly without confirmation
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, pinned: true } : b))
      );
      toast({
        title: "Bookmark pinned",
        description: "This bookmark will appear at the top.",
      });
    }
  };

  // Archive/unarchive bookmark
  const handleArchive = (id) => {
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, archived: !b.archived } : b
      )
    );
    const bookmark = bookmarks.find((b) => b.id === id);
    toast({
      title: bookmark.archived ? "Bookmark unarchived" : "Bookmark archived",
      description: bookmark.archived
        ? "Bookmark restored to main view."
        : "Bookmark moved to archive.",
    });
  };

  // Delete bookmark
  const handleDelete = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    toast({
      title: "Bookmark deleted",
      description: "The bookmark has been removed.",
      variant: "destructive",
    });
  };

  // Track visit
  const handleVisit = (id) => {
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              visitCount: (b.visitCount || 0) + 1,
              lastVisited: new Date().toISOString(),
            }
          : b
      )
    );
  };

  // Handle card click
  const handleCardClick = (bookmark) => {
    setSelectedBookmark(bookmark);
    setIsSidebarOpen(true);
  };

  // Confirm dialog action
  const handleConfirmAction = () => {
    if (confirmDialog.action === "unpin") {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === confirmDialog.bookmarkId ? { ...b, pinned: false } : b
        )
      );
      toast({
        title: "Bookmark unpinned",
      });
    }
    setConfirmDialog({ isOpen: false, bookmarkId: null, action: null });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => {
          setEditingBookmark(null);
          setIsFormOpen(true);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {showArchived 
                ? "Archived Bookmarks"
                : selectedTags.length > 0
                ? `Filtered by: ${selectedTags.join(", ")}`
                : "All Bookmarks"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {showArchived 
                ? `${archivedBookmarks.length} archived bookmark${archivedBookmarks.length !== 1 ? "s" : ""}`
                : `${filteredBookmarks.length} bookmark${filteredBookmarks.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={showArchived ? "default" : "outline"}
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? "Show Active" : "Show Archived"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBookmark(null);
                setIsSidebarOpen(!isSidebarOpen);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Bookmarks Grid */}
        {showArchived ? (
          // Show archived bookmarks
          archivedBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
                <Archive className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No archived bookmarks</h3>
              <p className="text-muted-foreground mb-6">
                Archived bookmarks will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onPin={handlePin}
                  onEdit={(bookmark) => {
                    setEditingBookmark(bookmark);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                  onCardClick={handleCardClick}
                  onVisit={handleVisit}
                />
              ))}
            </div>
          )
        ) : filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your filters"
                : "Start by adding your first bookmark"}
            </p>
            {!searchTerm && selectedTags.length === 0 && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gradient-accent hover:opacity-90"
              >
                Add Your First Bookmark
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Pinned Bookmarks Section */}
            {pinnedBookmarks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Pinned Bookmarks</h3>
                  <span className="text-sm text-muted-foreground">({pinnedBookmarks.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onPin={handlePin}
                      onEdit={(bookmark) => {
                        setEditingBookmark(bookmark);
                        setIsFormOpen(true);
                      }}
                      onDelete={handleDelete}
                      onArchive={handleArchive}
                      onCardClick={handleCardClick}
                      onVisit={handleVisit}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Bookmarks Section */}
            {unpinnedBookmarks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {pinnedBookmarks.length > 0 ? "All Bookmarks" : "Bookmarks"}
                  </h3>
                  <span className="text-sm text-muted-foreground">({unpinnedBookmarks.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unpinnedBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onPin={handlePin}
                      onEdit={(bookmark) => {
                        setEditingBookmark(bookmark);
                        setIsFormOpen(true);
                      }}
                      onDelete={handleDelete}
                      onArchive={handleArchive}
                      onCardClick={handleCardClick}
                      onVisit={handleVisit}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsSidebarOpen(false);
              setSelectedBookmark(null);
            }}
          />
          <Sidebar
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            selectedBookmark={selectedBookmark}
            onClose={() => {
              setIsSidebarOpen(false);
              setSelectedBookmark(null);
            }}
          />
        </>
      )}

      {/* Bookmark Form */}
      <BookmarkForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBookmark(null);
        }}
        onSubmit={handleSubmitBookmark}
        bookmark={editingBookmark}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, bookmarkId: null })}
        onConfirm={handleConfirmAction}
        title="Unpin Bookmark?"
        description="Are you sure you want to unpin this bookmark? It will be moved back to the regular list."
      />
    </div>
  );
};

export default Index;
