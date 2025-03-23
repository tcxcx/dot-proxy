"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Server, 
  Copy, 
  CheckCircle 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SelfHostingGuide() {
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle>Self-Hosting Guide</CardTitle>
        </div>
        <CardDescription>
          How to run your own instance of DOT Proxy Gov
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="docker">
          <TabsList>
            <TabsTrigger value="docker">Docker</TabsTrigger>
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
            <TabsTrigger value="vercel">Vercel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="docker" className="space-y-4 mt-4">
            <p>
              Docker provides the easiest way to self-host the application. 
              You&apos;ll get all components (database, indexer, and UI) running together with minimal setup.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Prerequisites</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Docker and Docker Compose installed</li>
                <li>Git to clone the repository</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Steps</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Clone the repository:
                  <div className="relative mt-2 bg-muted rounded-md p-2">
                    <code className="text-sm">git clone https://github.com/yourusername/dot-proxy-gov.git</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1.5 h-6 w-6"
                      onClick={() => copyToClipboard("git clone https://github.com/yourusername/dot-proxy-gov.git", "docker-1")}
                    >
                      {copied === "docker-1" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
                <li>
                  Navigate to the project directory:
                  <div className="relative mt-2 bg-muted rounded-md p-2">
                    <code className="text-sm">cd dot-proxy-gov</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1.5 h-6 w-6"
                      onClick={() => copyToClipboard("cd dot-proxy-gov", "docker-2")}
                    >
                      {copied === "docker-2" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
                <li>
                  Start all services using Docker Compose:
                  <div className="relative mt-2 bg-muted rounded-md p-2">
                    <code className="text-sm">docker compose up -d</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1.5 h-6 w-6"
                      onClick={() => copyToClipboard("docker compose up -d", "docker-3")}
                    >
                      {copied === "docker-3" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
              </ol>
            </div>
            
            <p>
              Visit <span className="font-medium">http://localhost:3000</span> to access your local instance.
            </p>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <p>
              If you prefer more control over individual components or want to customize the setup, you can run each component manually.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Prerequisites</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Node.js (v16 or later)</li>
                <li>PostgreSQL database</li>
                <li>Git to clone the repository</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Steps</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Clone the repository:
                  <div className="relative mt-2 bg-muted rounded-md p-2">
                    <code className="text-sm">git clone https://github.com/yourusername/dot-proxy-gov.git</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1.5 h-6 w-6"
                      onClick={() => copyToClipboard("git clone https://github.com/yourusername/dot-proxy-gov.git", "manual-1")}
                    >
                      {copied === "manual-1" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
                <li>
                  Set up and start each component following the README instructions
                </li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="vercel" className="space-y-4 mt-4">
            <p>
              You can deploy just the UI component to Vercel while self-hosting the database and squid indexer.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Steps</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fork the repository on GitHub</li>
                <li>Connect your Vercel account to your GitHub repository</li>
                <li>Set the <code>NEXT_PUBLIC_SQUID_URL</code> environment variable to point to your self-hosted squid GraphQL endpoint</li>
                <li>Deploy the project from the Vercel dashboard</li>
              </ol>
            </div>
            
            <p className="font-medium">
              Note: You&apos;ll still need to self-host the database and squid indexer components.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 