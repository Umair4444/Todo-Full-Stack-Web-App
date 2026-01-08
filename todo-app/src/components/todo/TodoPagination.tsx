// Todo pagination component
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TODO_ITEMS_PER_PAGE } from '@/lib/constants';

interface TodoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
}

export const TodoPagination: React.FC<TodoPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSize,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range if it's too close to the edges
      if (end - start < maxVisiblePages - 3) {
        if (currentPage < maxVisiblePages - 2) {
          end = maxVisiblePages - 2;
        } else if (currentPage > totalPages - (maxVisiblePages - 2)) {
          start = totalPages - (maxVisiblePages - 3);
        }
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
        <strong>
          {Math.min(currentPage * pageSize, TODO_ITEMS_PER_PAGE * totalPages)}
        </strong>{' '}
        of <strong>{TODO_ITEMS_PER_PAGE * totalPages}</strong> results
      </div>
      
      <div className="flex items-center gap-2">
        <Select 
          value={pageSize.toString()} 
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5/page</SelectItem>
            <SelectItem value="10">10/page</SelectItem>
            <SelectItem value="20">20/page</SelectItem>
            <SelectItem value="50">50/page</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === -1 ? (
                <span className="px-2 py-1 text-sm">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className="w-9 h-9 p-0"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};