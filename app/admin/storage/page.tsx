import { StorageDashboard } from "@/components/admin/StorageDashboard";

export const metadata = { title: "Storage" };

export default function StoragePage() {
  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="section-heading">Storage</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Cloudinary usage dashboard</p>
      </div>
      <StorageDashboard />
    </div>
  );
}
