import React from 'react'

export default function SearchBar() {
  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search F1 Grandstand..."
        className="w-full px-4 py-2 rounded-2xl border border-gray-300 shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 
                   text-gray-900 placeholder-gray-500"
      />
    </div>
  )
}