'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  options?: string[];
}

export interface CategoryTemplate {
  fields: TemplateField[];
}

interface CategoryTemplateBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryTemplateBuilder({ value, onChange }: CategoryTemplateBuilderProps) {
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [activeTab, setActiveTab] = useState<'builder' | 'json'>('builder');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Initialize fields from value prop
  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value) as CategoryTemplate;
        if (parsed.fields && Array.isArray(parsed.fields)) {
          setFields(parsed.fields);
          setJsonError(null);
        }
      } else {
        setFields([]);
      }
    } catch (e) {
      // If invalid JSON from raw input, just keep whatever fields we currently have
      setJsonError("Invalid JSON structure");
    }
  }, [value]);

  const updateParent = (newFields: TemplateField[]) => {
    const template: CategoryTemplate = { fields: newFields };
    onChange(JSON.stringify(template, null, 2));
  };

  const addField = () => {
    const newFields = [
      ...fields,
      { key: `field_${Date.now()}`, label: 'New Field', type: 'text' as const, required: false }
    ];
    setFields(newFields);
    updateParent(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    updateParent(newFields);
  };

  const updateField = (index: number, updates: Partial<TemplateField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
    updateParent(newFields);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'builder' | 'json')}>
        <TabsList className="grid w-full grid-cols-2 bg-secondary p-1 h-10 rounded-lg">
          <TabsTrigger value="builder" className="rounded-md font-bold text-xs">Visual Builder</TabsTrigger>
          <TabsTrigger value="json" className="rounded-md font-bold text-xs">Raw JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-4 mt-4">
          {fields.length === 0 ? (
             <div className="text-center p-8 bg-secondary/20 rounded-lg border border-border text-muted-foreground transition-colors">
                <p className="mb-4 text-sm font-medium">No custom fields defined for this category.</p>
                <Button type="button" variant="outline" onClick={addField} className="rounded-lg font-bold border-primary text-primary hover:bg-primary/10">
                  <Plus className="w-4 h-4 mr-2" /> Add First Field
                </Button>
             </div>
          ) : (
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {fields.map((field, idx) => (
                  <Card key={idx} className="p-3 border-muted-foreground/20 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] uppercase font-bold bg-secondary px-2 py-0.5 rounded-lg border border-border text-muted-foreground">Field {idx + 1}</span>
                       <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg" onClick={() => removeField(idx)}>
                          <Trash2 className="w-3.5 h-3.5" />
                       </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Label (Display Name)</Label>
                        <Input 
                           value={field.label} 
                           onChange={(e) => updateField(idx, { label: e.target.value })} 
                           placeholder="e.g. Mileage"
                           className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Key (Database ID)</Label>
                        <Input 
                           value={field.key} 
                           onChange={(e) => updateField(idx, { key: e.target.value.toLowerCase().replace(/\s+/g, '_') })} 
                           placeholder="e.g. mileage"
                           className="h-8 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 items-end">
                      <div className="space-y-1">
                        <Label className="text-xs">Input Type</Label>
                        <Select 
                           value={field.type} 
                           onValueChange={(v: any) => updateField(idx, { type: v })}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text (String)</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Dropdown (Select)</SelectItem>
                            <SelectItem value="checkbox">Checkbox (Boolean)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2 h-8 pb-1">
                        <Switch 
                           id={`req-${idx}`}
                           checked={field.required || false} 
                           onCheckedChange={(c) => updateField(idx, { required: c })} 
                        />
                        <Label htmlFor={`req-${idx}`} className="text-xs cursor-pointer">Required field</Label>
                      </div>
                    </div>

                    {field.type === 'select' && (
                      <div className="space-y-1 pt-2 border-t border-border mt-2">
                        <Label className="text-xs text-primary">Dropdown Options (comma separated)</Label>
                        <Input 
                           value={field.options?.join(', ') || ''} 
                           onChange={(e) => updateField(idx, { 
                             options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                           })} 
                           placeholder="e.g. Automatic, Manual, Tiptronic"
                           className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </Card>
                ))}
                
                <Button type="button" variant="outline" className="w-full mt-2 rounded-lg font-bold border-primary text-primary hover:bg-primary/10 transition-colors" onClick={addField}>
                  <Plus className="w-4 h-4 mr-2" /> Add Field
                </Button>
             </div>
          )}
        </TabsContent>

        <TabsContent value="json">
          {jsonError && <p className="text-xs text-destructive mb-2">{jsonError}</p>}
          <Textarea 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-xs h-[300px]"
            placeholder={'{\n  "fields": []\n}'}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
