"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  onSearch,
  value,
}: {
  onSearch?: (query: string) => void;
  value?: string;
}) {
  const [query, setQuery] = useState(value ?? "");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative flex w-full max-w-sm items-center mx-1">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
        <Search className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch();
        }}
        className="pl-9 pr-12"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      {query && (
        <Button
          variant="ghost"
          className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
          onClick={handleClear}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
