"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Send,
  CheckCircle,
  FileText,
  TestTube,
  Shield,
  Loader2,
} from "lucide-react";
import {
  generateAPIDesign,
  improveAPIDesign,
  generateDocumentationFromDesign,
  validateAPIDesign,
  generateTestCases,
} from "../actions/ai-design";
import { toast } from "sonner";

interface AIDesignAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDesign?: (design: any) => void;
}

export function AIDesignAssistant({
  isOpen,
  onClose,
  onApplyDesign,
}: AIDesignAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedDesign, setGeneratedDesign] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [documentation, setDocumentation] = useState("");
  const [testCases, setTestCases] = useState<any>(null);

  const handleGenerateDesign = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a design requirement");
      return;
    }

    setLoading(true);
    try {
      const result = await generateAPIDesign(prompt);
      if (result.success) {
        setGeneratedDesign(result.data);
        toast.success("API design generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate design");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateDesign = async () => {
    if (!generatedDesign) {
      toast.error("Generate a design first");
      return;
    }

    setLoading(true);
    try {
      const result = await validateAPIDesign(JSON.stringify(generatedDesign));
      if (result.success) {
        setValidationResult(result.data);
        toast.success("Validation complete!");
      } else {
        toast.error(result.error || "Failed to validate design");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!generatedDesign) {
      toast.error("Generate a design first");
      return;
    }

    setLoading(true);
    try {
      const result = await generateDocumentationFromDesign(
        JSON.stringify(generatedDesign)
      );
      if (result.success && result.data) {
        setDocumentation(result.data);
        toast.success("Documentation generated!");
      } else {
        toast.error(result.error || "Failed to generate documentation");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTests = async (endpoint: string, method: string) => {
    setLoading(true);
    try {
      const result = await generateTestCases(endpoint, method);
      if (result.success) {
        setTestCases(result.data);
        toast.success("Test cases generated!");
      } else {
        toast.error(result.error || "Failed to generate test cases");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Design Assistant (Gemini 2.5 Flash)
          </DialogTitle>
          <DialogDescription>
            Generate, validate, and improve your API designs with AI
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="validate">Validate</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <Label>Describe your API requirements</Label>
              <Textarea
                placeholder="E.g., Create a RESTful API for an e-commerce platform with user authentication, product management, shopping cart, and payment processing..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={handleGenerateDesign}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate API Design
                </>
              )}
            </Button>

            {generatedDesign && (
              <Card className="p-4 mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {generatedDesign.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {generatedDesign.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Endpoints:</h4>
                  <div className="space-y-2">
                    {generatedDesign.endpoints?.map(
                      (endpoint: any, idx: number) => (
                        <Card key={idx} className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">
                              {endpoint.method}
                            </span>
                            <code className="text-sm">{endpoint.path}</code>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {endpoint.description}
                          </p>
                        </Card>
                      )
                    )}
                  </div>
                </div>

                {generatedDesign.architecture && (
                  <div>
                    <h4 className="font-medium mb-2">Architecture:</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Pattern:</strong>{" "}
                        {generatedDesign.architecture.pattern}
                      </p>
                      <p>
                        <strong>Components:</strong>{" "}
                        {generatedDesign.architecture.components?.join(", ")}
                      </p>
                      <p>
                        <strong>Database:</strong>{" "}
                        {generatedDesign.architecture.database}
                      </p>
                    </div>
                  </div>
                )}

                {onApplyDesign && (
                  <Button
                    onClick={() => {
                      onApplyDesign(generatedDesign);
                      toast.success("Design applied to canvas!");
                      onClose();
                    }}
                    className="w-full"
                  >
                    Apply to Canvas
                  </Button>
                )}
              </Card>
            )}
          </TabsContent>

          <TabsContent value="validate" className="space-y-4">
            <div className="text-center py-4">
              <Shield className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Validate your API design for security, performance, and best
                practices
              </p>
              <Button
                onClick={handleValidateDesign}
                disabled={loading || !generatedDesign}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validate Design
                  </>
                )}
              </Button>
            </div>

            {validationResult && (
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Validation Results</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-500">
                      {validationResult.score}
                    </span>
                    <span className="text-sm text-gray-600">/100</span>
                  </div>
                </div>

                {validationResult.issues && validationResult.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Issues:</h4>
                    <div className="space-y-2">
                      {validationResult.issues.map(
                        (issue: any, idx: number) => (
                          <Card
                            key={idx}
                            className={`p-3 border-l-4 ${
                              issue.severity === "critical"
                                ? "border-red-500"
                                : issue.severity === "warning"
                                ? "border-yellow-500"
                                : "border-blue-500"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  issue.severity === "critical"
                                    ? "bg-red-500 text-white"
                                    : issue.severity === "warning"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-blue-500 text-white"
                                }`}
                              >
                                {issue.severity}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {issue.message}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                )}

                {validationResult.strengths &&
                  validationResult.strengths.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">
                        Strengths:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {validationResult.strengths.map(
                          (strength: string, idx: number) => (
                            <li key={idx}>{strength}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </Card>
            )}
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <div className="text-center py-4">
              <FileText className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Generate comprehensive API documentation automatically
              </p>
              <Button
                onClick={handleGenerateDocs}
                disabled={loading || !generatedDesign}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Documentation
                  </>
                )}
              </Button>
            </div>

            {documentation && (
              <Card className="p-4">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto max-h-96">
                  {documentation}
                </pre>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(documentation);
                    toast.success("Documentation copied to clipboard!");
                  }}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Copy to Clipboard
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="text-center py-4">
              <TestTube className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Generate test cases for your API endpoints
              </p>

              {generatedDesign?.endpoints &&
                generatedDesign.endpoints.length > 0 && (
                  <div className="space-y-2">
                    {generatedDesign.endpoints.map(
                      (endpoint: any, idx: number) => (
                        <Button
                          key={idx}
                          onClick={() =>
                            handleGenerateTests(endpoint.path, endpoint.method)
                          }
                          disabled={loading}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded mr-2">
                            {endpoint.method}
                          </span>
                          {endpoint.path}
                        </Button>
                      )
                    )}
                  </div>
                )}
            </div>

            {testCases && (
              <Card className="p-4 space-y-4">
                <h3 className="font-semibold">Generated Test Cases:</h3>
                <div className="space-y-3">
                  {testCases.testCases?.map((test: any, idx: number) => (
                    <Card key={idx} className="p-3">
                      <h4 className="font-medium mb-2">{test.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {test.description}
                      </p>
                      <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-auto">
                        {JSON.stringify(test, null, 2)}
                      </pre>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
