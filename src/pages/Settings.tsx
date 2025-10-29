import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Settings = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.7]);
  const [retrievedChunks, setRetrievedChunks] = useState([5]);
  const [sourceCitations, setSourceCitations] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>RAG Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Confidence Threshold</Label>
              <span className="text-sm font-semibold">{confidenceThreshold[0].toFixed(2)}</span>
            </div>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              min={0.5}
              max={1.0}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Minimum confidence score required for responses (0.5 - 1.0)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Number of Retrieved Chunks</Label>
              <span className="text-sm font-semibold">{retrievedChunks[0]}</span>
            </div>
            <Slider
              value={retrievedChunks}
              onValueChange={setRetrievedChunks}
              min={3}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How many document chunks to retrieve per query
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <Label>Enable Source Citations</Label>
              <p className="text-xs text-muted-foreground">
                Show document sources in responses
              </p>
            </div>
            <Switch checked={sourceCitations} onCheckedChange={setSourceCitations} />
          </div>

          <div className="space-y-3">
            <Label>Response Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Model Selection</Label>
            <Select defaultValue="llama">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel">
                <SelectItem value="llama">Llama 3.2</SelectItem>
                <SelectItem value="mistral">Mistral 7B</SelectItem>
                <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude">Claude 3 Opus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Hybrid Search</Label>
              <p className="text-xs text-muted-foreground">
                Combine semantic and keyword search
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-Reranking</Label>
              <p className="text-xs text-muted-foreground">
                Automatically rerank retrieved documents
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Query Expansion</Label>
              <p className="text-xs text-muted-foreground">
                Enhance queries with related terms
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave} className="gradient-primary">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
