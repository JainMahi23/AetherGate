import { useState, useEffect } from 'react';
import { Server, Plus, RefreshCw, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
import { ProviderTable } from '../components/providers/ProviderTable';
import { ProviderFormModal } from '../components/providers/ProviderFormModal';
import { Button } from '../components/ui/Button';
import { ErrorMessage, SuccessMessage } from '../components/ui/ErrorMessage';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { getAllProviders, createProvider, updateProvider, deleteProvider } from '../services/providerService';
import { getErrorMessage } from '../utils/errorMessages';

export default function ProvidersPage() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProviders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const res = await getAllProviders();
      if (res?.data) {
        setProviders(res.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleOpenCreate = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProvider(p);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingProvider) {
        await updateProvider(editingProvider.id, payload);
        setSuccess(`Provider "${payload.providerName}" updated successfully.`);
      } else {
        await createProvider(payload);
        setSuccess(`Provider "${payload.providerName}" created successfully.`);
      }
      setIsModalOpen(false);
      await fetchProviders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError('');
    setSuccess('');

    try {
      await deleteProvider(deleteTarget.id);
      setSuccess(`Provider "${deleteTarget.providerName}" removed.`);
      setDeleteTarget(null);
      await fetchProviders();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <PageLoader message="Loading providers registry..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Server size={22} className="text-indigo-500" />
            Provider Registry
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Manage underlying LLM backends, priorities, timeout limits, and health configurations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchProviders(true)}
            loading={refreshing}
          >
            <RefreshCw size={14} />
            Refresh
          </Button>

          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
            >
              <Plus size={15} />
              Add Provider
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} />}

      {/* Admin Notice or Read-Only Notice */}
      {!isAdmin && (
        <div
          className="p-3.5 rounded-xl border flex items-center gap-2.5 text-xs"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <ShieldAlert size={16} className="text-amber-500 flex-shrink-0" />
          <span>
            You are logged in as a <strong>Standard User</strong> (<code>ROLE_USER</code>). Provider modifications are restricted to Administrators.
          </span>
        </div>
      )}

      {/* Main Table */}
      <ProviderTable
        providers={providers}
        onEdit={handleOpenEdit}
        onDelete={(p) => setDeleteTarget(p)}
        isAdmin={isAdmin}
      />

      {/* Create / Edit Modal */}
      <ProviderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        provider={editingProvider}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Provider Removal"
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={isDeleting}>
              Delete Provider
            </Button>
          </div>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete the provider{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {deleteTarget?.providerName} ({deleteTarget?.providerCode})
          </strong>?
          This will immediately remove it from the AetherGate routing pipeline.
        </p>
      </Modal>
    </div>
  );
}
