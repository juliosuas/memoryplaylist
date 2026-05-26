import { useState, useRef, useEffect } from "react";
import { Search, X, Music, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ARTISTS, SONGS } from "@/data/tracks";

interface Tag {
  type: "artist" | "song";
  value: string;
  label: string;
}

interface ArtistSearchProps {
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (value: string) => void;
}

export const ArtistSearch = ({
  selectedTags,
  onAddTag,
  onRemoveTag,
}: ArtistSearchProps) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = query.trim()
    ? [
        ...ARTISTS.filter((a) =>
          a.toLowerCase().includes(query.toLowerCase())
        )
          .slice(0, 4)
          .map((a) => ({ type: "artist" as const, value: a, label: a })),
        ...SONGS.filter((s) =>
          s.label.toLowerCase().includes(query.toLowerCase())
        )
          .slice(0, 4)
          .map((s) => ({ type: "song" as const, value: s.value, label: s.label })),
      ].slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0 && suggestions[focusedIndex]) {
      e.preventDefault();
      handleSelect(suggestions[focusedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion: Tag) => {
    if (!selectedTags.find((t) => t.value === suggestion.value)) {
      onAddTag(suggestion);
    }
    setQuery("");
    setShowSuggestions(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <Badge
              key={tag.value}
              variant="secondary"
              className={cn(
                "gap-2 px-3 py-1.5 text-sm font-medium",
                "bg-primary/10 text-primary hover:bg-primary/20 border-0",
                "animate-scale-in"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {tag.type === "artist" ? (
                <User className="w-3 h-3" />
              ) : (
                <Music className="w-3 h-3" />
              )}
              {tag.label}
              <button
                type="button"
                onClick={() => onRemoveTag(tag.value)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Busca artistas o canciones que recuerdes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 h-12 rounded-xl border-border bg-card"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 py-2 bg-card border border-border rounded-xl shadow-lg animate-fade-up overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  focusedIndex === index
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    suggestion.type === "artist"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {suggestion.type === "artist" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Music className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{suggestion.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.type === "artist" ? "Artista" : "Canción"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
