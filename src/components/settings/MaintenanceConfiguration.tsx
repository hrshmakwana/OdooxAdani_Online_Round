import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Tag, Clock, X, Plus } from 'lucide-react';

interface MaintenanceConfigProps {
  config: {
    autoAssignTeams: boolean;
    preventiveScheduling: boolean;
    failureCategories: string[];
    criticalResponseTime: string;
    standardResponseTime: string;
  };
  onConfigChange: (key: string, value: string | boolean | string[]) => void;
}

export function MaintenanceConfiguration({ config, onConfigChange }: MaintenanceConfigProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !config.failureCategories.includes(newTag.trim())) {
      onConfigChange('failureCategories', [...config.failureCategories, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onConfigChange('failureCategories', config.failureCategories.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Rules */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg">Automation Rules</CardTitle>
              <CardDescription>Configure intelligent automation for maintenance workflows</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Auto-Assign Teams</Label>
              <p className="text-sm text-muted-foreground">
                Automatically assign tickets based on equipment category
              </p>
            </div>
            <Switch
              checked={config.autoAssignTeams}
              onCheckedChange={(checked) => onConfigChange('autoAssignTeams', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Preventive Scheduling</Label>
              <p className="text-sm text-muted-foreground">
                Allow system to auto-generate recurrence tickets
              </p>
            </div>
            <Switch
              checked={config.preventiveScheduling}
              onCheckedChange={(checked) => onConfigChange('preventiveScheduling', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Failure Categories */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Tag className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">Defined Failure Types</CardTitle>
              <CardDescription>Categories available when creating maintenance tickets</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {config.failureCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {category}
                <button
                  onClick={() => handleRemoveTag(category)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add new failure type..."
              className="flex-1"
            />
            <Button onClick={handleAddTag} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SLA Policies */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-lg">SLA Policies</CardTitle>
              <CardDescription>Define response time requirements by priority level</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="criticalTime" className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive"></span>
                Critical Priority Response Time
              </Label>
              <Input
                id="criticalTime"
                value={config.criticalResponseTime}
                onChange={(e) => onConfigChange('criticalResponseTime', e.target.value)}
                placeholder="e.g., 2 Hours"
              />
              <p className="text-xs text-muted-foreground">Tickets marked as "Critical" breach SLA after this time</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="standardTime" className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                Standard Priority Response Time
              </Label>
              <Input
                id="standardTime"
                value={config.standardResponseTime}
                onChange={(e) => onConfigChange('standardResponseTime', e.target.value)}
                placeholder="e.g., 24 Hours"
              />
              <p className="text-xs text-muted-foreground">Default SLA for medium and low priority tickets</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
