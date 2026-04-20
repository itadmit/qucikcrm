"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Zap, UserPlus, CheckSquare, Calendar, Users, Mail, Bell, FileText, Tag, ArrowLeft, FileCheck, CreditCard, FolderPlus, Plus, X, ListChecks } from "lucide-react"

interface NewAutomationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAutomationCreated: () => void
}

const triggers = [
  { value: 'lead_created', label: 'ליד חדש נוצר', icon: UserPlus, color: 'text-violet-600', bg: 'bg-violet-100' },
  { value: 'lead_status_changed', label: 'סטטוס ליד השתנה', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
  { value: 'task_created', label: 'משימה חדשה נוצרה', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'task_completed', label: 'משימה הושלמה', icon: CheckSquare, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { value: 'meeting_scheduled', label: 'פגישה נקבעה', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
  { value: 'client_created', label: 'לקוח חדש נוצר', icon: Users, color: 'text-pink-600', bg: 'bg-pink-100' },
  { value: 'quote_accepted', label: 'הצעה אושרה', icon: FileCheck, color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'payment_received', label: 'תשלום התקבל', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { value: 'project_created', label: 'פרויקט חדש נוצר', icon: FolderPlus, color: 'text-indigo-600', bg: 'bg-indigo-100' },
]

const actions = [
  { value: 'send_email', label: 'שלח אימייל', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100' },
  { value: 'create_task', label: 'צור משימה', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'create_task_kit', label: 'צור מספר משימות', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { value: 'send_notification', label: 'שלח התראה', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-100' },
  { value: 'add_tag', label: 'הוסף תגית', icon: Tag, color: 'text-violet-600', bg: 'bg-violet-100' },
  { value: 'update_field', label: 'עדכן שדה', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-100' },
]

export function NewAutomationDialog({ open, onOpenChange, onAutomationCreated }: NewAutomationDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: '',
    action: '',
    emailTemplate: '',
    taskTitle: '',
    taskChecklist: [] as string[],
    taskTitles: ['', '', ''],
    notificationMessage: '',
    tagName: '',
  })
  const [newChecklistItem, setNewChecklistItem] = useState('')

  const selectedTrigger = triggers.find(t => t.value === formData.trigger)
  const selectedAction = actions.find(a => a.value === formData.action)

  const handleSubmit = async () => {
    if (!formData.name || !formData.trigger || !formData.action) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          trigger: { type: formData.trigger },
          action: { type: formData.action, params: getActionParams() },
          isActive: true,
        }),
      })

      if (response.ok) {
        toast({
          title: "אוטומציה נוצרה",
          description: "האוטומציה נוצרה בהצלחה ופעילה",
        })
        onAutomationCreated()
        onOpenChange(false)
        resetForm()
      } else {
        throw new Error('Failed to create automation')
      }
    } catch (error) {
      console.error('Error creating automation:', error)
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור את האוטומציה",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getActionParams = () => {
    switch (formData.action) {
      case 'send_email':
        return { emailTemplateId: formData.emailTemplate }
      case 'create_task':
        return {
          taskTitle: formData.taskTitle,
          ...(formData.taskChecklist.length > 0 && { checklist: formData.taskChecklist }),
        }
      case 'create_task_kit':
        return { taskTitles: formData.taskTitles.filter(t => t.trim() !== '') }
      case 'send_notification':
        return { notificationMessage: formData.notificationMessage }
      case 'add_tag':
        return { tagName: formData.tagName }
      default:
        return {}
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger: '',
      action: '',
      emailTemplate: '',
      taskTitle: '',
      taskChecklist: [],
      taskTitles: ['', '', ''],
      notificationMessage: '',
      tagName: '',
    })
    setNewChecklistItem('')
    setStep(1)
  }

  const canProceedToStep2 = formData.name
  const canProceedFromStep2 = formData.trigger
  const canProceedToStep3 = formData.trigger && formData.action

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-600" />
            צור אוטומציה חדשה
          </DialogTitle>
          <DialogDescription>
            הגדר תהליך אוטומטי שירוץ כאשר אירוע מסוים מתרחש במערכת
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-violet-600' : 'text-zinc-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-violet-600 text-white' : 'bg-zinc-200'}`}>
              1
            </div>
            <span className="text-sm font-medium">פרטים בסיסיים</span>
          </div>
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-violet-600' : 'text-zinc-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-violet-600 text-white' : 'bg-zinc-200'}`}>
              2
            </div>
            <span className="text-sm font-medium">טריגר</span>
          </div>
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-violet-600' : 'text-zinc-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-violet-600 text-white' : 'bg-zinc-200'}`}>
              3
            </div>
            <span className="text-sm font-medium">פעולה</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">שם האוטומציה *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="לדוגמה: שליחת אימייל לליד חדש"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">תיאור (אופציונלי)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="תאר מה האוטומציה עושה"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Trigger */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold mb-3 block">מתי האוטומציה תרוץ?</Label>
                <p className="text-sm text-zinc-500 mb-4">בחר את האירוע שיפעיל את האוטומציה</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {triggers.map((trigger) => {
                    const Icon = trigger.icon
                    const isSelected = formData.trigger === trigger.value
                    return (
                      <button
                        key={trigger.value}
                        onClick={() => setFormData({ ...formData, trigger: trigger.value })}
                        className={`p-4 rounded-lg border-2 transition-all text-right hover:shadow-md ${
                          isSelected
                            ? 'border-purple-500 bg-violet-50'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${trigger.bg}`}>
                            <Icon className={`w-5 h-5 ${trigger.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-zinc-900">{trigger.label}</div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                              <CheckSquare className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Action */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold mb-3 block">מה יקרה אז?</Label>
                <p className="text-sm text-zinc-500 mb-4">בחר את הפעולה שתתבצע</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {actions.map((action) => {
                    const Icon = action.icon
                    const isSelected = formData.action === action.value
                    return (
                      <button
                        key={action.value}
                        onClick={() => setFormData({ ...formData, action: action.value })}
                        className={`p-4 rounded-lg border-2 transition-all text-right hover:shadow-md ${
                          isSelected
                            ? 'border-purple-500 bg-violet-50'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.bg}`}>
                            <Icon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-zinc-900">{action.label}</div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                              <CheckSquare className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Action Configuration */}
                {formData.action === 'send_email' && (
                  <div>
                    <Label htmlFor="emailTemplate">תבנית אימייל</Label>
                    <Textarea
                      id="emailTemplate"
                      value={formData.emailTemplate}
                      onChange={(e) => setFormData({ ...formData, emailTemplate: e.target.value })}
                      placeholder="שלום {name}, תודה שנרשמת..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                )}

                {formData.action === 'create_task' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taskTitle">כותרת המשימה</Label>
                      <Input
                        id="taskTitle"
                        value={formData.taskTitle}
                        onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                        placeholder="לדוגמה: נוהל פתיחת אתר חדש"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <ListChecks className="w-4 h-4 text-green-600" />
                        צ׳קליסט (אופציונלי)
                      </Label>

                      {formData.taskChecklist.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          {formData.taskChecklist.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                              <span className="text-xs text-zinc-400 w-5 text-center">{index + 1}</span>
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const updated = [...formData.taskChecklist]
                                  updated[index] = e.target.value
                                  setFormData({ ...formData, taskChecklist: updated })
                                }}
                                className="flex-1 h-8 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.taskChecklist.filter((_, i) => i !== index)
                                  setFormData({ ...formData, taskChecklist: updated })
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                              >
                                <X className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Input
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newChecklistItem.trim()) {
                              e.preventDefault()
                              setFormData({
                                ...formData,
                                taskChecklist: [...formData.taskChecklist, newChecklistItem.trim()],
                              })
                              setNewChecklistItem('')
                            }
                          }}
                          placeholder="הוסף פריט לצ׳קליסט..."
                          className="flex-1 h-8 text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!newChecklistItem.trim()}
                          onClick={() => {
                            if (newChecklistItem.trim()) {
                              setFormData({
                                ...formData,
                                taskChecklist: [...formData.taskChecklist, newChecklistItem.trim()],
                              })
                              setNewChecklistItem('')
                            }
                          }}
                          className="h-8 px-3"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {formData.taskChecklist.length > 0 && (
                        <p className="text-xs text-zinc-400 mt-1.5">
                          {formData.taskChecklist.length} פריטים בצ׳קליסט
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.action === 'create_task_kit' && (
                  <div className="space-y-3">
                    <Label>רשימת משימות ליצירה</Label>
                    <p className="text-sm text-zinc-500">הזן את כותרות המשימות שיווצרו אוטומטית</p>
                    {formData.taskTitles.map((title, index) => (
                      <Input
                        key={index}
                        value={title}
                        onChange={(e) => {
                          const newTitles = [...formData.taskTitles]
                          newTitles[index] = e.target.value
                          setFormData({ ...formData, taskTitles: newTitles })
                        }}
                        placeholder={`משימה ${index + 1}`}
                        className="mt-1"
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ 
                        ...formData, 
                        taskTitles: [...formData.taskTitles, ''] 
                      })}
                      className="w-full"
                    >
                      + הוסף משימה נוספת
                    </Button>
                  </div>
                )}

                {formData.action === 'send_notification' && (
                  <div>
                    <Label htmlFor="notificationMessage">הודעת ההתראה</Label>
                    <Input
                      id="notificationMessage"
                      value={formData.notificationMessage}
                      onChange={(e) => setFormData({ ...formData, notificationMessage: e.target.value })}
                      placeholder="לדוגמה: ליד חדש: {name}"
                      className="mt-1"
                    />
                  </div>
                )}

                {formData.action === 'add_tag' && (
                  <div>
                    <Label htmlFor="tagName">שם התגית</Label>
                    <Input
                      id="tagName"
                      value={formData.tagName}
                      onChange={(e) => setFormData({ ...formData, tagName: e.target.value })}
                      placeholder="לדוגמה: חם, מעניין, וכו'"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Preview */}
              {selectedTrigger && selectedAction && (
                <div className="mt-6 p-4 bg-zinc-50 rounded-lg border">
                  <div className="text-sm font-medium text-zinc-700 mb-2">תצוגה מקדימה:</div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
                      {React.createElement(selectedTrigger.icon, { className: `w-4 h-4 ${selectedTrigger.color}` })}
                      <span>{selectedTrigger.label}</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-zinc-400" />
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
                      {React.createElement(selectedAction.icon, { className: `w-4 h-4 ${selectedAction.color}` })}
                      <span>{selectedAction.label}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                חזור
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={loading}
            >
              ביטול
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedToStep2 : step === 2 ? !canProceedFromStep2 : false}
                className="prodify-gradient text-white"
              >
                המשך
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceedToStep3}
                className="prodify-gradient text-white"
              >
                {loading ? "יוצר..." : "צור אוטומציה"}
                <Zap className="w-4 h-4 mr-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}