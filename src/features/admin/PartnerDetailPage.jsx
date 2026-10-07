import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, Pencil, Ban, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
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
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 rounded-lg bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading partner</h3>
        <p className="text-gray-500 mb-6">{error?.message || 'Something went wrong while fetching partner details.'}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/admin/partners')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
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
    <div className="space-y-6">
      {/* Breadcrumb & Back */}
      <nav className="flex items-center text-sm font-medium text-gray-500">
        <Link to="/admin/partners" className="hover:text-gray-700 flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Partners
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link to="/admin/partners" className="hover:text-gray-700">Partners</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-gray-900">{partnerData.name}</span>
      </nav>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Header Section */}
        <div className="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
          <div className="flex items-center">
            {partnerLogo ? (
              <img src={partnerLogo} alt={partnerData.name} className="h-20 w-20 rounded-lg object-cover shadow-sm border border-gray-100" />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold shadow-sm">
                {partnerData.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {partnerData.name}
                <StatusBadge status={partnerData.status} />
              </h1>
              {partnerData.website && (
                <a
                  href={partnerData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center mt-1"
                >
                  {partnerData.website}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/admin/partners/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Pencil className="-ml-1 mr-2 h-4 w-4" />
              Edit Partner
            </Link>
            <button
              onClick={() => setIsSuspendDialogOpen(true)}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActive 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              {isActive ? (
                <><Ban className="-ml-1 mr-2 h-4 w-4" /> Suspend</>
              ) : (
                <><CheckCircle className="-ml-1 mr-2 h-4 w-4" /> Unsuspend</>
              )}
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Admin
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{partnerData.description || 'No description provided.'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {(partnerData.created_at || partnerData.createdAt)
                  ? format(new Date(partnerData.created_at || partnerData.createdAt), 'PPP')
                  : 'Unknown'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total Jobs</dt>
              <dd className="mt-1 text-sm text-gray-900 font-semibold">{partnerData.jobs_count ?? partnerData.jobsCount ?? 0}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total Recruiters</dt>
              <dd className="mt-1 text-sm text-gray-900 font-semibold">{partnerData.recruiters_count ?? partnerData.recruitersCount ?? 0}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Partner Admins</h3>
          <p className="mt-1 text-sm text-gray-500">Users who have administrative access to this partner account.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partnerData.admins && partnerData.admins.length > 0 ? (
                partnerData.admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                    No admins found for this partner.
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
