import { NextResponse } from "next/server"

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickCRM API Documentation</title>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Heebo', sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #e4e4e7;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    header {
      text-align: center;
      margin-bottom: 50px;
    }
    
    h1 {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #a78bfa, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: #a1a1aa;
      font-size: 1.1rem;
    }
    
    .badge {
      display: inline-block;
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      margin-top: 15px;
    }
    
    .section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section h2::before {
      content: '';
      width: 4px;
      height: 24px;
      background: linear-gradient(135deg, #a78bfa, #ec4899);
      border-radius: 2px;
    }
    
    .endpoint {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    
    .method {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    
    .method.post {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
    
    .url {
      font-family: 'JetBrains Mono', monospace;
      color: #fbbf24;
      font-size: 0.95rem;
    }
    
    .action-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
    }
    
    .action-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .action-name {
      font-family: 'JetBrains Mono', monospace;
      color: #a78bfa;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .action-desc {
      color: #a1a1aa;
      font-size: 0.9rem;
    }
    
    pre {
      background: #0d1117;
      border-radius: 8px;
      padding: 15px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    code {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .code-label {
      font-size: 0.75rem;
      color: #71717a;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .json-key { color: #7dd3fc; }
    .json-string { color: #86efac; }
    .json-number { color: #fbbf24; }
    .json-boolean { color: #f472b6; }
    
    .copy-btn {
      background: rgba(139, 92, 246, 0.2);
      border: none;
      color: #a78bfa;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    
    .copy-btn:hover {
      background: rgba(139, 92, 246, 0.4);
    }
    
    .info-box {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
    
    .info-box.warning {
      background: rgba(245, 158, 11, 0.1);
      border-color: rgba(245, 158, 11, 0.3);
    }
    
    .info-box h4 {
      color: #60a5fa;
      margin-bottom: 8px;
    }
    
    .info-box.warning h4 {
      color: #fbbf24;
    }
    
    .steps {
      counter-reset: step;
      list-style: none;
    }
    
    .steps li {
      position: relative;
      padding-right: 50px;
      margin-bottom: 15px;
    }
    
    .steps li::before {
      counter-increment: step;
      content: counter(step);
      position: absolute;
      right: 0;
      top: 0;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #a78bfa, #ec4899);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    th, td {
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    th {
      color: #a78bfa;
      font-weight: 600;
    }
    
    .required {
      color: #f87171;
      font-size: 0.8rem;
    }
    
    .optional {
      color: #71717a;
      font-size: 0.8rem;
    }
    
    footer {
      text-align: center;
      color: #52525b;
      padding: 30px;
      font-size: 0.9rem;
    }
    
    @media (max-width: 600px) {
      h1 { font-size: 1.8rem; }
      .endpoint-header { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🚀 QuickCRM Webhook API</h1>
      <p class="subtitle">API ליצירת הצעות מחיר ולידים מ-Siri Shortcuts</p>
      <span class="badge">גרסה 1.0</span>
    </header>

    <!-- Quick Start -->
    <div class="section">
      <h2>התחלה מהירה</h2>
      <div class="info-box">
        <h4>📱 שילוב עם Siri Shortcuts</h4>
        <p>API זה מאפשר לך ליצור הצעות מחיר ולידים ישירות מהאייפון באמצעות פקודות קוליות!</p>
      </div>
      
      <ol class="steps">
        <li>קבל את מפתח ה-API שלך מ<strong>הגדרות → אינטגרציות → API</strong></li>
        <li>פתח את אפליקציית <strong>Shortcuts</strong> באייפון</li>
        <li>צור Shortcut חדש עם <strong>"Get Contents of URL"</strong></li>
        <li>הגדר את ה-Headers וה-Body לפי התיעוד למטה</li>
      </ol>
    </div>

    <!-- Authentication -->
    <div class="section">
      <h2>אימות</h2>
      <p style="margin-bottom: 15px;">כל הבקשות (חוץ מ-<code>get_api_key</code>) דורשות header של X-API-KEY:</p>
      <pre><span class="json-key">X-API-KEY</span>: <span class="json-string">your-api-key-here</span>
<span class="json-key">Content-Type</span>: <span class="json-string">application/json</span></pre>
    </div>

    <!-- Endpoint -->
    <div class="section">
      <h2>Endpoint</h2>
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method post">POST</span>
          <span class="url">https://quick-crm.com/api/webhooks/quotes</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="section">
      <h2>פעולות זמינות</h2>

      <!-- create_lead -->
      <div class="action-card">
        <div class="action-header">
          <span class="action-name">create_lead</span>
          <span class="action-desc">יצירת ליד חדש</span>
        </div>
        <div class="code-label">Request Body</div>
        <pre>{
  <span class="json-key">"action"</span>: <span class="json-string">"create_lead"</span>,
  <span class="json-key">"name"</span>: <span class="json-string">"משה לוי"</span>,          <span class="required">// חובה</span>
  <span class="json-key">"email"</span>: <span class="json-string">"moshe@example.com"</span>, <span class="optional">// אופציונלי</span>
  <span class="json-key">"phone"</span>: <span class="json-string">"0501234567"</span>,        <span class="optional">// אופציונלי</span>
  <span class="json-key">"source"</span>: <span class="json-string">"פגישה"</span>,            <span class="optional">// אופציונלי</span>
  <span class="json-key">"notes"</span>: <span class="json-string">"הערות"</span>,             <span class="optional">// אופציונלי</span>
  <span class="json-key">"tags"</span>: [<span class="json-string">"VIP"</span>, <span class="json-string">"חם"</span>]        <span class="optional">// אופציונלי</span>
}</pre>
        <div class="code-label" style="margin-top: 15px;">Response</div>
        <pre>{
  <span class="json-key">"success"</span>: <span class="json-boolean">true</span>,
  <span class="json-key">"lead"</span>: {
    <span class="json-key">"id"</span>: <span class="json-string">"clx..."</span>,
    <span class="json-key">"name"</span>: <span class="json-string">"משה לוי"</span>,
    <span class="json-key">"email"</span>: <span class="json-string">"moshe@example.com"</span>
  }
}</pre>
      </div>

      <!-- create_quote -->
      <div class="action-card">
        <div class="action-header">
          <span class="action-name">create_quote</span>
          <span class="action-desc">יצירת הצעת מחיר ושליחה במייל/וואטסאפ</span>
        </div>
        <div class="code-label">Request Body</div>
        <pre>{
  <span class="json-key">"action"</span>: <span class="json-string">"create_quote"</span>,
  <span class="json-key">"templateName"</span>: <span class="json-string">"הצעת מחיר איקומרס"</span>, <span class="optional">// או templateId</span>
  <span class="json-key">"leadName"</span>: <span class="json-string">"משה לוי"</span>,             <span class="optional">// או leadId</span>
  <span class="json-key">"leadEmail"</span>: <span class="json-string">"moshe@example.com"</span>,  <span class="optional">// לליד חדש או עדכון</span>
  <span class="json-key">"leadPhone"</span>: <span class="json-string">"0501234567"</span>,         <span class="optional">// לוואטסאפ</span>
  <span class="json-key">"amount"</span>: <span class="json-number">5000</span>,                      <span class="optional">// סכום מותאם (מחליף פריט ראשון)</span>
  <span class="json-key">"sendEmail"</span>: <span class="json-boolean">true</span>,                   <span class="optional">// ברירת מחדל: true</span>
  <span class="json-key">"notes"</span>: <span class="json-string">"הערות להצעה"</span>              <span class="optional">// אופציונלי</span>
}</pre>
        <div class="code-label" style="margin-top: 15px;">Response</div>
        <pre>{
  <span class="json-key">"success"</span>: <span class="json-boolean">true</span>,
  <span class="json-key">"quote"</span>: {
    <span class="json-key">"id"</span>: <span class="json-string">"clx..."</span>,
    <span class="json-key">"quoteNumber"</span>: <span class="json-string">"Q2025010001"</span>,
    <span class="json-key">"total"</span>: <span class="json-number">5000</span>,
    <span class="json-key">"approveUrl"</span>: <span class="json-string">"https://quick-crm.com/quotes/.../approve"</span>
  },
  <span class="json-key">"emailSent"</span>: <span class="json-boolean">true</span>,
  <span class="json-key">"whatsappUrl"</span>: <span class="json-string">"https://wa.me/972501234567?text=..."</span>,
  <span class="json-key">"canSendWhatsApp"</span>: <span class="json-boolean">true</span>,
  <span class="json-key">"canSendEmail"</span>: <span class="json-boolean">true</span>
}</pre>
        <div class="info-box" style="margin-top: 15px;">
          <h4>💡 טיפ: שליחה בוואטסאפ</h4>
          <p>אם יש טלפון לליד, התשובה כוללת <code>whatsappUrl</code> - לינק שפותח ישירות את וואטסאפ עם הודעה מוכנה!</p>
        </div>
      </div>

      <!-- list_templates -->
      <div class="action-card">
        <div class="action-header">
          <span class="action-name">list_templates</span>
          <span class="action-desc">קבלת רשימת תבניות הצעות מחיר</span>
        </div>
        <div class="code-label">Request Body</div>
        <pre>{
  <span class="json-key">"action"</span>: <span class="json-string">"list_templates"</span>
}</pre>
        <div class="code-label" style="margin-top: 15px;">Response</div>
        <pre>{
  <span class="json-key">"templates"</span>: [
    { <span class="json-key">"id"</span>: <span class="json-string">"..."</span>, <span class="json-key">"title"</span>: <span class="json-string">"הצעה בסיסית"</span>, <span class="json-key">"total"</span>: <span class="json-number">1000</span> },
    { <span class="json-key">"id"</span>: <span class="json-string">"..."</span>, <span class="json-key">"title"</span>: <span class="json-string">"הצעת איקומרס"</span>, <span class="json-key">"total"</span>: <span class="json-number">5000</span> }
  ]
}</pre>
      </div>

      <!-- list_leads -->
      <div class="action-card">
        <div class="action-header">
          <span class="action-name">list_leads</span>
          <span class="action-desc">חיפוש לידים</span>
        </div>
        <div class="code-label">Request Body</div>
        <pre>{
  <span class="json-key">"action"</span>: <span class="json-string">"list_leads"</span>,
  <span class="json-key">"search"</span>: <span class="json-string">"משה"</span>  <span class="optional">// אופציונלי - חיפוש לפי שם/אימייל</span>
}</pre>
        <div class="code-label" style="margin-top: 15px;">Response</div>
        <pre>{
  <span class="json-key">"leads"</span>: [
    { <span class="json-key">"id"</span>: <span class="json-string">"..."</span>, <span class="json-key">"name"</span>: <span class="json-string">"משה לוי"</span>, <span class="json-key">"email"</span>: <span class="json-string">"..."</span>, <span class="json-key">"phone"</span>: <span class="json-string">"..."</span> }
  ]
}</pre>
      </div>

      <!-- get_api_key -->
      <div class="action-card">
        <div class="action-header">
          <span class="action-name">get_api_key</span>
          <span class="action-desc">קבלת מפתח API (לא דורש X-API-KEY)</span>
        </div>
        <div class="info-box warning">
          <h4>⚠️ שים לב</h4>
          <p>פעולה זו לא דורשת X-API-KEY בכותרות - משמשת לקבלת המפתח הראשונית</p>
        </div>
        <div class="code-label">Request Body</div>
        <pre>{
  <span class="json-key">"action"</span>: <span class="json-string">"get_api_key"</span>,
  <span class="json-key">"email"</span>: <span class="json-string">"your-email@example.com"</span>,
  <span class="json-key">"password"</span>: <span class="json-string">"your-password"</span>
}</pre>
        <div class="code-label" style="margin-top: 15px;">Response</div>
        <pre>{
  <span class="json-key">"apiKey"</span>: <span class="json-string">"qcrm_abc123..."</span>,
  <span class="json-key">"companyName"</span>: <span class="json-string">"החברה שלך"</span>,
  <span class="json-key">"userName"</span>: <span class="json-string">"שמך"</span>
}</pre>
      </div>
    </div>

    <!-- Siri Shortcut Example -->
    <div class="section">
      <h2>דוגמת Siri Shortcut</h2>
      <div class="info-box">
        <h4>📱 Shortcut מומלץ: "צור הצעה"</h4>
        <p>Shortcut שישאל אותך פרטים וישלח הצעה אוטומטית</p>
      </div>
      
      <ol class="steps">
        <li><strong>Ask for Input</strong> - "מה שם הלקוח?" → שמור במשתנה <code>leadName</code></li>
        <li><strong>Ask for Input</strong> - "מה האימייל?" → שמור במשתנה <code>leadEmail</code></li>
        <li><strong>Choose from Menu</strong> - בחר תבנית → שמור במשתנה <code>templateName</code></li>
        <li><strong>Get Contents of URL</strong>:
          <ul style="margin-top: 10px; margin-right: 20px;">
            <li>URL: <code>https://quick-crm.com/api/webhooks/quotes</code></li>
            <li>Method: POST</li>
            <li>Headers: X-API-KEY, Content-Type</li>
            <li>Body: JSON עם המשתנים</li>
          </ul>
        </li>
        <li><strong>Show Result</strong> - הצג הודעת הצלחה</li>
      </ol>
    </div>

    <footer>
      QuickCRM © 2025 | תיעוד API גרסה 1.0
    </footer>
  </div>

  <script>
    // Copy to clipboard functionality
    document.querySelectorAll('pre').forEach(pre => {
      pre.style.cursor = 'pointer';
      pre.title = 'לחץ להעתקה';
      pre.addEventListener('click', () => {
        navigator.clipboard.writeText(pre.textContent);
        const original = pre.style.borderColor;
        pre.style.borderColor = '#22c55e';
        setTimeout(() => pre.style.borderColor = original, 500);
      });
    });
  </script>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}

