import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, Pencil, Ban, CheckCircle, ExternalLink, AlertCircle, Building2, UserPlus, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fetchPartner, toggleSuspendPartner } from './api/partners';
import StatusBadge from './components/StatusBadge';
import ConfirmDialog from './components/ConfirmDialog';
import CreatePartnerAdminModal from './components/CreatePartnerAdminModal';
import { ACCOUNT_STATUS } from '@/constants';

export default function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const { data: partner, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'partners', id],
    queryFn: () => fetchPartner(id),
  });

  const toggleSuspendMutation = useMutation({
    mutationFn: (newStatus) => toggleSuspendPartner(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] });
      setIsSuspendDialogOpen(false);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-[#102A2B] rounded"></div>
        <div className="bg-[#0D2224] border border-[#294341] rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 rounded-2xl bg-[#102A2B]"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 w-1/3 bg-[#102A2B] rounded"></div>
              <div className="h-4 w-1/4 bg-[#102A2B] rounded"></div>
            </div>
          </div>
          <div className="h-20 bg-[#102A2B] rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0D2224] border border-[#294341] rounded-2xl p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-400 mb-4" />
        <h3 className="text-lg font-bold text-[#F7F8F5] mb-2">Error loading partner</h3>
        <p className="text-xs text-[#91A6A0] mb-6">{error?.message || 'Something went wrong while fetching partner details.'}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/admin/partners')}
            className="px-4 py-2 border border-[#294341] rounded-xl text-xs font-semibold text-[#8FAF9A] bg-[#102A2B] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2F7D5B] hover:bg-[#246347] border border-[#2F7D5B]/50 transition-all shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!partner) return null;

  const partnerData = partner?.data || partner;
  const isActive = partnerData.status === ACCOUNT_STATUS.ACTIVE;

  const handleToggleSuspend = () => {
    const newStatus = isActive ? ACCOUNT_STATUS.SUSPENDED : ACCOUNT_STATUS.ACTIVE;
    toggleSuspendMutation.mutate(newStatus);
  };

  const partnerLogo = partnerData.logo || partnerData.logoUrl;

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Back */}
      <nav className="flex items-center text-xs font-semibold text-[#8FAF9A]">
        <Link to="/admin/partners" className="hover:text-[#F7F8F5] flex items-center transition-colors">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Partners
        </Link>
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-[#294341]" />
        <Link to="/admin/partners" className="hover:text-[#F7F8F5] transition-colors">Partners</Link>
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-[#294341]" />
        <span className="text-[#F7F8F5]">{partnerData.name}</span>
      </nav>

      {/* Main Partner Profile Card */}
      <div className="bg-[#0D2224] border border-[#294341] rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#294341] bg-[#102A2B]/40">
          <div className="flex items-center">
            {partnerLogo ? (
              <img src={partnerLogo} alt={partnerData.name} className="h-16 w-16 rounded-2xl object-cover border border-[#294341]" />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-[#102A2B] border border-[#294341] text-[#B9D8C4] flex items-center justify-center text-2xl font-bold shadow-sm">
                {partnerData.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="ml-5">
              <h1 className="text-2xl font-bold text-[#F7F8F5] flex items-center gap-3">
                {partnerData.name}
                <StatusBadge status={partnerData.status} />
              </h1>
              {partnerData.website && (
                <a
                  href={partnerData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D6A84F] hover:text-[#E5B866] flex items-center mt-1 transition-colors"
                >
                  {partnerData.website}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/admin/partners/${id}/edit`}
              className="inline-flex items-center px-3.5 py-2 border border-[#294341] rounded-xl text-xs font-semibold text-[#8FAF9A] bg-[#102A2B] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors shadow-sm"
            >
              <Pencil className="-ml-0.5 mr-1.5 h-3.5 w-3.5" />
              Edit Partner
            </Link>
            <button
              onClick={() => setIsSuspendDialogOpen(true)}
              className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isActive 
                  ? 'border border-rose-800/40 bg-rose-950/40 text-rose-400 hover:bg-rose-900/50' 
                  : 'border border-[#2F7D5B]/40 bg-[#2F7D5B]/20 text-[#B9D8C4] hover:bg-[#2F7D5B]/30'
              }`}
            >
              {isActive ? (
                <><Ban className="-ml-0.5 mr-1.5 h-3.5 w-3.5" /> Suspend Access</>
              ) : (
                <><CheckCircle className="-ml-0.5 mr-1.5 h-3.5 w-3.5" /> Unsuspend Access</>
              )}
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#2F7D5B] hover:bg-[#246347] border border-[#2F7D5B]/50 transition-all shadow-md"
            >
              <UserPlus className="-ml-0.5 mr-1.5 h-3.5 w-3.5" />
              Add Admin
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 py-6">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#8FAF9A]">Description</dt>
              <dd className="mt-1.5 text-xs text-[#91A6A0] leading-relaxed whitespace-pre-wrap">{partnerData.description || 'No description provided.'}</dd>
            </div>
            <div className="sm:col-span-1 rounded-xl bg-[#102A2B]/40 border border-[#294341] p-4">
              <dt className="text-xs font-semibold text-[#8FAF9A]">Created Date</dt>
              <dd className="mt-1 text-sm font-bold text-[#F7F8F5]">
                {(partnerData.created_at || partnerData.createdAt)
                  ? format(new Date(partnerData.created_at || partnerData.createdAt), 'PPP')
                  : 'Unknown'}
              </dd>
            </div>
            <div className="sm:col-span-1 rounded-xl bg-[#102A2B]/40 border border-[#294341] p-4">
              <dt className="text-xs font-semibold text-[#8FAF9A]">Total Active Jobs</dt>
              <dd className="mt-1 text-sm font-bold text-[#B9D8C4]">{partnerData.jobs_count ?? partnerData.jobsCount ?? 0}</dd>
            </div>
            <div className="sm:col-span-1 rounded-xl bg-[#102A2B]/40 border border-[#294341] p-4">
              <dt className="text-xs font-semibold text-[#8FAF9A]">Total Recruiters</dt>
              <dd className="mt-1 text-sm font-bold text-[#E5B866]">{partnerData.recruiters_count ?? partnerData.recruitersCount ?? 0}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-[#0D2224] border border-[#294341] rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#294341] bg-[#102A2B]/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F7F8F5]">Partner Administrators</h3>
            <p className="mt-0.5 text-xs text-[#91A6A0]">Users who have administrative access to this partner tenant.</p>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-1.5 text-xs font-semibold text-[#8FAF9A] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Admin
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#294341]/60 text-xs">
            <thead className="bg-[#102A2B] text-[11px] font-semibold text-[#8FAF9A] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294341]/40 bg-[#0D2224]">
              {partnerData.admins && partnerData.admins.length > 0 ? (
                partnerData.admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-[#102A2B]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#F7F8F5]">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#91A6A0]">
                      {admin.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-xs text-[#91A6A0]">
                    No admins assigned to this partner yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={handleToggleSuspend}
        title={isActive ? 'Suspend Partner' : 'Unsuspend Partner'}
        message={isActive 
          ? 'Suspend Partner? This will disable their access and the access of all associated recruiters. Active jobs may be hidden.' 
          : 'Unsuspend Partner? This will restore their access.'}
        confirmText={isActive ? 'Suspend' : 'Unsuspend'}
        confirmVariant={isActive ? 'danger' : 'primary'}
        loading={toggleSuspendMutation.isPending}
      />

      <CreatePartnerAdminModal
        open={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        partnerId={id}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin', 'partners', id] });
        }}
      />
    </div>
  );
}
