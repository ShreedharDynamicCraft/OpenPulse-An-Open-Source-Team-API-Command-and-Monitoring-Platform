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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Loader2, AlertTriangle, Download, FileText } from "lucide-react";
import { runLoadTest } from "../actions/load-testing";
import type { LoadTestResult } from "../actions/load-testing";
import {
  generatePDFReport,
  generateJSONReport,
  downloadPDF,
  downloadJSON,
} from "../utils/report-generator";
import { toast } from "sonner";

interface LoadTestDialogProps {
  workspaceId: string;
  requestId: string;
  requestName: string;
  trigger?: React.ReactNode;
}

export function LoadTestDialog({
  workspaceId,
  requestId,
  requestName,
  trigger,
}: LoadTestDialogProps) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<LoadTestResult | null>(null);

  // Configuration
  const [numberOfRequests, setNumberOfRequests] = useState(100);
  const [concurrentUsers, setConcurrentUsers] = useState(10);
  const [rampUpTime, setRampUpTime] = useState(5000);
  const [delayBetweenRequests, setDelayBetweenRequests] = useState(0);

  const queryClient = useQueryClient();

  const handleRunLoadTest = async () => {
    setRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 95));
    }, 100);

    try {
      const testResult = await runLoadTest({
        workspaceId,
        requestId,
        numberOfRequests,
        concurrentUsers,
        rampUpTime,
        delayBetweenRequests,
      });

      setResult(testResult);
      setProgress(100);

      if (testResult.rateLimitDetected) {
        toast.warning(
          `Rate limiting detected! ${testResult.rateLimitInfo?.count} requests throttled.`
        );
      } else {
        toast.success(
          `Load test completed: ${testResult.successfulRequests}/${testResult.totalRequests} successful`
        );
      }

      // Refresh activity logs
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to run load test");
      console.error(error);
    } finally {
      clearInterval(progressInterval);
      setRunning(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    const reportData = {
      collectionName: requestName,
      totalRequests: result.totalRequests,
      successCount: result.successfulRequests,
      failedCount: result.failedRequests,
      totalTime: result.totalDuration,
      averageTime: result.averageResponseTime,
      timestamp: new Date().toLocaleString(),
      requests: result.results.map((r) => ({
        requestName: `Request #${r.requestNumber}`,
        method: "GET",
        url: requestName,
        status: r.status === "success" ? "success" as const : "failed" as const,
        statusCode: r.statusCode || 0,
        responseTime: r.responseTime,
      })),
      loadTestData: {
        requestsPerSecond: result.requestsPerSecond,
        minResponseTime: result.minResponseTime,
        maxResponseTime: result.maxResponseTime,
        rateLimitDetected: result.rateLimitDetected,
      },
    };

    const doc = generatePDFReport(reportData);
    downloadPDF(doc, `load_test_${requestName.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
    toast.success("PDF report downloaded");
  };

  const handleDownloadJSON = () => {
    if (!result) return;

    const jsonString = generateJSONReport(result as any);
    downloadJSON(jsonString, `load_test_${requestName.replace(/\s+/g, "_")}_${Date.now()}.json`);
    toast.success("JSON report downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Load Test
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Load Testing: {requestName}
          </DialogTitle>
          <DialogDescription>
            Stress test your API with configurable load and concurrency
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto space-y-6 py-4">
          {/* Configuration */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="numberOfRequests">
                Total Requests
                <span className="text-xs text-muted-foreground ml-2">
                  (1-1000)
                </span>
              </Label>
              <Input
                id="numberOfRequests"
                type="number"
                value={numberOfRequests}
                onChange={(e) => setNumberOfRequests(Number(e.target.value))}
                min={1}
                max={1000}
                disabled={running}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concurrentUsers">
                Concurrent Users
                <span className="text-xs text-muted-foreground ml-2">
                  (1-100)
                </span>
              </Label>
              <Input
                id="concurrentUsers"
                type="number"
                value={concurrentUsers}
                onChange={(e) => setConcurrentUsers(Number(e.target.value))}
                min={1}
                max={100}
                disabled={running}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rampUpTime">
                Ramp-up Time (ms)
                <span className="text-xs text-muted-foreground ml-2">
                  Gradual load increase
                </span>
              </Label>
              <Input
                id="rampUpTime"
                type="number"
                value={rampUpTime}
                onChange={(e) => setRampUpTime(Number(e.target.value))}
                min={0}
                max={60000}
                disabled={running}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delayBetweenRequests">
                Delay Between Requests (ms)
              </Label>
              <Input
                id="delayBetweenRequests"
                type="number"
                value={delayBetweenRequests}
                onChange={(e) =>
                  setDelayBetweenRequests(Number(e.target.value))
                }
                min={0}
                max={10000}
                disabled={running}
              />
            </div>
          </div>

          {/* Progress */}
          {running && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running load test...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Rate Limit Warning */}
              {result.rateLimitDetected && (
                <div className="p-4 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                        Rate Limiting Detected!
                      </h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                        Your API started rate limiting at request #
                        {result.rateLimitInfo?.firstDetectedAt}.{" "}
                        {result.rateLimitInfo?.count} requests were throttled.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold">{result.totalRequests}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Success</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.successfulRequests}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Failed</div>
                  <div className="text-2xl font-bold text-red-600">
                    {result.failedRequests}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Req/Sec</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.requestsPerSecond.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Response Time Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Min Response</div>
                  <div className="text-lg font-semibold">
                    {result.minResponseTime.toFixed(0)}ms
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className="text-lg font-semibold">
                    {result.averageResponseTime.toFixed(0)}ms
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Max Response</div>
                  <div className="text-lg font-semibold">
                    {result.maxResponseTime.toFixed(0)}ms
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>

              {/* Results Table (sample) */}
              <div>
                <h4 className="font-semibold mb-2">Sample Results (First 20)</h4>
                <ScrollArea className="h-40 border rounded-lg">
                  <div className="p-2 space-y-1">
                    {result.results.slice(0, 20).map((r) => (
                      <div
                        key={r.requestNumber}
                        className="flex items-center justify-between p-2 text-sm border-b"
                      >
                        <span>Request #{r.requestNumber}</span>
                        <span
                          className={
                            r.status === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {r.statusCode || "N/A"}
                        </span>
                        <span className="text-muted-foreground">
                          {r.responseTime.toFixed(0)}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleRunLoadTest} disabled={running}>
            {running ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Start Load Test
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
