import React from 'react';

const SearchFilter = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search todos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search Todos"
      />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        aria-label="Filter Todos"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
};

export default SearchFilter;
