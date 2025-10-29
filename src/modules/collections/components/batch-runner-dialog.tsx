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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayIcon, DownloadIcon, FileTextIcon } from "lucide-react";
import { runCollectionBatch } from "../actions/batch-runner";
import {
  generatePDFReport,
  generateJSONReport,
  downloadPDF,
  downloadJSON,
  type ReportData,
} from "../utils/report-generator";
import { toast } from "sonner";

interface BatchRunnerDialogProps {
  workspaceId: string;
  collectionId: string;
  collectionName: string;
  trigger?: React.ReactNode;
}

interface TestResult {
  requestId: string;
  requestName: string;
  method: string;
  url: string;
  status: "success" | "failed" | "pending";
  statusCode?: number;
  responseTime?: number;
}

export function BatchRunnerDialog({
  workspaceId,
  collectionId,
  collectionName,
  trigger,
}: BatchRunnerDialogProps) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  // Options
  const [parallel, setParallel] = useState(false);
  const [stopOnError, setStopOnError] = useState(false);
  const [delay, setDelay] = useState(0);

  const queryClient = useQueryClient();

  const handleRunBatch = async () => {
    setRunning(true);
    setProgress(0);
    setResults([]);
    setTotalTime(0);

    const startTime = Date.now();

    try {
      const result = await runCollectionBatch(workspaceId, collectionId, {
        parallel,
        stopOnError,
        delay,
      });

      setResults(result.results);
      setProgress(100);
      setTotalTime(Date.now() - startTime);

      toast.success(
        `Batch completed: ${result.passedTests}/${result.totalTests} passed`
      );

      // Refresh activity logs
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    } catch (error) {
      toast.error("Failed to run batch tests");
      console.error(error);
    } finally {
      setRunning(false);
    }
  };

  const handleDownloadPDF = () => {
    if (results.length === 0) return;

    const reportData: ReportData = {
      collectionName,
      totalRequests: results.length,
      successCount: results.filter((r) => r.status === "success").length,
      failedCount: results.filter((r) => r.status === "failed").length,
      totalTime,
      averageTime: totalTime / results.length,
      timestamp: new Date().toLocaleString(),
      requests: results
        .filter((r) => r.status !== "pending")
        .map((r) => ({
          requestName: r.requestName,
          method: r.method,
          url: r.url,
          status: r.status as "success" | "failed",
          statusCode: r.statusCode || 0,
          responseTime: r.responseTime || 0,
        })),
    };

    const doc = generatePDFReport(reportData);
    downloadPDF(
      doc,
      `${collectionName.replace(/\s+/g, "_")}_report_${Date.now()}.pdf`
    );
    toast.success("PDF report downloaded");
  };

  const handleDownloadJSON = () => {
    if (results.length === 0) return;

    const reportData: ReportData = {
      collectionName,
      totalRequests: results.length,
      successCount: results.filter((r) => r.status === "success").length,
      failedCount: results.filter((r) => r.status === "failed").length,
      totalTime,
      averageTime: totalTime / results.length,
      timestamp: new Date().toLocaleString(),
      requests: results
        .filter((r) => r.status !== "pending")
        .map((r) => ({
          requestName: r.requestName,
          method: r.method,
          url: r.url,
          status: r.status as "success" | "failed",
          statusCode: r.statusCode || 0,
          responseTime: r.responseTime || 0,
        })),
    };

    const jsonString = generateJSONReport(reportData);
    downloadJSON(
      jsonString,
      `${collectionName.replace(/\s+/g, "_")}_report_${Date.now()}.json`
    );
    toast.success("JSON report downloaded");
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <PlayIcon className="w-4 h-4 mr-2" />
            Run Batch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Batch Test Runner</DialogTitle>
          <DialogDescription>
            Run all requests in &quot;{collectionName}&quot; collection
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto space-y-4">
          {/* Options */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Options</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="parallel">Run in Parallel</Label>
              <Switch
                id="parallel"
                checked={parallel}
                onCheckedChange={setParallel}
                disabled={running}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="stopOnError">Stop on Error</Label>
              <Switch
                id="stopOnError"
                checked={stopOnError}
                onCheckedChange={setStopOnError}
                disabled={running}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay">Delay Between Requests (ms)</Label>
              <Input
                id="delay"
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                disabled={running}
                min={0}
                max={10000}
              />
            </div>
          </div>

          {/* Progress */}
          {running && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running tests...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold">{results.length}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Passed</div>
                  <div className="text-2xl font-bold text-green-600">
                    {successCount}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Failed</div>
                  <div className="text-2xl font-bold text-red-600">
                    {failedCount}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Time</div>
                  <div className="text-2xl font-bold">{totalTime}ms</div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                >
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJSON}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>

              {/* Results List */}
              <ScrollArea className="h-64 border rounded-lg">
                <div className="p-4 space-y-2">
                  {results.map((result, idx) => (
                    <div
                      key={result.requestId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              result.status === "success"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {result.method}
                          </span>
                          <span className="font-medium">
                            {result.requestName}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {result.url}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div
                          className={`text-sm font-medium ${
                            result.status === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {result.statusCode || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.responseTime ? `${result.responseTime}ms` : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleRunBatch} disabled={running}>
            <PlayIcon className="w-4 h-4 mr-2" />
            {running ? "Running..." : "Start Batch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
