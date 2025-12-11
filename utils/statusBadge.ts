// utils/statusBadge.ts
export const getStatusBadgeClass = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'aktif') return { bg: 'bg-blue-100', text: 'text-blue-800' };
  if (s === 'selesai') return { bg: 'bg-green-100', text: 'text-green-800' };
  if (s === 'dibatalkan') return { bg: 'bg-red-100', text: 'text-red-800' };
  return { bg: 'bg-gray-100', text: 'text-gray-700' };
};