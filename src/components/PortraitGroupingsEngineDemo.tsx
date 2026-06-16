import React, { useState } from 'react';
import { WeddingData, SpecialGrouping, ReceptionPortrait } from '@/types/app';
import { generateAllPortraitGroupings, PortraitGrouping } from '@/lib/portraitGroupingsEngine';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PortraitGroupingsEngineComponentProps {
  weddingData: WeddingData;
}

const CATEGORY_COLORS: Record<string, string> = {
  'bride-and-bridesmaids': 'bg-pink-100 text-pink-800',
  'groom-and-groomsmen': 'bg-blue-100 text-blue-800',
  'family-groups': 'bg-green-100 text-green-800',
  'couple': 'bg-purple-100 text-purple-800',
  'mixed-groups': 'bg-yellow-100 text-yellow-800',
  'special-requests': 'bg-orange-100 text-orange-800',
  'reception-portraits': 'bg-red-100 text-red-800',
  'other': 'bg-gray-100 text-gray-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  'bride-and-bridesmaids': 'Bride & Bridesmaids',
  'groom-and-groomsmen': 'Groom & Groomsmen',
  'family-groups': 'Family Groups',
  'couple': 'Couple',
  'mixed-groups': 'Mixed Groups',
  'special-requests': 'Special Requests',
  'reception-portraits': 'Reception Portraits',
  'other': 'Other',
};

export default function PortraitGroupingsEngineComponent({
  weddingData,
}: PortraitGroupingsEngineComponentProps) {
  const [groupings, setGroupings] = useState<PortraitGrouping[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    const generated = generateAllPortraitGroupings(weddingData);
    setGroupings(generated);
    setIsGenerated(true);
  };

  const groupedByCategory = groupings.reduce(
    (acc, grouping) => {
      if (!acc[grouping.category]) {
        acc[grouping.category] = [];
      }
      acc[grouping.category].push(grouping);
      return acc;
    },
    {} as Record<string, PortraitGrouping[]>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold" style={{ color: '#C4837A' }}>
          Portrait Groupings AI Engine
        </h1>
        <p className="text-gray-600">
          Automatically generates professional portrait groupings based on wedding party data
        </p>

        {!isGenerated ? (
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C4837A' }}
          >
            Generate Portrait Groupings
          </button>
        ) : (
          <div className="text-sm text-gray-600">
            Generated {groupings.length} portrait groupings
          </div>
        )}
      </div>

      {isGenerated && groupings.length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupedByCategory)
            .sort(([a], [b]) => {
              const order = [
                'bride-and-bridesmaids',
                'groom-and-groomsmen',
                'couple',
                'family-groups',
                'mixed-groups',
                'special-requests',
                'reception-portraits',
              ];
              return order.indexOf(a) - order.indexOf(b);
            })
            .map(([category, categoryGroupings]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold" style={{ color: '#2A2420' }}>
                    {CATEGORY_LABELS[category] || category}
                  </h2>
                  <Badge className="ml-auto">{categoryGroupings.length}</Badge>
                </div>
                <div className="space-y-2">
                  {categoryGroupings.map((grouping) => (
                    <Card
                      key={grouping.id}
                      className="p-4 border-l-4"
                      style={{ borderLeftColor: '#C4837A' }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-medium" style={{ color: '#2A2420' }}>
                            {grouping.description}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`whitespace-nowrap ${CATEGORY_COLORS[category]}`}
                          >
                            {grouping.people.length} people
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {grouping.people.map((person) => (
                            <Badge
                              key={person.id}
                              variant="outline"
                              className="bg-gray-50"
                            >
                              <span className="font-medium">{person.name}</span>
                              {person.relationship && (
                                <span className="ml-1 text-xs opacity-70">
                                  ({person.relationship})
                                </span>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {grouping.notes && (
                          <p className="text-xs text-gray-500 italic mt-2">
                            {grouping.notes}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {isGenerated && groupings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            No groupings generated. Please fill in the wedding data and try again.
          </p>
        </Card>
      )}
    </div>
  );
}
