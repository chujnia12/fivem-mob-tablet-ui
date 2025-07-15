import React, { useState } from 'react';
import { ArrowLeft, Search, Users, UserPlus, Settings, Shield, Crown, User, MoreVertical, Phone, Mail, Copy, UserMinus, TrendingUp } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

interface MembersAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const MembersApp: React.FC<MembersAppProps> = ({ orgData, onHome }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [showMemberActions, setShowMemberActions] = useState<string | null>(null);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showFireDialog, setShowFireDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [playerIdToHire, setPlayerIdToHire] = useState('');
  const { toast } = useToast();

  // TODO: Fetch from database - users table joined with jobs table
  const members = [
    {
      id: '2050876582',
      name: 'Braian Brown',
      rank: 'STARSZY CZŁONEK',
      grade: 3,
      status: 'online',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      phone: '+1 555-0123',
      email: 'braian@example.com',
      joinDate: '2024-01-15',
      lastSeen: 'Online',
      salary: 5000,
      permissions: ['vehicles', 'weapons']
    },
    {
      id: '9079340077',
      name: 'Rudolph Rudi',
      rank: 'SZEF',
      grade: 7,
      status: 'online',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      phone: '+1 555-0124',
      email: 'rudi@example.com',
      joinDate: '2023-05-10',
      lastSeen: 'Online',
      salary: 15000,
      permissions: ['all']
    },
    {
      id: '4806755054',
      name: 'josee carterr',
      rank: 'CZŁONEK',
      grade: 1,
      status: 'offline',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      phone: '+1 555-0125',
      email: 'josee@example.com',
      joinDate: '2024-03-20',
      lastSeen: '2 hours ago',
      salary: 2500,
      permissions: ['basic']
    },
    {
      id: '1234567890',
      name: 'Mike Johnson',
      rank: 'ZASTĘPCA',
      grade: 5,
      status: 'online',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      phone: '+1 555-0126',
      email: 'mike@example.com',
      joinDate: '2023-11-08',
      lastSeen: 'Online',
      salary: 8000,
      permissions: ['management', 'finance']
    },
    {
      id: '9876543210',
      name: 'Sarah Davis',
      rank: 'CZŁONEK',
      grade: 2,
      status: 'offline',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      phone: '+1 555-0127',
      email: 'sarah@example.com',
      joinDate: '2024-02-14',
      lastSeen: '5 hours ago',
      salary: 3000,
      permissions: ['vehicles']
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'online' && member.status === 'online') ||
      (selectedFilter === 'offline' && member.status === 'offline') ||
      (selectedFilter === 'zarzad' && member.grade >= 5);
    
    return matchesSearch && matchesFilter;
  });

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'SZEF': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'ZASTĘPCA': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'STARSZY CZŁONEK': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'SZEF': return Crown;
      case 'ZASTĘPCA': return Shield;
      case 'STARSZY CZŁONEK': return Settings;
      default: return User;
    }
  };

  const copyPhoneNumber = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast({
      title: "Skopiowano",
      description: `Numer telefonu ${phone} został skopiowany`,
    });
  };

  const handleHireMember = () => {
    if (!playerIdToHire.trim()) {
      toast({
        title: "Błąd",
        description: "Wprowadź ID gracza",
        variant: "destructive"
      });
      return;
    }

    // TODO: Send hiring request to player
    toast({
      title: "Wysłano zaproszenie",
      description: `Zaproszenie do organizacji zostało wysłane do gracza ${playerIdToHire}`,
    });
    
    setShowHireDialog(false);
    setPlayerIdToHire('');
  };

  const handleMemberAction = (member: any, action: string) => {
    setSelectedMember(member);
    setShowMemberActions(null);
    
    if (action === 'promote') {
      setShowPromoteDialog(true);
    } else if (action === 'fire') {
      setShowFireDialog(true);
    }
  };

  const handlePromoteMember = () => {
    toast({
      title: "Awansowano członka",
      description: `${selectedMember?.name} został awansowany`,
    });
    setShowPromoteDialog(false);
    setSelectedMember(null);
  };

  const handleFireMember = () => {
    toast({
      title: "Wyrzucono członka",
      description: `${selectedMember?.name} został wyrzucony z organizacji`,
    });
    setShowFireDialog(false);
    setSelectedMember(null);
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <h1 className="text-xl font-medium">Zarządzanie Członkami</h1>
          </div>
        </div>
        <Button 
          onClick={() => setShowHireDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <UserPlus size={16} className="mr-2" />
          ZATRUDNIJ
        </Button>
      </div>

      <div className="flex h-[calc(100%-5rem)]">
        {/* Search and Filters */}
        <div className="flex-1 p-6 space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <Input
                  placeholder="Szukaj członka..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {[
                { id: 'all', name: 'Wszyscy' },
                { id: 'online', name: 'Online' },
                { id: 'offline', name: 'Offline' },
                { id: 'zarzad', name: 'Zarząd' }
              ].map((filter) => (
                <Button
                  key={filter.id}
                  size="sm"
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`${selectedFilter === filter.id 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-white/20 text-white/80 hover:bg-white/10 bg-transparent'} rounded-xl`}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Members Grid */}
          <ScrollArea className="h-[calc(100%-8rem)] rounded-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500/50">
            <div className="grid grid-cols-2 gap-4 pr-4">
              {filteredMembers.map((member) => {
                const RankIcon = getRankIcon(member.rank);
                return (
                  <div key={member.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                            member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{member.name}</h3>
                          <p className="text-white/60 text-sm">ID: {member.id}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowMemberActions(showMemberActions === member.id ? null : member.id)}
                          className="text-white/60 hover:bg-white/10 rounded-full p-2"
                        >
                          <MoreVertical size={16} />
                        </Button>
                        
                        {/* Action Menu */}
                        {showMemberActions === member.id && (
                          <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-2 min-w-48 z-50">
                            <button
                              onClick={() => handleMemberAction(member, 'promote')}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <TrendingUp size={16} className="text-green-400" />
                              Zmień rangę
                            </button>
                            <button
                              onClick={() => handleMemberAction(member, 'fire')}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <UserMinus size={16} className="text-red-400" />
                              Wyrzuć
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-medium border ${getRankColor(member.rank)} mb-4`}>
                      <RankIcon size={12} />
                      {member.rank}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-white/60" />
                        <span className="text-white/80 flex-1">{member.phone}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyPhoneNumber(member.phone)}
                          className="p-1 h-auto text-white/60 hover:bg-white/10 rounded"
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-white/60" />
                        <span className="text-white/80">{member.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60">Ostatnio:</span>
                        <span className="text-white/80">{member.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Statistics Panel */}
        <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 space-y-6">
          <ScrollArea className="h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500/50">
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Statystyki</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white mb-1">{members.length}</div>
                  <div className="text-white/60 text-sm">Łączna liczba członków</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {members.filter(m => m.status === 'online').length}
                  </div>
                  <div className="text-white/60 text-sm">Online teraz</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Rangi</h4>
                {['SZEF', 'ZASTĘPCA', 'STARSZY CZŁONEK', 'CZŁONEK'].map((rank) => {
                  const count = members.filter(m => m.rank === rank).length;
                  return (
                    <div key={rank} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-sm">{rank}</span>
                      <span className="text-white/80 font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Hire Dialog */}
      <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Zatrudnij nowego członka</DialogTitle>
            <DialogDescription className="text-white/80">
              Wprowadź ID gracza, którego chcesz zatrudnić do organizacji.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="ID gracza"
              value={playerIdToHire}
              onChange={(e) => setPlayerIdToHire(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowHireDialog(false)}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleHireMember}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Wyślij zaproszenie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote Dialog */}
      <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Zmień rangę członka</DialogTitle>
            <DialogDescription className="text-white/80">
              Zmień rangę dla {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedMember?.avatar}
                  alt={selectedMember?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{selectedMember?.name}</h3>
                  <p className="text-white/60 text-sm">Aktualna ranga: {selectedMember?.rank}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/80">Nowa ranga:</label>
                <select className="w-full bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white">
                  <option value="1">CZŁONEK (1)</option>
                  <option value="2">CZŁONEK (2)</option>
                  <option value="3">STARSZY CZŁONEK (3)</option>
                  <option value="4">STARSZY CZŁONEK (4)</option>
                  <option value="5">ZASTĘPCA (5)</option>
                  <option value="6">ZASTĘPCA (6)</option>
                  <option value="7">SZEF (7)</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPromoteDialog(false)}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Anuluj
            </Button>
            <Button
              onClick={handlePromoteMember}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Awansuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fire Dialog */}
      <AlertDialog open={showFireDialog} onOpenChange={setShowFireDialog}>
        <AlertDialogContent className="bg-gray-900 border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Wyrzuć członka</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Czy na pewno chcesz wyrzucić {selectedMember?.name} z organizacji? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMember?.avatar}
                  alt={selectedMember?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-red-400">{selectedMember?.name}</h3>
                  <p className="text-white/60 text-sm">ID: {selectedMember?.id}</p>
                  <p className="text-white/60 text-sm">Ranga: {selectedMember?.rank}</p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFireMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Wyrzuć
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MembersApp;
