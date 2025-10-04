import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { performSemanticSearch, setQuery, clearSearch, fetchSearchSuggestions, clearSuggestions } from "../../store/slices/searchSlice";
import { Search, X, Loader2, Sparkles } from "lucide-react";

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);
  const { query, results, loading, totalResults, suggestions } = useAppSelector(state => state.search);
  
  const [inputValue, setInputValue] = useState(query);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (!inputValue.trim() || !token) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      dispatch(performSemanticSearch({ query: inputValue, token }));
      setShowResults(true);
      setShowSuggestions(false);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, token, dispatch]);

  // Fetch suggestions when typing
  useEffect(() => {
    if (inputValue.length >= 2 && token) {
      const suggestionTimer = setTimeout(() => {
        dispatch(fetchSearchSuggestions({ prefix: inputValue, token }));
        setShowSuggestions(true);
      }, 300);

      return () => clearTimeout(suggestionTimer);
    } else {
      dispatch(clearSuggestions());
      setShowSuggestions(false);
    }
  }, [inputValue, token, dispatch]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setInputValue('');
    dispatch(clearSearch());
    setShowResults(false);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (!value.trim()) {
      dispatch(clearSearch());
      setShowResults(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    if (token) {
      dispatch(performSemanticSearch({ query: suggestion, token }));
      setShowResults(true);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      youtube: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      twitter: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      article: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      note: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
            if (suggestions.length > 0 && inputValue.length >= 2) setShowSuggestions(true);
          }}
          placeholder="Search with AI..."
          className="w-full pl-10 pr-10 py-2.5 bg-muted border border-border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     text-foreground placeholder:text-muted-foreground
                     transition-all duration-200"
        />
        
        {(loading || inputValue) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {loading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : inputValue ? (
              <button
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* AI Search Badge */}
      {inputValue && (
        <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          <span>AI-powered semantic search</span>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && !showResults && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-xl">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-2 py-1">Suggestions</p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors text-sm text-foreground"
              >
                <Search className="w-4 h-4 inline mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-border sticky top-0 bg-card">
            <p className="text-sm text-muted-foreground">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
          
          <div className="divide-y divide-border">
            {results.map((result) => (
              <div
                key={result._id}
                className="p-4 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => {
                  // Handle result click - could navigate or open modal
                  setShowResults(false);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(result.relevanceScore * 100)}% match
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-foreground truncate mb-1">
                      {result.title || 'Untitled'}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.description}
                    </p>
                    
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.slice(0, 3).map((tag) => {
                          // Handle both object and string formats
                          const tagText = typeof tag === 'string' ? tag : tag.tag;
                          const tagId = typeof tag === 'string' ? tag : tag._id;
                          
                          return (
                            <span
                              key={tagId}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                            >
                              #{tagText}
                            </span>
                          );
                        })}
                        {result.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{result.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {result.link && (
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 text-primary hover:text-primary/80"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && !loading && inputValue && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-xl p-8 text-center">
          <div className="text-muted-foreground mb-2">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No results found</p>
            <p className="text-sm mt-1">Try different keywords or add more content</p>
          </div>
        </div>
      )}
    </div>
  );
}