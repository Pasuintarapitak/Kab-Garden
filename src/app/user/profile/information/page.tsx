'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import Navbar from '../../../components/Navbar';

export default function Information() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [editMode, setEditMode] = useState<any>({
    name: false, email: false, phone: false, lineid: false, address: false
  });
  const [formData, setFormData] = useState<any>({
    name: '', email: '', phone: '', lineid: '', address: ''
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/${session?.user?.email}`);
      setUserData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        lineid: response.data.lineid || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    else if (status === 'authenticated') fetchUserData();
  }, [status]);

  const handleEditClick = (field: string) => {
    setEditMode((prev: any) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (field: string) => {
    try {
      await axios.put(`/api/user/${session?.user?.email}`, {
        [field]: field === 'phone' ? parseInt(formData[field], 10) : formData[field]
      });
      setEditMode((prev: any) => ({ ...prev, [field]: false }));
      
      if (field === 'name') window.location.reload();
      else if (field === 'email') router.push('/user/login');
    } catch (error) {
      alert('Failed to save changes');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-light text-gray-400">Loading profile...</div>;

  return (
    <div className="bg-[#FBFCFB] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900">My Information</h2>
                <p className="text-gray-400 text-sm mt-2">จัดการข้อมูลส่วนตัวและที่อยู่สำหรับจัดส่งต้นไม้ของคุณ</p>
              </div>

              <div className="space-y-8">
                {['name', 'email', 'phone', 'lineid', 'address'].map((field) => (
                  <div key={field} className="group border-b border-gray-50 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
                        {field === 'lineid' ? 'Line ID' : field}
                      </label>
                      
                      {!editMode[field] ? (
                        <button 
                          onClick={() => handleEditClick(field)}
                          className="text-xs font-bold text-[#2D5A27] hover:bg-[#2D5A27]/5 px-3 py-1 rounded-full transition-all"
                        >
                          Change
                        </button>
                      ) : (
                        <div className="flex gap-3">
                           <button 
                            onClick={() => handleSave(field)}
                            className="text-xs font-bold text-white bg-[#2D5A27] px-3 py-1 rounded-full hover:bg-[#1f3f1b] transition-all"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditMode((prev: any) => ({ ...prev, [field]: false }))}
                            className="text-xs font-bold text-gray-400 px-3 py-1 rounded-full hover:bg-gray-100 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-1">
                      {editMode[field] ? (
                        field === 'address' ? (
                          <textarea
                            name={field}
                            value={formData[field]}
                            onChange={(e: any) => handleInputChange(e)}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#2D5A27] outline-none transition-all text-sm"
                            rows={3}
                          />
                        ) : (
                          <input
                            type={field === 'phone' ? 'number' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#2D5A27] outline-none transition-all text-sm"
                          />
                        )
                      ) : (
                        <p className="text-gray-700 font-medium">
                          {formData[field] || <span className="text-gray-300 italic font-light">Not specified</span>}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Hint */}
              <div className="mt-12 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
                <span className="text-xl">🔒</span>
                <p className="text-xs text-orange-700 leading-relaxed">
                  <strong>หมายเหตุ:</strong> การเปลี่ยนอีเมลจะทำให้คุณถูกออกจากระบบอัตโนมัติ เพื่อความปลอดภัยกรุณาเข้าสู่ระบบอีกครั้งด้วยอีเมลใหม่
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}