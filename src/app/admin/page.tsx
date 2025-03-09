import BulkImageUpload from '@/components/admin/BulkImageUpload'

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Bulk Image Upload</h1>
      <BulkImageUpload />
    </div>
  )
}