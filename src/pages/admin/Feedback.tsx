import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, MessageSquare, Mail, Share, Search } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FaWhatsapp } from 'react-icons/fa';

export const Feedback: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['bug-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bug_reports')
        .select('*, reporter:profiles(id, username, ign, status)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('bug_reports').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bug-reports'] });
    },
  });

  const filteredReports = reports.filter(report => {
    const reporterName = (report.reporter as any)?.ign || '';
    const description = report.description || '';
    const matchesSearch = reporterName.toLowerCase().includes(searchTerm.toLowerCase()) || description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const generateShareMessage = (report: any) => {
    const message = `
      Bug Report Details:
      -------------------
      Reporter: ${(report.reporter as any)?.ign || 'Unknown'}
      Category: ${report.category}
      Description: ${report.description}
      Date: ${new Date(report.created_at).toLocaleString()}
      Status: ${report.status}
    `;
    return encodeURIComponent(message);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Issue Reports</h1>
          <p className="text-gray-400">Manage user-submitted issues and feedback.</p>
        </div>
      </div>

      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by reporter or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="not_a_bug">Not a Bug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="gameplay">Gameplay</SelectItem>
                <SelectItem value="ui">UI</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Submitted Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporter</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading reports...</TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <Dialog key={report.id}>
                    <DialogTrigger asChild>
                      <TableRow className="cursor-pointer">
                        <TableCell>{(report.reporter as any)?.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}{(report.reporter as any)?.ign || 'Unknown'}</TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell className="truncate max-w-xs">{report.description}</TableCell>
                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge>{report.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bug Report Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Reporter</h4>
                          <p>{(report.reporter as any)?.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}{(report.reporter as any)?.ign || 'Unknown'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Category</h4>
                          <p>{report.category}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Description</h4>
                          <p>{report.description}</p>
                        </div>
                        {report.file_url && (
                          <div>
                            <h4 className="font-semibold">Attachment</h4>
                            <img src={report.file_url} alt="Attachment" className="rounded-lg max-h-64" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">Status</h4>
                          <Select
                            onValueChange={(value) => updateStatusMutation.mutate({ id: report.id, status: value })}
                            defaultValue={report.status}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="not_a_bug">Not a Bug</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => navigate('/admin/announcements', { state: { targetUser: report.reporter } })}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Respond to Reporter
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={`mailto:?subject=Bug Report: ${report.title}&body=${generateShareMessage(report)}`}>
                                  <Button variant="outline"><Mail className="w-4 h-4" /></Button>
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Share via email</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={`https://wa.me/?text=${generateShareMessage(report)}`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline"><FaWhatsapp className="w-4 h-4" /></Button>
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Share via WhatsApp</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
