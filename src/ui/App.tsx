
import { useState } from "react"
import { Plus, Users, ArrowLeft, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface CustomField {
  id: string
  name: string
}

interface Group {
  id: string
  name: string
  customFields: CustomField[]
  entries: Record<string, any>[]
}

interface GroupEntry {
  [key: string]: string
}

export default function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [currentView, setCurrentView] = useState<"home" | "group" | "entry">("home")

  // Group creation state
  const [newGroupName, setNewGroupName] = useState("")
  const [newCustomFields, setNewCustomFields] = useState<CustomField[]>([])
  const [newFieldName, setNewFieldName] = useState("")

  // Entry creation state
  const [newEntry, setNewEntry] = useState<GroupEntry>({})

  const addCustomField = () => {
    if (newFieldName.trim()) {
      const newField: CustomField = {
        id: Date.now().toString(),
        name: newFieldName.trim(),
      }
      setNewCustomFields([...newCustomFields, newField])
      setNewFieldName("")
    }
  }

  const removeCustomField = (fieldId: string) => {
    setNewCustomFields(newCustomFields.filter((field) => field.id !== fieldId))
  }

  const createGroup = () => {
    if (newGroupName.trim() && newCustomFields.length > 0) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        customFields: newCustomFields,
        entries: [],
      }
      setGroups([...groups, newGroup])

      // Reset form
      setNewGroupName("")
      setNewCustomFields([])
      setIsCreateModalOpen(false)
    }
  }

  const openGroup = (group: Group) => {
    setSelectedGroup(group)
    setCurrentView("group")
  }

  const openEntryForm = () => {
    if (selectedGroup) {
      const initialEntry: GroupEntry = {}
      selectedGroup.customFields.forEach((field) => {
        initialEntry[field.name] = ""
      })
      setNewEntry(initialEntry)
      setCurrentView("entry")
    }
  }

  const saveEntry = () => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        entries: [...selectedGroup.entries, newEntry],
      }
      setGroups(groups.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)))
      setSelectedGroup(updatedGroup)
      setNewEntry({})
      setCurrentView("group")
    }
  }

  const deleteEntry = (entryIndex: number) => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        entries: selectedGroup.entries.filter((_, index) => index !== entryIndex),
      }
      setGroups(groups.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)))
      setSelectedGroup(updatedGroup)
    }
  }

  const goHome = () => {
    setCurrentView("home")
    setSelectedGroup(null)
  }

  const goBackToGroup = () => {
    setCurrentView("group")
    setNewEntry({})
  }

  // Home View
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Group Manager</h1>
            <p className="text-slate-600 text-lg">Organize and manage your custom data groups</p>
          </div>

          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <Users className="w-16 h-16 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">No groups yet</h2>
              <p className="text-slate-500 mb-8 max-w-md text-center">
                Create your first group to start organizing your data with custom fields
              </p>

              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    Create a Group
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupName" className="text-sm font-medium">
                        Group Name
                      </Label>
                      <Input
                        id="groupName"
                        placeholder="Enter group name..."
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Custom Fields</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Field name (e.g., Email, Phone)"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addCustomField()}
                          className="h-10"
                        />
                        <Button onClick={addCustomField} size="sm" className="px-4">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {newCustomFields.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {newCustomFields.map((field) => (
                            <Badge key={field.id} variant="secondary" className="px-3 py-1 text-sm">
                              {field.name}
                              <button onClick={() => removeCustomField(field.id)} className="ml-2 hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={createGroup}
                      className="w-full h-12 text-lg font-semibold"
                      disabled={!newGroupName.trim() || newCustomFields.length === 0}
                    >
                      Create Group
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Your Groups</h2>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="shadow-lg hover:shadow-xl transition-all duration-200">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Create New Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="groupName" className="text-sm font-medium">
                          Group Name
                        </Label>
                        <Input
                          id="groupName"
                          placeholder="Enter group name..."
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Custom Fields</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Field name (e.g., Email, Phone)"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addCustomField()}
                            className="h-10"
                          />
                          <Button onClick={addCustomField} size="sm" className="px-4">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {newCustomFields.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {newCustomFields.map((field) => (
                              <Badge key={field.id} variant="secondary" className="px-3 py-1 text-sm">
                                {field.name}
                                <button onClick={() => removeCustomField(field.id)} className="ml-2 hover:text-red-500">
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={createGroup}
                        className="w-full h-12 text-lg font-semibold"
                        disabled={!newGroupName.trim() || newCustomFields.length === 0}
                      >
                        Create Group
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <Card
                    key={group.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0 shadow-lg"
                    onClick={() => openGroup(group)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-slate-800">{group.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {group.customFields.slice(0, 3).map((field) => (
                            <Badge key={field.id} variant="outline" className="text-xs">
                              {field.name}
                            </Badge>
                          ))}
                          {group.customFields.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.customFields.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {group.entries.length} {group.entries.length === 1 ? "entry" : "entries"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Group View
  if (currentView === "group" && selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={goHome} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{selectedGroup.name}</h1>
              <p className="text-slate-600">
                {selectedGroup.entries.length} {selectedGroup.entries.length === 1 ? "entry" : "entries"}
              </p>
            </div>
            <Button onClick={openEntryForm} className="ml-auto shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Entry
            </Button>
          </div>

          {selectedGroup.entries.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700 mb-4">No entries yet</h2>
              <p className="text-slate-500 mb-6">Add your first entry to this group</p>
              <Button onClick={openEntryForm} size="lg" className="shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Entry
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {selectedGroup.entries.map((entry, index) => (
                <Card key={index} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                        {selectedGroup.customFields.map((field) => (
                          <div key={field.id}>
                            <Label className="text-sm font-medium text-slate-600">{field.name}</Label>
                            <p className="text-slate-800 font-medium">{entry[field.name] || "-"}</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Entry Form View
  if (currentView === "entry" && selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={goBackToGroup} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Add Entry</h1>
              <p className="text-slate-600">to {selectedGroup.name}</p>
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="space-y-6">
                {selectedGroup.customFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.name}
                    </Label>
                    <Input
                      id={field.id}
                      placeholder={`Enter ${field.name.toLowerCase()}...`}
                      value={newEntry[field.name] || ""}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          [field.name]: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>
                ))}

                <div className="flex gap-4 pt-4">
                  <Button onClick={goBackToGroup} variant="outline" className="flex-1 h-12">
                    Cancel
                  </Button>
                  <Button onClick={saveEntry} className="flex-1 h-12 shadow-lg">
                    Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}


