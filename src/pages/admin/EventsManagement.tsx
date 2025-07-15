
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  Trophy,
  Clock,
  CalendarDays
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  name: string;
  type: 'MP' | 'BR' | 'Mixed';
  date: string;
  time: string;
  description: string;
  assignedPlayers: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Championship Qualifier',
    type: 'BR',
    date: '2024-07-20',
    time: '20:00',
    description: 'Qualifying round for the championship tournament',
    assignedPlayers: ['slayerX', 'TacticalSniper', 'EliteWarrior'],
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Training Session - Hardpoint',
    type: 'MP',
    date: '2024-07-18',
    time: '19:30',
    description: 'Practice session focused on Hardpoint strategies',
    assignedPlayers: ['GhostAlpha', 'ProSniper'],
    status: 'completed'
  }
];

const mockPlayers = ['slayerX', 'TacticalSniper', 'EliteWarrior', 'GhostAlpha', 'ProSniper', 'CombatPro'];

export const AdminEventsManagement: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'MP' as 'MP' | 'BR' | 'Mixed',
    date: '',
    time: '',
    description: '',
    assignedPlayers: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'MP',
      date: '',
      time: '',
      description: '',
      assignedPlayers: []
    });
  };

  const handleCreateEvent = () => {
    if (!formData.name || !formData.date || !formData.time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData,
      status: 'upcoming'
    };

    setEvents(prev => [...prev, newEvent]);
    setIsCreateDialogOpen(false);
    resetForm();

    toast({
      title: "Event Created",
      description: `${formData.name} has been scheduled successfully`,
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      type: event.type,
      date: event.date,
      time: event.time,
      description: event.description,
      assignedPlayers: event.assignedPlayers
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !formData.name || !formData.date || !formData.time) return;

    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id 
        ? { ...event, ...formData }
        : event
    ));

    setEditingEvent(null);
    resetForm();

    toast({
      title: "Event Updated",
      description: `${formData.name} has been updated successfully`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Event has been removed successfully",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BR':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'MP':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Mixed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'ongoing':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Events Management</h1>
          <p className="text-muted-foreground font-rajdhani">Create and manage clan events</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-rajdhani">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-orbitron">Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-rajdhani">Event Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="font-rajdhani">Event Type *</Label>
                  <Select value={formData.type} onValueChange={(value: 'MP' | 'BR' | 'Mixed') => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MP">Multiplayer</SelectItem>
                      <SelectItem value="BR">Battle Royale</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="font-rajdhani">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="font-rajdhani">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="bg-background/50 border-border/50 font-rajdhani"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-rajdhani">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                  placeholder="Event description..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  className="font-rajdhani"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-primary hover:bg-primary/90 font-rajdhani"
                >
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{events.length}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Events</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1 font-orbitron">
              {events.filter(e => e.status === 'upcoming').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Upcoming</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">
              {events.filter(e => e.status === 'ongoing').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Ongoing</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1 font-orbitron">
              {events.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MP">MP</SelectItem>
                <SelectItem value="BR">BR</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-primary" />
            Events List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground font-rajdhani">Event</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Type</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Date & Time</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Status</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Players</TableHead>
                <TableHead className="text-muted-foreground font-rajdhani">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map(event => (
                <TableRow key={event.id} className="border-border/30 hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground font-rajdhani">{event.name}</div>
                      {event.description && (
                        <div className="text-sm text-muted-foreground font-rajdhani truncate max-w-xs">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-rajdhani">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-rajdhani">
                        {event.assignedPlayers.length}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEvent(event)}
                        className="border-border/50 hover:bg-muted/50 font-rajdhani"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-rajdhani"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="font-rajdhani">Event Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
              <div>
                <Label htmlFor="edit-type" className="font-rajdhani">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value: 'MP' | 'BR' | 'Mixed') => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MP">Multiplayer</SelectItem>
                    <SelectItem value="BR">Battle Royale</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date" className="font-rajdhani">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
              <div>
                <Label htmlFor="edit-time" className="font-rajdhani">Time *</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-background/50 border-border/50 font-rajdhani"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description" className="font-rajdhani">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-background/50 border-border/50 font-rajdhani"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingEvent(null);
                  resetForm();
                }}
                className="font-rajdhani"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateEvent}
                className="bg-primary hover:bg-primary/90 font-rajdhani"
              >
                Update Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
