import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseSmartImport, SmartImportResult } from '@/lib/smartImportParser';
import { AlertCircle, CheckCircle2, AlertTriangle, Copy, Download } from 'lucide-react';
import { WeddingData } from '@/types/app';

interface SmartImportProps {
  onImportSuccess?: (weddingData: Partial<WeddingData>) => void;
  onImportError?: (errors: string[]) => void;
}

export default function SmartImport({ onImportSuccess, onImportError }: SmartImportProps) {
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<SmartImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImport = () => {
    setIsProcessing(true);
    // Simulate processing delay for better UX
    setTimeout(() => {
      const parseResult = parseSmartImport(rawText);
      setResult(parseResult);

      if (parseResult.success && parseResult.weddingData) {
        onImportSuccess?.(parseResult.weddingData);
      } else {
        onImportError?.(parseResult.errors || ['Unknown error']);
      }

      setIsProcessing(false);
    }, 500);
  };

  const handleClearText = () => {
    setRawText('');
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-[#2A2420]" style={{ fontFamily: 'Fraunces' }}>
          Smart Import
        </h1>
        <p className="text-lg text-gray-600">
          Paste your couple's questionnaire information in any format. We'll intelligently parse it.
        </p>
      </div>

      {/* Input Section */}
      <Card className="border-2 border-[#C4837A]/20">
        <CardHeader>
          <CardTitle className="text-lg">Paste Questionnaire Data</CardTitle>
          <CardDescription>
            We accept bullet points, tables, paragraphs, emails, Google Forms, PDF text, or any format.
            <br />
            No formatting required — just paste as-is!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Example formats we support:

Bridesmaids
• Katie Soost - Maid of Honor
• Caroline Soost - Maid of Honor
• Rachel Leigon - Bridesmaid

Bride Family
Steve Soost - Father
Diana Soost - Mother

Requested Portraits
Bride and parents
Bride and sister

Or paste a Google Form response, email, table, PDF text... anything works!`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            className="font-mono text-sm resize-none"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={!rawText.trim() || isProcessing}
              className="flex-1 bg-[#C4837A] hover:bg-[#B37369] text-white"
            >
              {isProcessing ? 'Processing...' : '🚀 Smart Import'}
            </Button>
            <Button
              onClick={handleClearText}
              variant="outline"
              disabled={!rawText && !result}
              className="px-6"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {/* Status Alert */}
          {result.success ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✓ Successfully parsed your questionnaire! {result.weddingData && extractDataSummary(result.weddingData)}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-semibold mb-2">Couldn't parse the data:</div>
                <ul className="list-disc list-inside space-y-1">
                  {result.errors?.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="font-semibold mb-2">A few notes:</div>
                <ul className="list-disc list-inside space-y-1">
                  {result.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Extracted Data Preview */}
          {result.success && result.weddingData && (
            <Card className="border-2 border-[#C9A96E]/30 bg-[#FAF6F0]">
              <CardHeader>
                <CardTitle className="text-lg">📋 Extracted Data Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Couple Info */}
                {(result.weddingData.partner1FirstName || result.weddingData.partner2FirstName) && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">👰 The Couple</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Partner 1</p>
                        <p className="font-medium">
                          {result.weddingData.partner1FirstName} {result.weddingData.partner1LastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Partner 2</p>
                        <p className="font-medium">
                          {result.weddingData.partner2FirstName} {result.weddingData.partner2LastName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attendants */}
                {(result.weddingData.side1Attendants?.length || 0) > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">
                      💜 Side 1 Attendants ({result.weddingData.side1Attendants?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.weddingData.side1Attendants?.map((attendant) => (
                        <div key={attendant.id} className="text-sm p-2 bg-white rounded border border-gray-200">
                          <span className="font-medium">{attendant.name}</span>
                          <span className="text-gray-600"> — {attendant.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(result.weddingData.side2Attendants?.length || 0) > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">
                      💙 Side 2 Attendants ({result.weddingData.side2Attendants?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.weddingData.side2Attendants?.map((attendant) => (
                        <div key={attendant.id} className="text-sm p-2 bg-white rounded border border-gray-200">
                          <span className="font-medium">{attendant.name}</span>
                          <span className="text-gray-600"> — {attendant.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Family */}
                {(result.weddingData.partner1Family?.length || 0) > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">
                      👨‍👩‍👧 Partner 1 Family ({result.weddingData.partner1Family?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.weddingData.partner1Family?.map((member) => (
                        <div key={member.id} className="text-sm p-2 bg-white rounded border border-gray-200">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-gray-600"> — {member.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(result.weddingData.partner2Family?.length || 0) > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">
                      👨‍👩‍👧 Partner 2 Family ({result.weddingData.partner2Family?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.weddingData.partner2Family?.map((member) => (
                        <div key={member.id} className="text-sm p-2 bg-white rounded border border-gray-200">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-gray-600"> — {member.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portrait Requests */}
                {(result.weddingData.receptionPortraits?.length || 0) > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">
                      📸 Requested Portraits ({result.weddingData.receptionPortraits?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.weddingData.receptionPortraits?.map((portrait) => (
                        <div key={portrait.id} className="text-sm p-2 bg-white rounded border border-gray-200">
                          {portrait.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Groupings */}
                {(result.weddingData.specialGroupings?.length || 0) > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#C4837A] mb-2">
                      ✨ Special Groupings ({result.weddingData.specialGroupings?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.weddingData.specialGroupings?.map((grouping) => (
                        <div key={grouping.id} className="text-sm p-2 bg-white rounded border border-gray-200">
                          {grouping.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {result.success && result.weddingData && (
            <div className="flex gap-3">
              <Button className="flex-1 bg-[#C4837A] hover:bg-[#B37369] text-white" onClick={() => handleClearText()}>
                ← Start Over
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Button variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Format Examples */}
      {!result && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">💡 Supported Input Formats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">✓ Bullet Points</h4>
              <pre className="bg-white p-3 rounded text-xs font-mono border border-blue-200">
                {`Bridesmaids
• Katie - Maid of Honor
• Rachel - Bridesmaid`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">✓ Dashes</h4>
              <pre className="bg-white p-3 rounded text-xs font-mono border border-blue-200">
                {`- Katie - Maid of Honor
- Rachel - Bridesmaid`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">✓ Parentheses</h4>
              <pre className="bg-white p-3 rounded text-xs font-mono border border-blue-200">
                {`Katie Soost (Maid of Honor)
Rachel Leigon (Bridesmaid)`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">✓ Tables</h4>
              <pre className="bg-white p-3 rounded text-xs font-mono border border-blue-200">
                {`Name | Role
Katie | MOH
Rachel | Bridesmaid`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">✓ Paragraphs</h4>
              <pre className="bg-white p-3 rounded text-xs font-mono border border-blue-200">
                {`Katie Soost is the Maid
of Honor. Rachel Leigon
is a Bridesmaid.`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">✓ Mixed Formats</h4>
              <pre className="bg-white p-3 rounded text-xs font-mono border border-blue-200">
                {`From: couple@email.com
Katie - MOH
Family:
- Steve (Father)`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Create a summary of extracted data
 */
function extractDataSummary(weddingData: Partial<WeddingData>): string {
  const counts = [
    weddingData.side1Attendants?.length && `${weddingData.side1Attendants.length} attendants`,
    weddingData.partner1Family?.length && `${weddingData.partner1Family.length} family members`,
    weddingData.receptionPortraits?.length && `${weddingData.receptionPortraits.length} portrait requests`,
    weddingData.specialGroupings?.length && `${weddingData.specialGroupings.length} groupings`,
  ]
    .filter(Boolean)
    .join(', ');

  return counts ? `Found: ${counts}` : '';
}
