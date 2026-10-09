import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Eye, Pencil, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { fetchPartners } from './api/partners';
import StatusBadge from './components/StatusBadge';
import { ACCOUNT_STATUS } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';

export default function PartnersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'ALL';
  const pageParam = searchParams.get('page') || '1';
  const page = parseInt(pageParam, 10);

  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const current = prev.get('search') || '';
        if (debouncedSearch === current) return prev;

        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set('search', debouncedSearch);
          next.set('page', '1');
        } else {
          next.delete('search');
        }
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (newStatus !== 'ALL') {
      newParams.set('status', newStatus);
    } else {
      newParams.delete('status');
    }
    newParams.set('page', '1'); // reset to page 1 on filter
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'partners', { search: debouncedSearch, status: statusFilter, page }],
    queryFn: () => fetchPartners({ search: debouncedSearch, status: statusFilter, page }),
  });

  const partners = data?.data || data?.partners || (Array.isArray(data) ? data : []);
  const totalPages = data?.meta?.last_page || data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
        <Link
          to="/admin/partners/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Partner
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm shadow-sm"
            placeholder="Search partners by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="sm:w-64">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm shadow-sm"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="ALL">All Statuses</option>
            <option value={ACCOUNT_STATUS.ACTIVE}>Active</option>
            <option value={ACCOUNT_STATUS.SUSPENDED}>Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jobs
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recruiters
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : isError ? (
              // Error state
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                    <p className="text-red-500 font-medium mb-4">Error loading partners: {error?.message || 'Something went wrong'}</p>
                    <button
                      onClick={() => refetch()}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : partners.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">No partners found</p>
                    <p className="mt-1">Adjust your search or filter to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {(partner.logo || partner.logoUrl) ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={partner.logo || partner.logoUrl} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {partner.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link to={`/admin/partners/${partner.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-900">
                          {partner.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {partner.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={partner.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.jobsCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.recruitersCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/partners/${partner.id}`} className="text-gray-400 hover:text-gray-900" title="View details">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link to={`/admin/partners/${partner.id}/edit`} className="text-gray-400 hover:text-blue-600" title="Edit partner">
                        <Pencil className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {!isLoading && !isError && partners.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={clsx(
                  "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md",
                  page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={clsx(
                  "ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md",
                  page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={clsx(
                      "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium",
                      page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={clsx(
                      "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium",
                      page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
