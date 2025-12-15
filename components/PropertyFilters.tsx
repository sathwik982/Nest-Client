"use client";

import { useEffect, useRef, useState } from "react";
import {
  SlidersHorizontal,
  Users,
  Bed,
  IndianRupee,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";


export interface Filters {
  city: string;
  area: string;
  gender: string;
  roomType: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterPillProps {
  label: string;
  icon: React.ElementType;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}


const FilterPill = ({
  label,
  icon: Icon,
  open,
  onToggle,
  children,
}: FilterPillProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between gap-3 px-4 py-2 rounded-full border text-sm font-medium transition
        ${
          open
            ? "border-brand ring-1 ring-brand/"
            : "border-border hover:border-brand/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span>{label}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-border rounded-xl shadow-xl z-50 p-4">
          {children}
        </div>
      )}
    </div>
  );
};

/* =======================
   MAIN COMPONENT
======================= */

export default function PropertyFilters({
  onChange,
}: {
  onChange: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    city: "",
    area: "",
    gender: "",
    roomType: "",
    minPrice: "",
    maxPrice: "",
  });

  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const update = (key: keyof Filters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  const clearAll = () => {
    const cleared = {
      city: "",
      area: "",
      gender: "",
      roomType: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(cleared);
    onChange(cleared);
    setOpen(null);
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div
      ref={ref}
      className="sticky top-0 z-40 bg-background border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        {/* LEFT HEADER */}
        <div className="flex items-center gap-2 pr-4 border-r border-border">
          <div className="p-2 bg-brand/10 rounded-lg">
            <SlidersHorizontal className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className="text-sm font-semibold">Filters</p>
            <p className="text-xs text-muted-foreground">
              Refine your search
            </p>
          </div>
          {activeCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-brand/20 text-brand rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        {/* GENDER */}
        <FilterPill
          label={
            filters.gender
              ? filters.gender.charAt(0).toUpperCase() +
                filters.gender.slice(1)
              : "Gender"
          }
          icon={Users}
          open={open === "gender"}
          onToggle={() => setOpen(open === "gender" ? null : "gender")}
        >
          {["boys", "girls", "unisex"].map((g) => (
            <button
              key={g}
              onClick={() => {
                update("gender", g);
                setOpen(null);
              }}
              className={`w-full px-3 py-2 rounded-lg text-left text-sm
                ${
                  filters.gender === g
                    ? "bg-brand/10 text-black"
                    : "hover:bg-accent text-black"
                }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
          <button
            onClick={() => {
              update("gender", "");
              setOpen(null);
            }}
            className="mt-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg text-left text-black"
          >
            Clear
          </button>
        </FilterPill>

        {/* ROOM TYPE */}
        <FilterPill
          label={
            filters.roomType
              ? filters.roomType.charAt(0).toUpperCase() +
                filters.roomType.slice(1)
              : "Occupancy"
          }
          icon={Bed}
          open={open === "roomType"}
          onToggle={() => setOpen(open === "roomType" ? null : "roomType")}
        >
          {["single", "double", "triple"].map((r) => (
            <button
              key={r}
              onClick={() => {
                update("roomType", r);
                setOpen(null);
              }}
              className={`w-full px-3 py-2 rounded-lg text-left text-sm text-black
                ${
                  filters.roomType === r
                    ? "bg-brand/10 text-brand"
                    : "hover:bg-accent"
                }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
          <button
            onClick={() => {
              update("roomType", "");
              setOpen(null);
            }}
            className="mt-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg text-left text-black"
          >
            Clear
          </button>
        </FilterPill>

        {/* BUDGET */}
        <FilterPill
          label={
            filters.minPrice || filters.maxPrice
              ? `₹${filters.minPrice || "0"} - ₹${
                  filters.maxPrice || "∞"
                }`
              : "Budget"
          }
          icon={IndianRupee}
          open={open === "budget"}
          onToggle={() => setOpen(open === "budget" ? null : "budget")}
        >
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg text-black"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg text-black"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setOpen(null)}
                className="flex-1 px-3 py-2 bg-brand text-white rounded-lg bg-black"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  update("minPrice", "");
                  update("maxPrice", "");
                  setOpen(null);
                }}
                className="flex-1 px-3 py-2 bg-accent rounded-lg bg-black"
              >
                Clear
              </button>
            </div>
          </div>
        </FilterPill>

        {/* RIGHT SECTION */}
        <div className="ml-auto flex items-center gap-4 pl-4 border-l border-border">
          {/* RESULT SUMMARY */}
          <div className="hidden lg:flex px-3 py-1.5 bg-accent rounded-full text-xs text-muted-foreground">
            Showing results
            {activeCount > 0 && (
              <span className="ml-1 text-brand font-semibold">
                • {activeCount} filter{activeCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* SORT */}
          <select className="hidden md:block px-3 py-2 border border-border rounded-full text-sm  bg-background">
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>



          {/* CLEAR */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
