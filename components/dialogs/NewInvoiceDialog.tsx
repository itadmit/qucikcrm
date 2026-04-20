"use client"

import { useState, useEffect } from "react"
import { Plus, X, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  discount: number
}

interface NewInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  projectId: string
  clientId: string
  clientName: string
  projectBudget: number
  paidAmount: number
}

export function NewInvoiceDialog({
  open,
  onOpenChange,
  onSuccess,
  projectId,
  clientId,
  clientName,
  projectBudget,
  paidAmount,
}: NewInvoiceDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const remainingAmount = projectBudget - paidAmount

  const [formData, setFormData] = useState({
    title: "גמר חשבון",
    description: "",
    validUntil: "",
    notes: "",
    terms: "תשלום מיידי עם קבלת החשבון",
    discount: 0,
    tax: 18,
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "יתרת תשלום על פי הסכם", quantity: 1, unitPrice: remainingAmount > 0 ? remainingAmount : 0, discount: 0 },
  ])

  useEffect(() => {
    if (open && remainingAmount > 0) {
      setItems([
        { description: "יתרת תשלום על פי הסכם", quantity: 1, unitPrice: remainingAmount, discount: 0 },
      ])
    }
  }, [open, remainingAmount])

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unitPrice: 0, discount: 0 },
    ])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemTotal =
        item.quantity * item.unitPrice * (1 - item.discount / 100)
      return sum + itemTotal
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const discountAmount = subtotal * (formData.discount / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * (formData.tax / 100)
  const total = afterDiscount + taxAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "שגיאה",
        description: "יש להזין כותרת לחשבון",
        variant: "destructive",
      })
      return
    }

    const validItems = items.filter(
      (item) => item.description.trim() && item.quantity > 0
    )

    if (validItems.length === 0) {
      toast({
        title: "שגיאה",
        description: "יש להוסיף לפחות פריט אחד",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clientId,
          projectId,
          isInvoice: true,
          items: validItems,
        }),
      })

      if (res.ok) {
        toast({
          title: "הצלחה",
          description: "חשבון העסקה נוצר בהצלחה",
        })
        onSuccess()
        onOpenChange(false)
        resetForm()
      } else {
        const error = await res.json()
        throw new Error(error.error || "Failed to create invoice")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו ליצור את חשבון העסקה",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "גמר חשבון",
      description: "",
      validUntil: "",
      notes: "",
      terms: "תשלום מיידי עם קבלת החשבון",
      discount: 0,
      tax: 18,
    })
    setItems([{ description: "יתרת תשלום על פי הסכם", quantity: 1, unitPrice: remainingAmount > 0 ? remainingAmount : 0, discount: 0 }])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="text-orange-600">📋</span>
            חשבון עסקה / דרישת תשלום
          </DialogTitle>
          <p className="text-sm text-zinc-500">
            עבור: {clientName}
          </p>
        </DialogHeader>

        {/* Summary Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-zinc-500 mb-1">תקציב פרויקט</p>
              <p className="font-bold text-lg">₪{projectBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">שולם עד כה</p>
              <p className="font-bold text-lg text-green-600">₪{paidAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">נותר לתשלום</p>
              <p className="font-bold text-lg text-orange-600">₪{remainingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="title">סוג מסמך</Label>
            <Select
              value={formData.title}
              onValueChange={(value) =>
                setFormData({ ...formData, title: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="גמר חשבון">גמר חשבון</SelectItem>
                <SelectItem value="דרישת תשלום">דרישת תשלום</SelectItem>
                <SelectItem value="חשבון חלקי">חשבון חלקי</SelectItem>
                <SelectItem value="חשבון מקדמה">חשבון מקדמה</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validUntil">תאריך תשלום</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="תיאור כללי של החשבון..."
              rows={2}
            />
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">פריטים</Label>
              <Button type="button" onClick={addItem} size="sm" variant="outline">
                <Plus className="w-4 h-4 ml-2" />
                הוסף פריט
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-zinc-50 space-y-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="תיאור הפריט *"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        required
                      />
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">כמות</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">מחיר יחידה (₪)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">הנחה (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "discount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">סה״כ</Label>
                      <div className="flex items-center h-10 px-3 bg-white border rounded-md font-semibold">
                        ₪
                        {(
                          item.quantity *
                          item.unitPrice *
                          (1 - item.discount / 100)
                        ).toLocaleString("he-IL", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="discount">הנחה כללית (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax">מע״מ (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tax: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg space-y-2 border border-orange-200">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">סכום ביניים:</span>
                <span className="font-medium">
                  ₪{subtotal.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">
                    הנחה ({formData.discount}%):
                  </span>
                  <span className="font-medium text-red-600">
                    -₪
                    {discountAmount.toLocaleString("he-IL", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">מע״מ ({formData.tax}%):</span>
                <span className="font-medium">
                  ₪{taxAmount.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-orange-300 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>סה״כ לתשלום:</span>
                  <span className="text-orange-600">
                    ₪{total.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="הערות נוספות..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">תנאי תשלום</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) =>
                  setFormData({ ...formData, terms: e.target.value })
                }
                placeholder="תנאי תשלום..."
                rows={2}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {loading ? "יוצר..." : "צור חשבון עסקה"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
