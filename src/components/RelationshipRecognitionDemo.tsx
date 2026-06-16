import React, { useState } from 'react';
import { Person } from '@/types/app';
import { RelationshipRecognizer } from '@/lib/relationshipRecognition';
import {
  formatPortraitGrouping,
  analyzeGrouping,
  deduplicatePeople,
} from '@/lib/portraitGroupingUtils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Demo component showing relationship recognition and duplicate prevention
 */
export const RelationshipRecognitionDemo: React.FC = () => {
  const [groupMembers, setGroupMembers] = useState<Person[]>([
    { id: '1', name: 'Elizabeth', relationship: 'Bride' },
    { id: '2', name: 'Tim', relationship: 'Groom' },
    { id: '3', name: 'Steve', relationship: 'Father of Bride' },
    { id: '4', name: 'Diana', relationship: 'Mother of Bride' },
  ]);

  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('');

  const handleAddPerson = () => {
    if (newPersonName.trim() && newPersonRole.trim()) {
      setGroupMembers([
        ...groupMembers,
        {
          id: `person-${Date.now()}`,
          name: newPersonName.trim(),
          relationship: newPersonRole.trim(),
        },
      ]);
      setNewPersonName('');
      setNewPersonRole('');
    }
  };

  const handleRemovePerson = (id: string) => {
    setGroupMembers(groupMembers.filter((p) => p.id !== id));
  };

  const deduplicatedMembers = deduplicatePeople(groupMembers);
  const grouping = analyzeGrouping(deduplicatedMembers);

  return (
    <div className="w-full space-y-6 p-8 bg-gradient-to-br from-[#FAF6F0] to-[#F5F0EA]">
      <div>
        <h2 className="text-2xl font-bold text-[#2A2420] mb-2">
          Relationship Recognition & Duplicate Prevention
        </h2>
        <p className="text-[#6B6159] mb-6">
          Add family members and watch the system recognize their relationships and prevent
          duplicates.
        </p>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-md p-6 bg-white">
        <h3 className="font-semibold text-[#2A2420] mb-4">Add Person</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Name (e.g., Katie Soost)"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
              className="flex-1 border-[#E8DFCF] focus:border-[#C4837A]"
            />
            <Input
              placeholder="Relationship (e.g., Sister of Bride, Bridesmaid)"
              value={newPersonRole}
              onChange={(e) => setNewPersonRole(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
              className="flex-1 border-[#E8DFCF] focus:border-[#C4837A]"
            />
            <Button
              onClick={handleAddPerson}
              className="bg-[#C4837A] hover:bg-[#B37269] text-white"
            >
              Add
            </Button>
          </div>
        </div>
      </Card>

      {/* People List with Recognition */}
      <Card className="border-0 shadow-md p-6 bg-white">
        <h3 className="font-semibold text-[#2A2420] mb-4">Portrait Members</h3>
        <div className="space-y-3">
          {groupMembers.length === 0 ? (
            <p className="text-[#9B8E7F]">No members added yet</p>
          ) : (
            groupMembers.map((person) => {
              const recognition = RelationshipRecognizer.recognize(
                person.relationship
              );
              const isDuplicate = deduplicatedMembers.every(
                (p) => p.id !== person.id
              );

              return (
                <div
                  key={person.id}
                  className={`p-4 rounded-lg border-l-4 flex items-start justify-between ${
                    isDuplicate
                      ? 'bg-red-50 border-red-300'
                      : 'bg-[#FDF9F3] border-[#C4837A]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-[#2A2420]">
                      {person.name}
                      {isDuplicate && (
                        <Badge className="ml-2 bg-red-200 text-red-700">
                          Duplicate
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-[#6B6159] mt-1">
                      <div className="font-semibold text-[#C4837A]">
                        Recognized Type: {recognition.displayLabel}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recognition.relationships.map((rel) => (
                          <Badge
                            key={rel}
                            variant="outline"
                            className="border-[#C9A96E] text-[#C4837A]"
                          >
                            {RelationshipRecognizer.formatLabel(rel)}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2">
                        <span className="text-xs font-semibold text-[#9B8E7F]">
                          Family Side:
                        </span>
                        <Badge className="ml-2 bg-[#C9A96E] text-white text-xs">
                          {recognition.familySide}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemovePerson(person.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Portrait Grouping Output */}
      <Card className="border-0 shadow-md p-6 bg-white border-l-4 border-[#C4837A]">
        <h3 className="font-semibold text-[#2A2420] mb-4">Formatted Portrait Grouping</h3>
        <div className="bg-[#FDF9F3] p-4 rounded font-mono text-sm text-[#2A2420] break-words">
          {grouping.summary || '(No members)'}
        </div>
      </Card>

      {/* Grouping Breakdown */}
      <Card className="border-0 shadow-md p-6 bg-white">
        <h3 className="font-semibold text-[#2A2420] mb-4">Grouping Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#FDF9F3] rounded">
            <div className="text-xs font-semibold text-[#9B8E7F] uppercase tracking-wider mb-1">
              Total Count
            </div>
            <div className="text-3xl font-bold text-[#C4837A]">{grouping.totalCount}</div>
          </div>
          <div className="p-4 bg-[#FDF9F3] rounded">
            <div className="text-xs font-semibold text-[#9B8E7F] uppercase tracking-wider mb-2">
              Members
            </div>
            <div className="space-y-1">
              {grouping.people.map((person, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm text-[#2A2420]"
                >
                  <span className="font-medium">{person.name}</span>
                  <Badge variant="outline" className="border-[#C4837A] text-[#C4837A]">
                    {person.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Recognition Info */}
      <Card className="border-0 shadow-md p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">How Recognition Works</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            ✓ <strong>Multi-role detection:</strong> Katie as "Sister of Bride" + "Bridesmaid"
            is recognized correctly
          </li>
          <li>
            ✓ <strong>Natural language:</strong> "Maid of Honor", "Matron of Honor", "Best
            Man" all recognized
          </li>
          <li>✓ <strong>Family side awareness:</strong> Automatically categorizes as Bride or Groom side</li>
          <li>
            ✓ <strong>Duplicate prevention:</strong> Same person appears only once per grouping
          </li>
          <li>
            ✓ <strong>Extended relationships:</strong> Recognizes aunts, uncles, cousins,
            step-relations, grandparents
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default RelationshipRecognitionDemo;
