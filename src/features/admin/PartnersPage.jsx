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
    newParams.set('page', '1');
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
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">Partners</h1>
          <p className="mt-1 text-sm text-[#91A6A0]">Manage enterprise employer accounts and hiring organizations.</p>
        </div>
        <Link
          to="/admin/partners/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F7D5B] px-5 py-2.5 text-sm font-semibold text-[#F7F8F5] shadow-lg shadow-[#2F7D5B]/20 hover:bg-[#25684a] transition-all"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Partner
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-[#91A6A0]" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-[#294341] bg-[#102A2B] pl-10 pr-3.5 py-2.5 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            placeholder="Search partners by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="sm:w-64">
          <select
            className="block w-full rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2.5 text-sm text-[#F7F8F5] focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="ALL">All Statuses</option>
            <option value={ACCOUNT_STATUS.ACTIVE}>Active</option>
            <option value={ACCOUNT_STATUS.SUSPENDED}>Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#294341] bg-[#0D2224] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#294341]/60">
            <thead className="bg-[#102A2B]">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                  Website
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                  Jobs
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                  Recruiters
                </th>
                <th scope="col" className="relative px-6 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294341]/60 bg-[#0D2224]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#102A2B]"></div>
                        <div className="ml-4">
                          <div className="h-4 w-28 bg-[#102A2B] rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-[#102A2B] rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-16 bg-[#102A2B] rounded-full"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-8 bg-[#102A2B] rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-8 bg-[#102A2B] rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-5 w-16 bg-[#102A2B] rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-rose-400 mb-2" />
                      <p className="text-rose-400 font-medium mb-4">Error loading partners: {error?.message || 'Something went wrong'}</p>
                      <button
                        onClick={() => refetch()}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#102A2B] border border-[#294341] text-[#D6A84F] hover:bg-[#153536]"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#91A6A0]">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-base font-semibold text-[#F7F8F5]">No partners found</p>
                      <p className="mt-1 text-xs">Adjust your search or filter to find what you&apos;re looking for.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#153536]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {(partner.logo || partner.logoUrl) ? (
                            <img className="h-10 w-10 rounded-xl object-cover border border-[#294341]" src={partner.logo || partner.logoUrl} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-[#102A2B] border border-[#294341] flex items-center justify-center text-[#D6A84F] font-bold text-base">
                              {partner.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Link to={`/admin/partners/${partner.id}`} className="text-sm font-semibold text-[#F7F8F5] hover:text-[#D6A84F] transition-colors">
                            {partner.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#91A6A0]">
                      {partner.website ? (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#D6A84F]">
                          {partner.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={partner.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F7F8F5]">
                      {partner.jobsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F7F8F5]">
                      {partner.recruitersCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/partners/${partner.id}`} className="text-[#91A6A0] hover:text-[#F7F8F5] transition-colors" title="View details">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link to={`/admin/partners/${partner.id}/edit`} className="text-[#91A6A0] hover:text-[#D6A84F] transition-colors" title="Edit partner">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && !isError && partners.length > 0 && (
          <div className="bg-[#102A2B] px-6 py-3.5 flex items-center justify-between border-t border-[#294341] text-xs text-[#91A6A0]">
            <div>
              <p>
                Showing page <span className="font-semibold text-[#F7F8F5]">{page}</span> of <span className="font-semibold text-[#F7F8F5]">{totalPages}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[#294341] bg-[#0D2224] px-3 py-1 font-medium text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-[#294341] bg-[#0D2224] px-3 py-1 font-medium text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
