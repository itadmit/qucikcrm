"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, CreditCard, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { SignaturePad } from "@/components/ui/signature-pad"

interface Quote {
  id: string
  quoteNumber: string
  title: string
  description?: string | null
  total: number
  depositPercent: number
  isInvoice: boolean
  paidAmount: number
  lead?: {
    name: string
    email?: string | null
    phone?: string | null
  } | null
}

interface ActiveIntegration {
  type: string
  isActive: boolean
}

export default function ApproveQuotePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [paymentProvider, setPaymentProvider] = useState<"payplus" | "invoice4u">("payplus")
  const [activeIntegrations, setActiveIntegrations] = useState<ActiveIntegration[]>([])

  const fetchQuote = useCallback(async () => {
    if (!params.id) return
    
    try {
      setLoading(true)
      const res = await fetch(`/api/quotes/${params.id}/approve`)
      if (res.ok) {
        const data = await res.json()
        setQuote(data)
        
        // בדוק אילו אינטגרציות תשלום פעילות
        if (data.activeIntegrations) {
          setActiveIntegrations(data.activeIntegrations)
          // בחר את הראשונה כברירת מחדל
          const payplusActive = data.activeIntegrations.find((i: ActiveIntegration) => i.type === 'PAYPLUS' && i.isActive)
          const invoice4uActive = data.activeIntegrations.find((i: ActiveIntegration) => i.type === 'INVOICE4U' && i.isActive)
          
          if (payplusActive) {
            setPaymentProvider("payplus")
          } else if (invoice4uActive) {
            setPaymentProvider("invoice4u")
          }
        }
      } else {
        setError("הצעת המחיר לא נמצאה")
      }
    } catch (error) {
      console.error("Error fetching quote:", error)
      setError("שגיאה בטעינת הצעת המחיר")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])
  
  // בדיקה אם יש אינטגרציה פעילה
  const hasPayplus = activeIntegrations.some(i => i.type === 'PAYPLUS' && i.isActive)
  const hasInvoice4u = activeIntegrations.some(i => i.type === 'INVOICE4U' && i.isActive)
  const hasAnyPaymentProvider = hasPayplus || hasInvoice4u

  const handleApprove = async () => {
    if (!quote) {
      toast({
        title: "שגיאה",
        description: "הצעת המחיר לא נטענה",
        variant: "destructive",
      })
      return
    }

    if (!signature) {
      toast({
        title: "חתימה נדרשת",
        description: "אנא הוסף חתימה לפני אישור ההצעה",
        variant: "destructive",
      })
      return
    }

    try {
      setApproving(true)
      
      // שלב 1: אישור ההצעה ושמירת החתימה
      const approveRes = await fetch(`/api/quotes/${params.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
        }),
      })

      if (!approveRes.ok) {
        const errorData = await approveRes.json()
        toast({
          title: "שגיאה",
          description: errorData.error || "לא הצלחנו לאשר את הצעת המחיר",
          variant: "destructive",
        })
        return
      }

      // שלב 2: יצירת payment link לפי מערכת התשלום שנבחרה
      // אם זה חשבון - הסכום המלא (פחות מה ששולם), אם זה הצעה - מקדמה
      const paymentAmount = quote.isInvoice 
        ? (quote.total - quote.paidAmount) 
        : (quote.total * (quote.depositPercent || 40) / 100)
      
      if (paymentProvider === "payplus") {
        const paymentLinkRes = await fetch(`/api/quotes/${params.id}/generate-payment-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currency: "ILS",
            amount: paymentAmount,
            customer: quote.lead ? {
              customer_name: quote.lead.name,
              email: quote.lead.email || undefined,
              phone: quote.lead.phone || undefined,
            } : undefined,
          }),
        })

        if (paymentLinkRes.ok) {
          const data = await paymentLinkRes.json()
          if (data.paymentLink) {
            // מעבר ישיר לדף התשלום של PayPlus
            window.location.href = data.paymentLink
          } else {
            throw new Error("Payment link not generated")
          }
        } else {
          const errorData = await paymentLinkRes.json()
          const errorMessage = errorData.error || errorData.details || "שגיאה ביצירת קישור תשלום"
          toast({
            title: "שגיאה ביצירת קישור תשלום",
            description: errorMessage,
            variant: "destructive",
            duration: 10000,
          })
        }
      } else if (paymentProvider === "invoice4u") {
        // יצירת תשלום דרך Invoice4U Clearing
        // אם זה חשבון - הסכום המלא (פחות מה ששולם), אם זה הצעה - מקדמה
        const paymentAmount = quote.isInvoice 
          ? (quote.total - quote.paidAmount) 
          : (quote.total * (quote.depositPercent || 40) / 100)
        const paymentDescription = quote.isInvoice
          ? `תשלום עבור חשבון ${quote.quoteNumber}`
          : `מקדמה ${quote.depositPercent || 40}% עבור הצעה ${quote.quoteNumber}`
        
        const clearingRes = await fetch(`/api/integrations/invoice4u/clearing/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteId: params.id,
            amount: paymentAmount.toString(),
            description: paymentDescription,
            paymentType: "regular",
          }),
        })

        if (clearingRes.ok) {
          const data = await clearingRes.json()
          if (data.clearingUrl) {
            window.location.href = data.clearingUrl
          } else {
            throw new Error("Clearing URL not generated")
          }
        } else {
          const errorData = await clearingRes.json()
          const errorMessage = errorData.error || "שגיאה ביצירת קישור תשלום"
          toast({
            title: "שגיאה ביצירת קישור תשלום",
            description: errorMessage,
            variant: "destructive",
            duration: 10000,
          })
        }
      }
    } catch (error: any) {
      console.error("Error approving quote:", error)
      const errorMessage = error.message || "לא הצלחנו לאשר את הצעת המחיר"
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
        duration: 10000, // הצגה למשך 10 שניות כדי שהמשתמש יוכל לקרוא
      })
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-zinc-600">טוען...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50" dir="rtl">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-zinc-900 mb-2">שגיאה</h2>
              <p className="text-zinc-600 mb-4">{error || "הצעת המחיר לא נמצאה"}</p>
              <Button onClick={() => router.push("/")} variant="outline">
                חזרה לדף הבית
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc-900 mb-2">
              {quote.isInvoice ? 'תשלום חשבון' : 'אישור הצעת מחיר'}
            </CardTitle>
            <p className="text-zinc-600">
              {quote.isInvoice ? 'מספר חשבון:' : 'מספר הצעה:'} {quote.quoteNumber}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{quote.title}</h3>
              {quote.description && (
                <p className="text-zinc-600 text-sm">{quote.description}</p>
              )}
            </div>

            {quote.lead && (
              <div className="bg-zinc-50 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 mb-1">לקוח:</p>
                <p className="font-medium text-zinc-900">{quote.lead.name}</p>
                {quote.lead.email && (
                  <p className="text-sm text-zinc-600">{quote.lead.email}</p>
                )}
              </div>
            )}

            {quote.isInvoice ? (
              /* תצוגה עבור חשבון עסקה */
              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-zinc-900">סה״כ לתשלום:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₪{(quote.total - quote.paidAmount).toLocaleString("he-IL", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {quote.paidAmount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm text-zinc-600 mb-1">
                      <span>סכום כולל:</span>
                      <span>₪{quote.total.toLocaleString("he-IL", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-green-600 mb-2">
                      <span>שולם עד כה:</span>
                      <span>₪{quote.paidAmount.toLocaleString("he-IL", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                )}
                <p className="text-sm text-zinc-600">
                  לאחר החתימה, תועבר לעמוד תשלום
                </p>
              </div>
            ) : (
              /* תצוגה עבור הצעת מחיר */
              <div className="bg-violet-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-zinc-900">מקדמה ({quote.depositPercent || 40}%):</span>
                  <span className="text-2xl font-bold text-violet-600">
                    ₪{(quote.total * (quote.depositPercent || 40) / 100).toLocaleString("he-IL", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
                  <span>סה״כ כולל:</span>
                  <span>₪{quote.total.toLocaleString("he-IL", { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-sm text-zinc-600">
                  לאחר אישור ההצעה, תועבר לעמוד תשלום מקדמה
                </p>
              </div>
            )}

            {/* בחירת מערכת תשלום - מופיע רק אם יש יותר מאינטגרציה אחת */}
            {hasAnyPaymentProvider && (hasPayplus && hasInvoice4u) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">מערכת תשלום</h3>
              <div className="grid gap-2">
                <Label htmlFor="paymentProvider">בחר מערכת תשלום</Label>
                <Select
                  value={paymentProvider}
                  onValueChange={(value: "payplus" | "invoice4u") =>
                    setPaymentProvider(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      {hasPayplus && <SelectItem value="payplus">PayPlus</SelectItem>}
                      {hasInvoice4u && <SelectItem value="invoice4u">Invoice4U Clearing</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}

            {/* חתימה דיגיטלית */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">חתימה דיגיטלית</h3>
              <SignaturePad onSignatureChange={setSignature} />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleApprove}
                disabled={approving}
                className="flex-1 text-white"
                style={{
                  background: quote.isInvoice 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #6f65e2 0%, #b965e2 100%)',
                }}
                size="lg"
              >
                {approving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    {quote.isInvoice ? 'מעבד...' : 'מאשר...'}
                  </>
                ) : (
                  <>
                    {quote.isInvoice ? (
                      <>
                        <CreditCard className="w-4 h-4 ml-2" />
                        חתום והמשך לתשלום
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 ml-2" />
                        אשר והמשך לתשלום
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

