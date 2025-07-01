import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  UserCircle2, Stethoscope, LayoutDashboard
} from 'lucide-react';

import AdminAnalytics from './AdminAnalytics';
import AdminAuditLogs from './AdminAuditLogs';
import AdminBroadcasts from './AdminBroadcasts';
import AdminDoctors from './AdminDoctors';
import AdminPatients from './AdminPatients';
import AdminSettings from './AdminSettings';
import FinanceLedger from './FinanceLedger';
import Security from './Security';
import Support from './Support';
import SystemStatus from './SystemStatus';
import TriageLogs from './TriageLogs';
import VerifyDoctors from './VerifyDoctors';

export default function AdminPortal() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/admin/info')
      .then(res => {
        setAdmin(res.data);
        setActiveTab(getDefaultTab(res.data.clearance_level));
      })
      .catch(() => setError('Failed to load admin info'));

    axios.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  const getDefaultTab = (level) => {
    if (level === 'high') return 'analytics';
    if (level === 'mid') return 'triage';
    return 'support';
  };

  const canAccess = (tab) => {
    if (!admin) return false;
    const level = admin.clearance_level;
    const dept = admin.assigned_department?.toLowerCase();
    if (level === 'high') return true;
    if (level === 'mid') return [
      'doctors', 'patients', 'triage', 'revenue', 'broadcasts', 'auditlogs'
    ].includes(tab);
    return tab === dept.replace(/\s+/g, '').toLowerCase();
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!admin || !stats) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {admin.name}</h1>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-4 flex justify-between items-center">
          <div><h2 className="text-lg font-semibold">Patients</h2><p className="text-xl">{stats.patients}</p></div>
          <UserCircle2 className="w-8 h-8 text-blue-600" />
        </CardContent></Card>

        <Card><CardContent className="p-4 flex justify-between items-center">
          <div><h2 className="text-lg font-semibold">Doctors</h2><p className="text-xl">{stats.doctors}</p></div>
          <Stethoscope className="w-8 h-8 text-green-600" />
        </CardContent></Card>

        <Card><CardContent className="p-4 flex justify-between items-center">
          <div><h2 className="text-lg font-semibold">Consults</h2><p className="text-xl">{stats.consultations}</p></div>
          <LayoutDashboard className="w-8 h-8 text-purple-600" />
        </CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2">
          {canAccess('analytics') && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          {canAccess('auditlogs') && <TabsTrigger value="auditlogs">Audit Logs</TabsTrigger>}
          {canAccess('broadcasts') && <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>}
          {canAccess('doctors') && <TabsTrigger value="doctors">Doctors</TabsTrigger>}
          {canAccess('patients') && <TabsTrigger value="patients">Patients</TabsTrigger>}
          {canAccess('triage') && <TabsTrigger value="triage">Triage</TabsTrigger>}
          {canAccess('revenue') && <TabsTrigger value="revenue">Finance</TabsTrigger>}
          {canAccess('security') && <TabsTrigger value="security">Security</TabsTrigger>}
          {canAccess('support') && <TabsTrigger value="support">Support</TabsTrigger>}
          {canAccess('settings') && <TabsTrigger value="settings">Settings</TabsTrigger>}
          {canAccess('systemstatus') && <TabsTrigger value="systemstatus">System</TabsTrigger>}
          {canAccess('verifydoctors') && <TabsTrigger value="verifydoctors">Verify</TabsTrigger>}
        </TabsList>

        {canAccess('analytics') && <TabsContent value="analytics"><AdminAnalytics /></TabsContent>}
        {canAccess('auditlogs') && <TabsContent value="auditlogs"><AdminAuditLogs /></TabsContent>}
        {canAccess('broadcasts') && <TabsContent value="broadcasts"><AdminBroadcasts /></TabsContent>}
        {canAccess('doctors') && <TabsContent value="doctors"><AdminDoctors /></TabsContent>}
        {canAccess('patients') && <TabsContent value="patients"><AdminPatients /></TabsContent>}
        {canAccess('triage') && <TabsContent value="triage"><TriageLogs /></TabsContent>}
        {canAccess('revenue') && <TabsContent value="revenue"><FinanceLedger /></TabsContent>}
        {canAccess('security') && <TabsContent value="security"><Security /></TabsContent>}
        {canAccess('support') && <TabsContent value="support"><Support /></TabsContent>}
        {canAccess('settings') && <TabsContent value="settings"><AdminSettings /></TabsContent>}
        {canAccess('systemstatus') && <TabsContent value="systemstatus"><SystemStatus /></TabsContent>}
        {canAccess('verifydoctors') && <TabsContent value="verifydoctors"><VerifyDoctors /></TabsContent>}
      </Tabs>
    </div>
  );
}
