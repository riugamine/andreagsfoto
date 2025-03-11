import BulkImageUpload from '@/components/admin/BulkImageUpload'
import SingleImageUpload from '@/components/admin/SingleImageUpload'
import DeleteImage from '@/components/admin/DeleteImage'
import AdminAuth from '@/components/auth/AdminAuth'

export default function AdminPage() {
  return (
    <AdminAuth>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Studio Management</h1>
        <BulkImageUpload />
        <SingleImageUpload />
        <DeleteImage />
      </div>
    </AdminAuth>
  )
}