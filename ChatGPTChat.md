This is the best approach for a local-first app because it keeps your file size tiny. You don't need different HTML templates for every design; you just need **one semantic HTML structure** and **three clever CSS Grid definitions**.

The secret weapon here is `grid-template-areas`. It allows you to "draw" your layout in text within your CSS file.

Here is the deep dive into how to architect this.

### 1. The "One HTML" Skeleton

First, you need to ensure your HTML is flat and semantic. Do not nest things too deeply. Treat each major section of the invoice as a "block."

**Your HTML structure should look roughly like this:**

```html
<div id="invoice-preview" class="theme-standard">
    
    <header class="section-header">
        <img src="logo.png" class="logo">
        <h1>INVOICE</h1>
    </header>

    <div class="section-sender">
        <h3>From:</h3>
        <p>Your Company Name...</p>
    </div>

    <div class="section-client">
        <h3>Bill To:</h3>
        <p>Client Name...</p>
    </div>

    <div class="section-meta">
        <p>Invoice #: 001</p>
        <p>Date: 2023-10-27</p>
    </div>

    <div class="section-items">
        </div>

    <div class="section-totals">
        <p>Total: $500.00</p>
    </div>

    <div class="section-notes">
        <p>Thank you for your business.</p>
    </div>

</div>

```

---

### 2. The "Classic" Theme (Free Tier)

This is your standard, boring, vertical layout. Everyone expects this.

**The CSS Strategy:**
We define a simple 2-column grid.

```css
.theme-standard {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    gap: 20px;
    grid-template-areas:
        "header header"  /* Header spans full width */
        "sender meta"    /* Sender Left, Meta Right */
        "client client"  /* Client full width (or split with sender) */
        "items items"    /* Table full width */
        "notes totals";  /* Notes Left, Totals Right */
}

```

* **Visual Result:** A very standard, top-down invoice. Safe, functional, but basic.

---

### 3. The "Modern Sidebar" Theme (Pro Tier)

This is where the $12 value kicks in. This layout looks high-end and "designed." We move the sender info and meta info into a colored sidebar on the left.

**The CSS Strategy:**
We change the grid to have a narrow left column (30%) and a wide right column (70%).

```css
.theme-sidebar {
    display: grid;
    grid-template-columns: 30% 70%; /* Uneven columns */
    grid-template-rows: auto 1fr auto; /* Full height control */
    grid-template-areas:
        "header  items"
        "sender  items"
        "meta    totals"
        "client  notes";
}

/* Specific styling for this theme to sell the "Pro" look */
.theme-sidebar .section-header,
.theme-sidebar .section-sender,
.theme-sidebar .section-meta {
    background-color: var(--primary-color); /* The whole left side is colored */
    color: white;
    padding: 20px;
}

.theme-sidebar .section-items {
    padding: 40px; /* Give the expensive part breathing room */
}

```

* **Why this sells:** It looks completely different from the standard theme, even though the HTML is identical. It feels like a "branding agency" designed it.

---

### 4. The "Bold Header" Theme (Pro Tier)

This layout focuses on a massive, full-width header block, perfect for companies that want to look established and corporate.

**The CSS Strategy:**
We create a 3-column grid to put the "Sender," "Client," and "Meta" all on one horizontal row, saving vertical space.

```css
.theme-bold {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Three equal columns */
    gap: 30px;
    grid-template-areas:
        "header header header" /* Massive header */
        "sender client meta"   /* All info in one clean row */
        "items  items  items"
        ".      .      totals" /* Totals pushed to far right */
        "notes  notes  notes";
}

.theme-bold .section-header {
    text-align: center;
    border-bottom: 5px solid var(--primary-color);
    margin-bottom: 40px;
}

```

* **Why this sells:** It saves space (the "Compact" benefit) while looking very structured.

---

### 5. How to Implement the "Switcher"

Since you are using vanilla JS or a light framework:

1. **The State:** Store a variable called `currentTheme` in your LocalStorage (e.g., `'theme-sidebar'`).
2. **The Switch:** When the user clicks a template thumbnail in the sidebar:
```javascript
const container = document.getElementById('invoice-preview');
// Remove old classes
container.className = ''; 
// Add new class
container.classList.add('theme-sidebar'); 

```


3. **The Color Variable:** Since you mentioned you already have color changing, make sure your CSS uses CSS Variables:
```css
:root {
    --primary-color: #336699; /* This is what your color picker changes */
}

```



### Why this is "Local-First" Friendly

* **Zero Database:** The layouts are just CSS text.
* **Fast:** Swapping a CSS class is instant (0ms latency).
* **Print Friendly:** CSS Grid prints beautifully to PDF.
