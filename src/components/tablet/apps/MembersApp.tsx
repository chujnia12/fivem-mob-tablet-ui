
import React, { useState } from 'react';
import { ArrowLeft, Search, Users, UserPlus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface MembersAppProps {
  orgData: {
    name: string;
  };
  onHome: () => void;
}

const MembersApp: React.FC<MembersAppProps> = ({ orgData, onHome }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      name: 'Braian Brown',
      id: '2050876582',
      rank: 'STARSZY CZŁONEK',
      status: 'online',
      avatar: 'B'
    },
    {
      name: 'Rudolph Rudi',
      id: '9079340077',
      rank: 'SZEF',
      status: 'online',
      avatar: 'R'
    },
    {
      name: 'josee carterr',
      id: '4806755054',
      rank: 'CZŁONEK',
      status: 'offline',
      avatar: 'J'
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Zarządzanie Członkami</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus size={16} className="mr-2" />
          ZATRUDNIJ
        </Button>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Szukaj członka..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
                  member.status === 'online' ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {member.avatar}
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{member.id}</p>
                <div className={`inline-block px-3 py-1 rounded text-xs font-semibold mb-4 ${
                  member.rank === 'SZEF' ? 'bg-red-600 text-white' :
                  member.rank === 'STARSZY CZŁONEK' ? 'bg-orange-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {member.rank}
                </div>
                <div className={`w-full py-2 rounded font-semibold ${
                  member.status === 'online' 
                    ? 'bg-green-600/20 text-green-400 border border-green-600' 
                    : 'bg-red-600/20 text-red-400 border border-red-600'
                }`}>
                  {member.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersApp;
