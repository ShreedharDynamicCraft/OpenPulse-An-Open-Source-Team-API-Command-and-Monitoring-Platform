"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { generateTestCases, saveGeneratedTests } from "../actions/test-generation";
import type { GeneratedTest } from "../actions/test-generation";
import { toast } from "sonner";

interface TestGeneratorDialogProps {
  workspaceId: string;
  collectionId: string;
  collectionName: string;
  trigger?: React.ReactNode;
}

export function TestGeneratorDialog({
  workspaceId,
  collectionId,
  collectionName,
  trigger,
}: TestGeneratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<GeneratedTest[]>([]);

  // Form state
  const [numberOfTests, setNumberOfTests] = useState(10);
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [description, setDescription] = useState("");
  const [testTypes, setTestTypes] = useState<string[]>([
    "happy_path",
    "edge_case",
    "error_case",
  ]);

  const queryClient = useQueryClient();

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedTests([]);

    try {
      const tests = await generateTestCases({
        workspaceId,
        collectionId,
        apiContext: {
          endpoint,
          method,
          description,
        },
        numberOfTests,
        testTypes: testTypes.length > 0 ? testTypes : undefined,
      });

      setGeneratedTests(tests);
      toast.success(`Generated ${tests.length} test cases!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate test cases");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTests = async () => {
    if (generatedTests.length === 0) return;

    setSaving(true);

    try {
      const result = await saveGeneratedTests(
        workspaceId,
        collectionId,
        generatedTests
      );

      toast.success(`Saved ${result.createdCount} test cases to collection!`);
      
      // Refresh collections
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      setOpen(false);
      setGeneratedTests([]);
      setEndpoint("");
      setDescription("");
    } catch (error: any) {
      toast.error(error.message || "Failed to save test cases");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTestType = (type: string) => {
    setTestTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const testTypeOptions = [
    { value: "happy_path", label: "✅ Happy Path", color: "text-green-600" },
    { value: "edge_case", label: "⚠️ Edge Cases", color: "text-yellow-600" },
    { value: "error_case", label: "❌ Error Cases", color: "text-red-600" },
    { value: "security", label: "🔒 Security Tests", color: "text-purple-600" },
    { value: "performance", label: "⚡ Performance Tests", color: "text-blue-600" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate Tests
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Test Case Generator
          </DialogTitle>
          <DialogDescription>
            Let Gemini AI generate comprehensive test cases for &quot;{collectionName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto space-y-6 py-4">
          {/* Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfTests">Number of Test Cases</Label>
              <Input
                id="numberOfTests"
                type="number"
                value={numberOfTests}
                onChange={(e) => setNumberOfTests(Number(e.target.value))}
                min={1}
                max={50}
                disabled={generating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={generating}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">API Endpoint (Optional)</Label>
            <Input
              id="endpoint"
              placeholder="https://api.example.com/users"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              disabled={generating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this API does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={generating}
              rows={3}
            />
          </div>

          {/* Test Types */}
          <div className="space-y-2">
            <Label>Test Types to Include</Label>
            <div className="flex flex-wrap gap-3">
              {testTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={testTypes.includes(option.value)}
                    onCheckedChange={() => toggleTestType(option.value)}
                    disabled={generating}
                  />
                  <label
                    htmlFor={option.value}
                    className={`text-sm font-medium cursor-pointer ${option.color}`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Tests Preview */}
          {generatedTests.length > 0 && (
            <div className="space-y-2">
              <Label>Generated Test Cases ({generatedTests.length})</Label>
              <ScrollArea className="h-64 border rounded-lg">
                <div className="p-4 space-y-3">
                  {generatedTests.map((test, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg bg-muted/50 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs rounded font-medium ${
                                test.method === "GET"
                                  ? "bg-green-500/20 text-green-600"
                                  : test.method === "POST"
                                  ? "bg-blue-500/20 text-blue-600"
                                  : test.method === "PUT"
                                  ? "bg-yellow-500/20 text-yellow-600"
                                  : test.method === "DELETE"
                                  ? "bg-red-500/20 text-red-600"
                                  : "bg-orange-500/20 text-orange-600"
                              }`}
                            >
                              {test.method}
                            </span>
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {test.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {test.url}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            test.testType === "happy_path"
                              ? "bg-green-100 text-green-700"
                              : test.testType === "edge_case"
                              ? "bg-yellow-100 text-yellow-700"
                              : test.testType === "error_case"
                              ? "bg-red-100 text-red-700"
                              : test.testType === "security"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {test.testType.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {generatedTests.length > 0 && (
              <Button onClick={handleSaveTests} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save to Collection
                  </>
                )}
              </Button>
            )}
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Tests
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
