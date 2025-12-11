// app/admin/asset/page.tsx
import { fetchLelangBarangAction } from "@/lib/actions/lelang";
import DataTable from "./DataTable";

export default async function AdminAssetPage() {
  // ✅ Data fetching di server
  const initialData = await fetchLelangBarangAction();

  // ✅ Kirim data ke Client Component via props
  return <DataTable initialData={initialData} />;
}