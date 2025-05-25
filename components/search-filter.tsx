"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function SearchFilter({
  onSearch,
  onCategoryChange,
  categories,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* ✅ Input Search */}
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Search UMKMs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value); // ✅ Search real-time saat ketik
          }}
          className="w-full"
        />
      </div>

      {/* ✅ Select Filter by Category */}
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* <Button onClick={() => onSearch(searchQuery)}>Search</Button> */}
    </div>
  );
}
