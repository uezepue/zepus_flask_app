import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function AdminSettings() {
  const [form, setForm] = useState({
    platform_name: '',
    support_email: '',
    default_fee: '',
    allow_registration: 'true',
    maintenance_mode: 'false',
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setForm({
        platform_name: data.platform_name || '',
        support_email: data.support_email || '',
        default_fee: data.default_fee || '',
        allow_registration: data.allow_registration || 'true',
        maintenance_mode: data.maintenance_mode || 'false'
      }));
  }, []);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/admin/settings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(data => alert(data.message || 'Settings updated!'));
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center text-[#064f73] mb-6">System Settings</h1>
      <form onSubmit={handleSubmit}>
        <label className="block font-semibold text-gray-700 mt-4">Platform Name</label>
        <Input value={form.platform_name} onChange={handleChange('platform_name')} />

        <label className="block font-semibold text-gray-700 mt-4">Support Email</label>
        <Input type="email" value={form.support_email} onChange={handleChange('support_email')} />

        <label className="block font-semibold text-gray-700 mt-4">Default Consultation Fee (₦)</label>
        <Input type="number" value={form.default_fee} onChange={handleChange('default_fee')} />

        <label className="block font-semibold text-gray-700 mt-4">Allow New Registrations</label>
        <Select value={form.allow_registration} onValueChange={handleSelectChange('allow_registration')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Allow New Registrations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>

        <label className="block font-semibold text-gray-700 mt-4">Maintenance Mode</label>
        <Select value={form.maintenance_mode} onValueChange={handleSelectChange('maintenance_mode')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Maintenance Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Off</SelectItem>
            <SelectItem value="true">On</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" className="mt-6 w-full">Save Settings</Button>
      </form>
    </div>
  );
}
