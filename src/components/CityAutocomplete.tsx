"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, X } from "lucide-react";

export interface CityOption {
  label: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  placeId: string;
}

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface Props {
  value: CityOption | null;
  onChange: (city: CityOption | null) => void;
  placeholder?: string;
  hasError?: boolean;
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "City, State",
  hasError = false,
}: Props) {
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync display value when parent clears or sets
  useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchPredictions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setPredictions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/places?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const data = await res.json();
        const preds: Prediction[] = data.predictions ?? [];
        setPredictions(preds);
        setOpen(preds.length > 0);
        setActiveIdx(-1);
      }
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(null); // clear confirmed selection while re-typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(val), 300);
  };

  const confirmSelection = async (pred: Prediction) => {
    const label = pred.description.replace(", USA", "");
    setOpen(false);
    setPredictions([]);
    setInputValue(label);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/geocode?placeId=${encodeURIComponent(pred.place_id)}`
      );
      if (res.ok) {
        const geo = await res.json();
        onChange({
          label,
          city: geo.city || pred.structured_formatting.main_text,
          state:
            geo.state ||
            pred.structured_formatting.secondary_text.replace(", USA", ""),
          lat: geo.lat ?? null,
          lng: geo.lng ?? null,
          placeId: pred.place_id,
        });
      } else {
        // Geocode failed — store without coords, still valid for submission
        onChange({
          label,
          city: pred.structured_formatting.main_text,
          state: pred.structured_formatting.secondary_text.replace(", USA", ""),
          lat: null,
          lng: null,
          placeId: pred.place_id,
        });
      }
    } catch {
      onChange({
        label,
        city: pred.structured_formatting.main_text,
        state: pred.structured_formatting.secondary_text.replace(", USA", ""),
        lat: null,
        lng: null,
        placeId: pred.place_id,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      confirmSelection(predictions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const clear = () => {
    setInputValue("");
    onChange(null);
    setPredictions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const isConfirmed = value !== null;

  return (
    <div ref={containerRef} className="relative">
      <div
        className={[
          "flex items-center rounded-md border bg-white transition-all",
          hasError
            ? "border-red-300 focus-within:ring-2 focus-within:ring-red-200"
            : isConfirmed
              ? "border-[#0A2540] focus-within:ring-2 focus-within:ring-[#C9A961]/30"
              : "border-slate-200 focus-within:border-[#0A2540] focus-within:ring-2 focus-within:ring-[#C9A961]/30",
        ].join(" ")}
      >
        <MapPin
          className={`ml-3 h-4 w-4 shrink-0 ${isConfirmed ? "text-[#C9A961]" : "text-slate-400"}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => predictions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
        />
        {loading && (
          <Loader2 className="mr-3 h-4 w-4 shrink-0 animate-spin text-slate-400" />
        )}
        {!loading && (inputValue || value) && (
          <button
            type="button"
            onClick={clear}
            className="mr-2 rounded p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && predictions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          {predictions.map((pred, i) => (
            <li
              key={pred.place_id}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault();
                confirmSelection(pred);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors ${
                i === activeIdx ? "bg-slate-50" : "hover:bg-slate-50"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              <span>
                <span className="font-medium text-[#0A2540]">
                  {pred.structured_formatting.main_text}
                </span>
                <span className="ml-1.5 text-slate-400">
                  {pred.structured_formatting.secondary_text.replace(
                    ", USA",
                    ""
                  )}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
