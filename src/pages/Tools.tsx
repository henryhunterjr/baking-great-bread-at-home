
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toolsData } from '@/components/home/toolsData';
import ToolCard from '@/components/home/ToolCard';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 6;

const Tools = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState(toolsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading state for better UX
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter tools based on search term
    if (searchTerm.trim() === '') {
      setFilteredTools(toolsData);
    } else {
      const filtered = toolsData.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTools(filtered);
    }
    
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredTools.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber: number) => {
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(pageNumber);
  };
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = isMobile ? 3 : 5;
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if there are fewer than the max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range around current page
      let startPage = Math.max(2, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 3);
      
      // Adjust if at the beginning or end
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-12 pb-6 md:pt-24 md:pb-12 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Button asChild variant="ghost" className="mb-2 md:mb-3 -ml-2 h-8 md:h-10">
              <Link to="/" className="group">
                <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs md:text-base">Back to Home</span>
              </Link>
            </Button>
            
            <h1 className="font-serif text-2xl md:text-3xl lg:text-5xl font-medium mb-1 md:mb-4">Baking Tools</h1>
            <p className="text-sm md:text-base lg:text-xl text-muted-foreground mb-4 md:mb-6 max-w-3xl">
              Free tools, calculators and resources to help you on your baking journey
            </p>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-sm md:text-base transition-all duration-300 focus:ring-2"
              />
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-16">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-col h-full animate-fade-in opacity-0" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="rounded-lg overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                    </div>
                    <div className="mt-3">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <Skeleton className="h-9 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-10 animate-fade-in">
                <p className="text-muted-foreground mb-3">No tools found matching your search.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 hover-scale"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-16">
                  {currentItems.map((tool, index) => (
                    <div key={tool.id} className="h-full">
                      <ToolCard tool={tool} animationDelay={index * 100} />
                    </div>
                  ))}
                </div>
                
                {filteredTools.length > ITEMS_PER_PAGE && (
                  <Pagination className="my-6">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="hover-scale transition-all duration-300"
                          />
                        </PaginationItem>
                      )}
                      
                      {getPageNumbers().map((page, index) => {
                        if (page === "ellipsis-start" || page === "ellipsis-end") {
                          return (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={`page-${page}`}>
                            <PaginationLink 
                              onClick={() => handlePageChange(page as number)}
                              isActive={page === currentPage}
                              className={`transition-all duration-300 hover-scale ${
                                page === currentPage ? "bg-bread-800 text-white hover:bg-bread-900" : ""
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            className="hover-scale transition-all duration-300"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;
