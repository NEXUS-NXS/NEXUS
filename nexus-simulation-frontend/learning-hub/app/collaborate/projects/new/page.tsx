"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CalendarIcon, Plus, X, Search, FileText, BarChart, Database, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export default function NewProjectPage() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [searchMember, setSearchMember] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    description: "",
    category: "",
    privacy: "private",
    template: "",
  })

  const availableMembers = [
    { id: "1", name: "Sarah Chen", role: "Senior Actuary", email: "sarah.chen@example.com" },
    { id: "2", name: "Michael Johnson", role: "Data Scientist", email: "michael.johnson@example.com" },
    { id: "3", name: "Emily Rodriguez", role: "Risk Analyst", email: "emily.rodriguez@example.com" },
    { id: "4", name: "David Kim", role: "Actuary", email: "david.kim@example.com" },
    { id: "5", name: "Lisa Wong", role: "Compliance Officer", email: "lisa.wong@example.com" },
    { id: "6", name: "Robert Taylor", role: "Legal Advisor", email: "robert.taylor@example.com" },
  ]

  const projectTemplates = [
    {
      id: "ifrs17",
      name: "IFRS 17 Implementation",
      description: "Template for IFRS 17 compliance projects with standard milestones and tasks",
      icon: FileText,
      category: "Regulatory",
    },
    {
      id: "pricing",
      name: "Product Pricing Analysis",
      description: "Framework for analyzing and developing pricing strategies for insurance products",
      icon: BarChart,
      category: "Pricing",
    },
    {
      id: "risk-modeling",
      name: "Risk Modeling Project",
      description: "Template for building and validating risk models with standard workflows",
      icon: Database,
      category: "Risk Management",
    },
    {
      id: "blank",
      name: "Blank Project",
      description: "Start from scratch with a clean project structure",
      icon: Plus,
      category: "Custom",
    },
  ]

  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      member.email.toLowerCase().includes(searchMember.toLowerCase()),
  )

  const addMember = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId])
    }
  }

  const removeMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
  }

  const getSelectedMemberDetails = () => {
    return availableMembers.filter((member) => selectedMembers.includes(member.id))
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href="/collaborate" className="text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            Back to Collaborate
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">Start a new collaborative project with your team</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="template">Choose Template</TabsTrigger>
                <TabsTrigger value="team">Add Team Members</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                    <CardDescription>Provide basic information about your project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter project name"
                          value={projectInfo.name}
                          onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the project objectives, scope, and expected outcomes"
                          rows={4}
                          value={projectInfo.description}
                          onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={projectInfo.category}
                            onValueChange={(value) => setProjectInfo({ ...projectInfo, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                              <SelectItem value="pricing">Product Pricing</SelectItem>
                              <SelectItem value="risk">Risk Management</SelectItem>
                              <SelectItem value="modeling">Actuarial Modeling</SelectItem>
                              <SelectItem value="research">Research & Development</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="privacy">Privacy</Label>
                          <Select
                            value={projectInfo.privacy}
                            onValueChange={(value) => setProjectInfo({ ...projectInfo, privacy: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private - Invite only</SelectItem>
                              <SelectItem value="internal">Internal - Company members</SelectItem>
                              <SelectItem value="public">Public - Anyone can view</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="template" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Project Template</CardTitle>
                    <CardDescription>
                      Select a template to get started quickly with predefined structure and tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {projectTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                            projectInfo.template === template.id
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-muted-foreground/25"
                          }`}
                          onClick={() => setProjectInfo({ ...projectInfo, template: template.id })}
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-md bg-primary/10 p-2">
                              <template.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{template.name}</h3>
                                {projectInfo.template === template.id && (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                              <Badge variant="outline" className="mt-2">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Team Members</CardTitle>
                    <CardDescription>Invite colleagues to collaborate on this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <Label>Search Members</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by name or email"
                            value={searchMember}
                            onChange={(e) => setSearchMember(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      {searchMember && (
                        <div className="rounded-md border">
                          <div className="p-2">
                            <p className="text-sm font-medium mb-2">Available Members</p>
                            {filteredMembers.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addMember(member.id)}
                                  disabled={selectedMembers.includes(member.id)}
                                >
                                  {selectedMembers.includes(member.id) ? "Added" : "Add"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedMembers.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-3">Selected Team Members ({selectedMembers.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {getSelectedMemberDetails().map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-2 bg-muted rounded-full pl-2 pr-3 py-1"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{member.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={() => removeMember(member.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>Set the start and end dates for your project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Pick start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Pick end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {startDate && endDate && (
                      <div className="mt-6 p-4 bg-muted/50 rounded-md">
                        <p className="text-sm">
                          <strong>Project Duration:</strong>{" "}
                          {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))} days
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{projectInfo.name || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium">{projectInfo.category || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Privacy:</span>
                      <p className="font-medium capitalize">{projectInfo.privacy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Template:</span>
                      <p className="font-medium">
                        {projectTemplates.find((t) => t.id === projectInfo.template)?.name || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team Members:</span>
                      <p className="font-medium">{selectedMembers.length} selected</p>
                    </div>
                    {startDate && endDate && (
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">
                          {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))} days
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full">
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
