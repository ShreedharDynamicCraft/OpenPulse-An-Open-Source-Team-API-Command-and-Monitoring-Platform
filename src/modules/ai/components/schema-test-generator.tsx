"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileJson, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { useGenerateTestsFromSchema } from "../hooks/use-response-analysis";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SchemaTestGeneratorProps {
  workspaceId: string;
  collectionId?: string;
  onTestsGenerated?: (tests: any[]) => void;
}

export function SchemaTestGenerator({
  workspaceId,
  collectionId,
  onTestsGenerated,
}: SchemaTestGeneratorProps) {
  const [inputMethod, setInputMethod] = useState<"schema" | "response">("schema");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [schemaInput, setSchemaInput] = useState("");
  const [responseInput, setResponseInput] = useState("");
  const [numTests, setNumTests] = useState(10);
  const [copied, setCopied] = useState(false);

  const generateTests = useGenerateTestsFromSchema(workspaceId);

  const handleGenerate = () => {
    let schemaData;
    let responseData;

    try {
      if (inputMethod === "schema" && schemaInput) {
        schemaData = JSON.parse(schemaInput);
      }
      if (inputMethod === "response" && responseInput) {
        responseData = JSON.parse(responseInput);
      }
    } catch (error) {
      alert("Invalid JSON format. Please check your input.");
      return;
    }

    generateTests.mutate({
      endpoint: endpointUrl,
      method,
      responseSchema: inputMethod === "schema" ? schemaData : undefined,
      sampleResponse: inputMethod === "response" ? responseData : undefined,
      numberOfTests: numTests,
    });
  };

  const handleCopy = () => {
    if (generateTests.data && "content" in generateTests.data && generateTests.data.content) {
      navigator.clipboard.writeText(generateTests.data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1, maxLength: 100 },
      email: { type: "string", format: "email" },
      age: { type: "integer", minimum: 0, maximum: 120 },
      isActive: { type: "boolean" },
    },
    required: ["id", "name", "email"],
  };

  const sampleResponse = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    isActive: true,
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white">Schema-Based Test Generator</CardTitle>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
        <CardDescription className="text-gray-400">
          Automatically generate comprehensive API test cases from schemas or response examples
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Method Selection */}
        <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "schema" | "response")}>
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger
              value="schema"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              JSON Schema
            </TabsTrigger>
            <TabsTrigger
              value="response"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Response Example
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schema" className="space-y-4">
            <div>
              <Label htmlFor="schema-input" className="text-white">
                JSON Schema (OpenAPI/JSON Schema format)
              </Label>
              <Textarea
                id="schema-input"
                value={schemaInput}
                onChange={(e) => setSchemaInput(e.target.value)}
                placeholder={JSON.stringify(sampleSchema, null, 2)}
                className="mt-2 min-h-[200px] bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                Paste your JSON Schema definition here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="response" className="space-y-4">
            <div>
              <Label htmlFor="response-input" className="text-white">
                Response Example
              </Label>
              <Textarea
                id="response-input"
                value={responseInput}
                onChange={(e) => setResponseInput(e.target.value)}
                placeholder={JSON.stringify(sampleResponse, null, 2)}
                className="mt-2 min-h-[200px] bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                Paste a sample API response here
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Endpoint Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="method" className="text-white">
              Method
            </Label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-2 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="endpoint-url" className="text-white">
              Endpoint URL
            </Label>
            <Input
              id="endpoint-url"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://api.example.com/users"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        {/* Number of Tests */}
        <div>
          <Label htmlFor="num-tests" className="text-white">
            Number of Tests to Generate (1-50)
          </Label>
          <Input
            id="num-tests"
            type="number"
            min={1}
            max={50}
            value={numTests}
            onChange={(e) => setNumTests(parseInt(e.target.value) || 10)}
            className="mt-2 bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={
            generateTests.isPending ||
            !endpointUrl ||
            (inputMethod === "schema" ? !schemaInput : !responseInput)
          }
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {generateTests.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Test Cases...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Test Cases
            </>
          )}
        </Button>

        {/* Results */}
        {generateTests.data && generateTests.data.success && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Generated Test Cases</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {"content" in generateTests.data ? generateTests.data.content : ""}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {generateTests.isError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Failed to generate test cases. Please check your input and try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
