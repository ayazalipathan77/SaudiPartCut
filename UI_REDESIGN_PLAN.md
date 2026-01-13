# UI Redesign Plan - Incremental SendCutSend-Style Enhancement

## ✅ Original Workflow Preserved
Landing Page → Template Selection → Design Configuration → Material Selection → Service Selection → Review & Order

## 📸 Analysis of SendCutSend Screenshots

Based on the provided screenshots, here's the complete workflow analysis:

### Workflow Steps (from screenshots):

1. **Step 1: Size Selection** - "6" x 4""
2. **Step 2: Sheet Cutting** - Upload DXF/drawing
3. **Step 3: Select Material** - Material categories and selection
4. **Step 4: Add Services** - Additional manufacturing services
5. **Step 5: Add Finishing** - Surface finish options
6. **Checkout Flow:**
   - Billing & Shipping
   - Shipping Method
   - Payment & Confirmation

---

## 🎨 Design System Analysis

### Color Palette (from screenshots):
```
Primary Red: #DC2626 (progress indicator, active steps, buttons)
Gray Scale:
  - Background: #F9FAFB
  - Card: #FFFFFF
  - Border: #E5E7EB
  - Text Primary: #111827
  - Text Secondary: #6B7280
Blue Links: #3B82F6
Success Green: #10B981
```

### Typography:
- Primary Font: System UI (likely Inter or similar)
- Headers: Bold, large
- Body: Regular weight
- Small text: 14px
- Button text: 14-16px, medium weight

### Layout Structure:
- **Left Sidebar:** 3D/2D preview with tools
- **Right Panel:** Configuration options
- **Top:** Progress stepper with 5 steps
- **Bottom:** Action buttons (BACK, NEXT/CONTINUE, CLOSE)

### Key UI Components:

1. **Progress Stepper**
   - Circular numbered indicators
   - Connected by horizontal lines
   - Active: Red filled circle
   - Completed: Gray with checkmark
   - Upcoming: Gray outlined

2. **Material Selection Cards**
   - Thumbnail image on left
   - Material name (bold)
   - Subtitle/description
   - Info icon on right
   - Hover effect

3. **3D/2D Preview**
   - Toggle buttons below preview
   - Toolbar icons on left sidebar
   - Interactive canvas
   - Dark sidebar (#1F2937)

4. **Quantity Selector**
   - Plus/minus buttons (circle outlined)
   - Quantity input in center
   - Price per unit display
   - Bulk pricing tiers below

5. **Action Buttons**
   - Primary: Red background (#DC2626), white text
   - Secondary: White background, gray border, gray text
   - Size: Medium-large, rounded

---

## 📋 Screen-by-Screen Redesign

### Screen 1: Material Category Selection (Screenshot 1 & 8)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]           6" x 4"  Sheet Cutting  Select Material   │
│                      ✓         ✓              ⬤            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   CATEGORIES > COMPOSITES                │
│  │              │                                           │
│  │   3D/2D      │   ┌───────────────────────────────────┐  │
│  │   Preview    │   │  [Image] ACM Panel                │  │
│  │              │   │  Polyethylene plastic core...  ℹ️  │  │
│  │              │   └───────────────────────────────────┘  │
│  │              │                                           │
│  │              │   ┌───────────────────────────────────┐  │
│  └──────────────┘   │  [Image] Carbon fiber plate       │  │
│   [3D] [2D]         │  2×2 twill weave, matte finish ℹ️  │  │
│                     └───────────────────────────────────┘  │
│                                                             │
│                     Don't see what you're looking for?      │
│                     SUGGEST A MATERIAL •                    │
│                                                             │
│  [MATERIALS LIBRARY •]              [CLOSE]    [< BACK]    │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Breadcrumb navigation: CATEGORIES > COMPOSITES
- Material cards with thumbnail, name, description, info icon
- "Suggest a Material" link at bottom
- Materials library button (bottom left)
- Persistent 3D/2D toggle preview on left

---

### Screen 2: Thickness/Specification Selection (Screenshot 2)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Step Progress: 6" x 4" > Sheet Cutting > Select Material   │
│                    ✓          ✓              ⬤              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   CATEGORIES > PLASTICS > LEXAN          │
│  │              │            POLYCARBONATE > CLEAR          │
│  │   3D/2D      │                                           │
│  │   Preview    │   Qty ─────────────────────             │
│  │   (Dark BG)  │    [-]   1   [+]           $18.57 /ea   │
│  │              │                                           │
│  │   Interactive│   ○ .118" (3.0 MM)                       │
│  │   Part       │                                           │
│  │   Render     │   ⦿ .177" (4.5 MM)            ⚡️         │
│  │              │   (selected, highlighted blue)            │
│  │              │                                           │
│  └──────────────┘   ○ .220" (5.6 MM)                       │
│   [3D] [2D]                                                 │
│                     VIEW DETAILS ˅                          │
│                                                             │
│                     Bulk Pricing:                           │
│                     2 = $14.48/ea                           │
│                     10 = $10.24/ea                          │
│                     50 = $8.12/ea                           │
│                     100 = $7.25/ea                          │
│                     1000 = $5.92/ea                         │
│                                                             │
│                     Subtotal: $18.57                        │
│                     Arrives as soon as: Jan 10              │
│                                                             │
│                [CLOSE]        [< BACK]    [NEXT >]         │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Breadcrumb: CATEGORIES > PLASTICS > LEXAN POLYCARBONATE > CLEAR
- Radio button options for thickness
- Selected option highlighted in light blue
- Lightning bolt icon for fast availability
- Quantity selector with +/- buttons
- Price per unit display
- Bulk pricing breakdown
- Collapsible "VIEW DETAILS" section
- Delivery estimate
- Red "NEXT" button

---

### Screen 3: Add Services (Screenshot 3)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  6" x 4"  Sheet Cutting  Polycarbonate-...  Add Services    │
│    ✓          ✓               ✓                  ⬤          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   Choose below or click a feature on     │
│  │              │   your drawing to add services            │
│  │  [Toolbar]   │                                           │
│  │   🏠 📐 📋   │   ┌───────────────────────────────────┐  │
│  │   🏗️        │   │  Bending                       ℹ️  │  │
│  │              │   └───────────────────────────────────┘  │
│  │   3D View    │                                           │
│  │   (Part)     │   ┌───────────────────────────────────┐  │
│  │              │   │  Countersinking                 ℹ️  │  │
│  │              │   └───────────────────────────────────┘  │
│  │              │                                           │
│  │              │   ┌───────────────────────────────────┐  │
│  └──────────────┘   │  Dimple Forming                 ℹ️  │  │
│  [3D] [2D] [Tools]  └───────────────────────────────────┘  │
│                                                             │
│                     [+ More services...]                    │
│                                                             │
│                     Qty: [-] 1 [+]      $18.57 /ea         │
│                     VIEW DETAILS ˅                          │
│                                                             │
│                     Subtotal: $18.57                        │
│                     Arrives as soon as: Jan 10              │
│                                                             │
│                [CLOSE]        [< BACK]    [NEXT >]         │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Instruction text at top
- Service option cards (gray, hoverable)
- Info icons for each service
- Dark left sidebar with tool icons
- 3D/2D/Tools tabs
- Quantity and pricing persist

---

### Screen 4: Add Finishing (Screenshot 4)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  6" x 4"  Sheet Cutting  Polycarbonate  10 Services  Add    │
│    ✓          ✓              ✓             ✓       Finishing│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌───────────────────────────────────┐  │
│  │              │   │  No finish (fastest option)        │  │
│  │   3D View    │   └───────────────────────────────────┘  │
│  │   (Part      │                                           │
│  │   Rotated)   │   ┌───────────────────────────────────┐  │
│  │              │   │  Deburring                     ℹ️  │  │
│  │              │   └───────────────────────────────────┘  │
│  │              │                                           │
│  │              │   ┌───────────────────────────────────┐  │
│  └──────────────┘   │  Tumbling                      ℹ️  │  │
│   [3D] [2D] [Tools] └───────────────────────────────────┘  │
│                                                             │
│                     ⚠️ Anodizing                             │
│                     This operation is unavailable in this   │
│                     material.                               │
│                     FULL LIST OF OPERATION LIMITS •         │
│                                                             │
│                     Qty: [-] 1 [+]      $31.87 /ea         │
│                                                             │
│                     Subtotal: $31.87                        │
│                                                             │
│                [CLOSE]    [< BACK]    [ADD TO CART]        │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Finishing options
- Warning tooltip for unavailable options
- Link to "Full list of operation limits"
- Final pricing display
- Red "ADD TO CART" button

---

### Screen 5: Checkout - Billing & Shipping (Screenshot 5)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                    [Logo]  PARTS  ORDERS  SAVED CARTS  [🛒1]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Billing & Shipping     Shipping Method    Payment          │
│          ⬤                                                  │
│                                                             │
│  ┌────────────────────────────────┐  ┌──────────────────┐  │
│  │  oval_flange.dxf          [📋][✅]│  │  Address & Billing│  │
│  │                                 │  │                  │  │
│  │  [Drawing]   Polycarbonate      │  │  Shipping        │  │
│  │              (.177")       Qty:1│  │                  │  │
│  │              Tapping             │  │  [CANCEL] [SAVE] │  │
│  │                                 │  │                  │  │
│  │         + ADD SERVICES          │  │  Nickname        │  │
│  │                                 │  │  ____________    │  │
│  │  Sheet Cutting                  │  │                  │  │
│  │  6 × 4 in                       │  │  Recipient Name* │  │
│  │                                 │  │  ____________    │  │
│  │              Each: $31.87       │  │                  │  │
│  │              Total: $31.87      │  │  Contact Phone   │  │
│  └────────────────────────────────┘  │  ____________    │  │
│                                       │                  │  │
│         + ADD DRAWINGS                │  Email*          │  │
│                                       │  ____________    │  │
│                                       │                  │  │
│                                       │  Company         │  │
│                                       │  ____________    │  │
│                                       │                  │  │
│                                       │  Subtotal $31.87 │  │
│                                       │  Shipping  FREE  │  │
│                                       │  Total    $31.87 │  │
│                                       │                  │  │
│                                       │  Jan 10 arrival  │  │
│                                       └──────────────────┘  │
│  [🇺🇸] MADE IN THE USA                                      │
│                 [SAVE CART] [CREATE FORMAL QUOTE] [CONTINUE>]│
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Three-step progress at top
- Order summary card on left
- Editable item details
- + ADD DRAWINGS / + ADD SERVICES buttons
- Address form on right
- Price breakdown
- Bottom bar with "Made in USA" badge
- Multiple action buttons

---

### Screen 6: Shipping Method (Screenshot 6)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│              [Logo]  PARTS  ORDERS  SAVED CARTS  [🛒1] [👤]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Billing & Shipping     Shipping Method    Payment          │
│          ✓                      ⬤                           │
│                                                             │
│  ┌────────────────────────────┐  ┌────────────────────────┐│
│  │  oval_flange.dxf           │  │  Shipping Options      ││
│  │  [Drawing]                 │  │                        ││
│  │  Polycarbonate (.177")     │  │  Estimated delivery:   ││
│  │  Tapping              Qty:1│  │                        ││
│  │                            │  │  ⦿ Jan 14 - 15    FREE ││
│  │  Sheet Cutting             │  │  Wed - Thu             ││
│  │  6 × 4 in                  │  │  (selected, blue BG)   ││
│  │                            │  │                        ││
│  │  Each: $31.87              │  │  ○ Jan 13-14 +$78.07  ││
│  │  Total: $31.87             │  │  + Rush production     ││
│  └────────────────────────────┘  │  Tue - Wed             ││
│                                   │                        ││
│                                   │  ○ Jan 10-12 +$114.43 ││
│                                   │  + Rush + Overnight    ││
│                                   │                        ││
│                                   │  Subtotal      $31.87  ││
│                                   │  Shipping + H   FREE   ││
│                                   │  Total        $31.87   ││
│                                   │                        ││
│                                   │  Arrives: Jan 14       ││
│                                   └────────────────────────┘│
│                                                             │
│  [🇺🇸] MADE IN THE USA        [< BACK]    [CONTINUE >]     │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Radio button shipping options
- Selected option has blue background
- Rush options with surcharges
- Clear price breakdown
- Estimated arrival date

---

### Screen 7: Payment (Screenshot 7)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│              [Logo]  PARTS  ORDERS  SAVED CARTS  [🛒1] [👤]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Billing & Shipping     Shipping Method    Payment          │
│          ✓                      ✓              ⬤            │
│                                                             │
│  ┌────────────────────────────┐  ┌────────────────────────┐│
│  │  oval_flange.dxf           │  │  Payment               ││
│  │  [Drawing]                 │  │                        ││
│  │  Polycarbonate (.177")     │  │  💳 Credit Card    ⦿   ││
│  │  Tapping              Qty:1│  │                        ││
│  │                            │  │  ⦿ New Card            ││
│  │  Sheet Cutting             │  │  [AMEX][DISC][MC][VISA]││
│  │  6 × 4 in                  │  │                        ││
│  │                            │  │  Card Number           ││
│  │  Each: $31.87              │  │  __________________    ││
│  │  Total: $31.87             │  │                        ││
│  └────────────────────────────┘  │  Expiration (MM/YY)    ││
│                                   │  __________________    ││
│                                   │                        ││
│                                   │  📱 PayPal         ○   ││
│                                   │                        ││
│                                   │  Subtotal      $31.87  ││
│                                   │  Shipping + H   FREE   ││
│                                   │  Tax            $0.00  ││
│                                   │  Total        $31.87   ││
│                                   │                        ││
│                                   │  Arrives: Jan 14       ││
│                                   └────────────────────────┘│
│                                                             │
│  [🇺🇸] MADE IN THE USA        [< BACK] [COMPLETE PURCHASE] │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Payment method selection (Credit Card / PayPal)
- Card brand icons
- Input fields for card details
- Tax calculation
- Final total
- Green "COMPLETE PURCHASE" button

---

## 🎯 Key Features to Implement

### 1. Progress Stepper Component
```typescript
interface Step {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'upcoming';
}

const steps = [
  { number: 1, label: '6" x 4"', status: 'completed' },
  { number: 2, label: 'Sheet Cutting', status: 'completed' },
  { number: 3, label: 'Select Material', status: 'active' },
  { number: 4, label: 'Add Services', status: 'upcoming' },
  { number: 5, label: 'Add Finishing', status: 'upcoming' },
];
```

### 2. Material Selection Cards
```typescript
interface Material {
  id: string;
  category: string;
  name: string;
  description: string;
  imageUrl: string;
  hasInfo: boolean;
  specifications: MaterialSpec[];
}
```

### 3. 3D/2D Preview Sidebar
- Dark background (#1F2937)
- Icon toolbar on left
- 3D/2D/Tools tabs
- Interactive canvas

### 4. Quantity Selector
- Circular +/- buttons
- Center input
- Price per unit
- Bulk pricing tiers

### 5. Breadcrumb Navigation
```
CATEGORIES > PLASTICS > LEXAN POLYCARBONATE > CLEAR
```

### 6. Checkout Flow
- 3-step process
- Order summary (left)
- Form/options (right)
- Bottom action bar

---

## 📐 Responsive Breakpoints

```css
/* Mobile: < 768px */
- Stack layout vertically
- Full-width preview
- Collapsible cards

/* Tablet: 768px - 1024px */
- Side-by-side with smaller preview
- Scrollable content area

/* Desktop: > 1024px */
- Full layout as shown
- Fixed sidebar
- Wide content area
```

---

## 🚀 Implementation Priority

### Phase 1: Core Layout (Week 1)
1. Progress stepper component
2. Split layout (preview left, content right)
3. Dark sidebar with tools
4. Material selection cards
5. Breadcrumb navigation

### Phase 2: Interactive Elements (Week 2)
1. 3D/2D preview toggle
2. Quantity selector with bulk pricing
3. Radio button selections
4. Service/finishing cards
5. Add to cart functionality

### Phase 3: Checkout Flow (Week 3)
1. Order summary component
2. Address form
3. Shipping method selection
4. Payment integration UI
5. Order confirmation

### Phase 4: Polish & Details (Week 4)
1. Hover effects
2. Loading states
3. Error handling
4. Animations
5. Mobile responsiveness

---

## 🎨 Component Library Needed

```
✓ Button (Primary, Secondary, Tertiary)
✓ Card (Material, Service, Finish)
✓ Input (Text, Number, Select)
✓ Radio Button (Custom styled)
✓ Checkbox
✓ Progress Stepper
✓ Breadcrumb
✓ Quantity Selector
✓ Price Display
✓ Tooltip
✓ Modal
✓ Dropdown
✓ Badge
✓ Alert/Warning
```

---

## 📝 Next Steps

1. **Create wireframes** for each screen
2. **Build component library** with Tailwind
3. **Implement screens** one by one
4. **Add interactions** and state management
5. **Test responsive** behavior
6. **Polish animations** and transitions

---

This redesign will transform KSAPartCut to match SendCutSend's professional, user-friendly interface while maintaining the Saudi market focus and SAR pricing.
