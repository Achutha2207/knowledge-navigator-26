import { useState } from "react";
import { Upload, Search, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const documents = [
    {
      name: "Product Documentation v2.3",
      uploadDate: "2024-01-15",
      chunks: 342,
      lastAccessed: "2 hours ago",
      type: "Technical",
    },
    {
      name: "Legal Terms and Conditions",
      uploadDate: "2024-01-10",
      chunks: 128,
      lastAccessed: "5 hours ago",
      type: "Legal",
    },
    {
      name: "FAQ Collection",
      uploadDate: "2024-01-08",
      chunks: 87,
      lastAccessed: "1 day ago",
      type: "FAQ",
    },
    {
      name: "API Reference Guide",
      uploadDate: "2024-01-05",
      chunks: 456,
      lastAccessed: "3 days ago",
      type: "Technical",
    },
  ];

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = () => {
    toast.success("Document upload feature - Coming soon!");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <Button onClick={handleUpload} className="gradient-primary">
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>

      <div className="glass-panel rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Chunks</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.chunks.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.lastAccessed}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-panel">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
