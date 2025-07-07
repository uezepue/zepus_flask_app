import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
  const [form, setForm] = useState({
    platform_name: '',
    support_email: '',
    default_fee: '',
    allow_registration: 'true',
    maintenance_mode: 'false',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setForm({
          platform_name: data.platform_name || '',
          support_email: data.support_email || '',
          default_fee: data.default_fee || '',
          allow_registration: data.allow_registration || 'true',
          maintenance_mode: data.maintenance_mode || 'false'
        });
      })
      .catch(() => toast.error("❌ Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || '✅ Settings updated successfully');
      } else {
        toast.error(data.message || '⚠️ Failed to update settings');
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center text-[#064f73] mb-6">System Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-700">Platform Name</label>
          <Input
            required
            value={form.platform_name}
            onChange={handleChange('platform_name')}
            placeholder="e.g., ZEPUS Clinics"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Support Email</label>
          <Input
            type="email"
            required
            value={form.support_email}
            onChange={handleChange('support_email')}
            placeholder="e.g., support@zepusclinics.com"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Default Consultation Fee (₦)</label>
          <Input
            type="number"
            min="0"
            value={form.default_fee}
            onChange={handleChange('default_fee')}
            placeholder="e.g., 3000"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Allow New Registrations</label>
          <Select
            value={form.allow_registration}
            onValueChange={handleSelectChange('allow_registration')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Allow New Registrations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Maintenance Mode</label>
          <Select
            value={form.maintenance_mode}
            onValueChange={handleSelectChange('maintenance_mode')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Maintenance Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Off</SelectItem>
              <SelectItem value="true">On</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
