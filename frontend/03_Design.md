# Frontend Design Specification
## AI Voice Agent for Doctor Appointment Management System

**Version:** 1.0  
**Last Updated:** December 2024  
**Audience:** UI/UX Designers, Frontend Developers

---

## 1. DESIGN SYSTEM & VISUAL GUIDELINES

### 1.1 Color Palette

#### Primary Colors
```
Healthcare Trust Blue: #1B5E7A
  - Used for: Main CTA buttons, primary actions, headers
  - WCAG AA: ✓ Accessible with white text
  - Psychology: Trust, professionalism, healthcare

Secondary Green: #22C55E
  - Used for: Success states, confirm actions, appointment confirmed
  - WCAG AA: ✓ Accessible with white text
  - Psychology: Growth, health, positive outcomes

Alert Red: #EF4444
  - Used for: Errors, cancellations, warnings
  - WCAG AA: ✓ Accessible with white text
  - Psychology: Urgency, caution

Neutral Gray: #6B7280
  - Used for: Secondary text, disabled states, borders
  - WCAG AA: ✓ Accessible for all sizes

Background Light: #F9FAFB
  - Used for: Page backgrounds, card backgrounds
  - Contrast: Sufficient for white text overlay
```

#### Extended Color Palette
```
Status Colors:
├─ Scheduled: #3B82F6 (Blue)
├─ Confirmed: #22C55E (Green)
├─ Cancelled: #EF4444 (Red)
├─ No-Show: #F59E0B (Amber)
└─ Completed: #10B981 (Emerald)

Specialty Colors (for doctor filtering):
├─ Cardiology: #DC2626 (Dark Red)
├─ Neurology: #7C3AED (Purple)
├─ Pediatrics: #F97316 (Orange)
├─ Dermatology: #EC4899 (Pink)
├─ Orthopedics: #8B5CF6 (Violet)
└─ General Practice: #6366F1 (Indigo)
```

### 1.2 Typography

```
Font Family: Inter (Google Fonts - System Stack)
  Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu

Heading Hierarchy:
├─ H1 (32px, Bold, Line-height 1.2)
│   Used for: Page titles, main headings
│   Example: "Book Your Appointment"
│
├─ H2 (24px, Semibold, Line-height 1.3)
│   Used for: Section titles, modal headers
│   Example: "Select a Doctor"
│
├─ H3 (20px, Semibold, Line-height 1.4)
│   Used for: Subsection titles, card titles
│   Example: "Dr. Sarah Johnson"
│
├─ H4 (18px, Medium, Line-height 1.4)
│   Used for: Form labels, dialog titles
│
├─ Body Large (16px, Regular, Line-height 1.5)
│   Used for: Primary body text, descriptions
│
├─ Body (14px, Regular, Line-height 1.5)
│   Used for: Standard body text, card descriptions
│
└─ Small (12px, Regular, Line-height 1.4)
    Used for: Secondary text, hints, labels

Weight Scale:
├─ Regular (400): Body text, descriptions
├─ Medium (500): Labels, secondary headings
└─ Semibold/Bold (600+): Primary headings
```

### 1.3 Spacing & Layout

```
8px Grid System (Base Unit = 8px):

Spacing Scale:
├─ 2px (0.25 unit) - Micro spacing between elements
├─ 4px (0.5 unit) - Tight spacing
├─ 8px (1 unit) - Default spacing, padding within components
├─ 12px (1.5 unit) - Medium spacing
├─ 16px (2 unit) - Standard spacing between sections
├─ 24px (3 unit) - Large spacing
├─ 32px (4 unit) - Extra large spacing
└─ 48px (6 unit) - Section separation

Layout Grid:
├─ Desktop: 12-column grid, max-width 1280px
├─ Tablet: 8-column grid, margin 24px
├─ Mobile: 4-column grid, margin 16px

Container Max-widths:
├─ Mobile: 100% (full width)
├─ Tablet: 728px
├─ Desktop: 1280px
└─ Large Desktop: 1400px

Padding Standards:
├─ Compact: 8px (mobile dialogs)
├─ Normal: 16px (default cards, modals)
├─ Spacious: 24px (pages, sections)
└─ Extra Spacious: 32px (hero sections)
```

### 1.4 Border Radius

```
Radius Scale:
├─ 4px - Subtle: Input fields, small buttons
├─ 8px - Standard: Cards, medium buttons
├─ 12px - Rounded: Large components
├─ 999px - Pill: Badges, full-width rounded buttons
└─ 0px - Sharp: Tables, certain layouts
```

### 1.5 Shadows & Elevation

```
Shadow Levels:

Level 1 (Subtle):
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
Usage: Input fields, slight depth

Level 2 (Default):
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
Usage: Cards, dropdown menus, default hover state

Level 3 (Medium):
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
Usage: Modals, elevated cards, prominent hover state

Level 4 (High):
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
Usage: Floating action buttons, popups, maximum elevation

Inset Shadow (for depth):
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
Usage: Input fields, pressed buttons
```

---

## 2. COMPONENT LIBRARY

### 2.1 Buttons

```
Button States:

┌─────────────────────────────────────────────────────┐
│ PRIMARY BUTTON (Healthcare Blue)                    │
├─────────────────────────────────────────────────────┤
│ Default:   Background #1B5E7A, White text, no shadow
│ Hover:     Background #154D68 (darker), Level 2 shadow
│ Active:    Background #113847, shadow inset
│ Disabled:  Background #D1D5DB (gray), opacity 0.6
│ Loading:   Show spinner, disable interactions
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECONDARY BUTTON (Outline)                          │
├─────────────────────────────────────────────────────┤
│ Default:   Border #1B5E7A, Text #1B5E7A, BG white
│ Hover:     Background #F0F9FF (light blue)
│ Active:    Background #E0F2FE, darker border
│ Disabled:  Border #D1D5DB, gray text
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ DANGER BUTTON (Red)                                 │
├─────────────────────────────────────────────────────┤
│ Default:   Background #EF4444, White text
│ Hover:     Background #DC2626 (darker)
│ Active:    Background #B91C1C, inset shadow
│ Disabled:  Background #D1D5DB, opacity 0.6
│ Usage:     Delete, cancel, destructive actions
└─────────────────────────────────────────────────────┘

Sizes:
├─ Small (S): 8px vertical, 12px horizontal, 12px font
├─ Medium (M): 12px vertical, 16px horizontal, 14px font (default)
└─ Large (L): 16px vertical, 24px horizontal, 16px font

Full Width Button:
├─ Mobile: Always full width for touch targets
├─ Desktop: 100% within container
└─ Used for: CTAs, form submission

Button Variations:
├─ Icon + Text: Icon left, 8px gap
├─ Icon Only: Circular, 40x40px minimum
├─ Loading: Show spinner (12px), disable on click
└─ Disabled: 0.6 opacity, no hover effects
```

### 2.2 Form Components

```
INPUT FIELD DESIGN:

┌──────────────────────────────────────────┐
│ Label                                    │
│ ┌──────────────────────────────────────┐ │
│ │ Placeholder text...                  │ │ 12px font
│ └──────────────────────────────────────┘ │
│ Helper text or error message             │
└──────────────────────────────────────────┘

Specs:
├─ Height: 40px (mobile), 44px (desktop)
├─ Padding: 12px horizontal, 8px vertical
├─ Border: 1px solid #E5E7EB (default)
├─ Border Radius: 8px
├─ Font: 14px, Regular
├─ Placeholder: #9CA3AF (medium gray)

States:
├─ Default: White background, gray border
├─ Focus: Blue border (#1B5E7A), Level 1 shadow
├─ Error: Red border (#EF4444), error text red
├─ Disabled: #F3F4F6 background, gray text
└─ Loading: Icon spinner right

Input Types:
├─ Text: Standard input
├─ Email: Built-in validation
├─ Phone: Format with dashes (555-555-5555)
├─ Date: Calendar picker
├─ Time: Time picker (24h format)
├─ Select Dropdown: Custom styled
├─ Radio Buttons: Group of options
├─ Checkboxes: Multiple selection
└─ Textarea: Multi-line, auto-expand

Validation:
├─ Real-time validation as user types
├─ Error message below field in red
├─ Success checkmark when valid (optional)
└─ Disabled submit until all valid

Label Best Practices:
├─ Always above input (not placeholder)
├─ Bold (500 weight) for clarity
├─ Include "(Optional)" for non-required fields
└─ 8px gap between label and input
```

### 2.3 Cards

```
CARD COMPONENT:

┌─────────────────────────────────────┐
│  Doctor Card (Appointment Selection)│
├─────────────────────────────────────┤
│  ┌─────────┐                        │
│  │ 👨‍⚕️      │ Dr. Sarah Johnson      │
│  │ Image   │ MD, Cardiologist       │
│  │ 64x64   │ ⭐ 4.8 (120 reviews)  │
│  └─────────┘                        │
│                                     │
│  📍 Clinic Name · 2.5 km away       │
│  🕐 Available today at 2:00 PM      │
│                                     │
│  [Select Doctor] [View Profile]     │
└─────────────────────────────────────┘

Specs:
├─ Width: 100% (mobile), 320px (desktop grid)
├─ Padding: 16px
├─ Border: 1px solid #E5E7EB
├─ Border Radius: 12px
├─ Background: White
├─ Shadow: Level 2

States:
├─ Default: White background
├─ Hover: Background #F9FAFB, Level 3 shadow
├─ Selected: Blue border 2px, background tint
├─ Disabled: Opacity 0.5, gray-out

Content:
├─ Image/Avatar: 64x64px, rounded 8px
├─ Name: H4 (18px, semibold)
├─ Specialty: 14px gray text
├─ Rating: Star icon + number
├─ Location: 12px gray, with icon
└─ Action buttons: Primary + Secondary

Card Variants:
├─ Doctor Card: Profile info + selection
├─ Time Slot Card: Clickable time option
├─ Appointment Card: Summary + actions
└─ Info Card: Notification/message card
```

### 2.4 Calendar & Time Picker

```
APPOINTMENT CALENDAR:

     December 2024
Mo Tu We Th Fr Sa Su
                   1
2  3  4  5  6  7  8
9  10 11 12 13 14 15  ← Today highlighted with blue background
...

Features:
├─ Month/Year navigation with arrows
├─ Today highlighted (blue background)
├─ Disabled dates (weekends, no slots) grayed out
├─ Selected date highlighted (darker blue)
├─ Hover effect on selectable dates
├─ Show slot availability in subtle color

TIME SLOT SELECTOR:

Available Times for Doctor on Dec 12, 2024

Morning       |  Afternoon      |  Evening
┌─────────┐   ┌──────────┐     ┌──────────┐
│ 09:00   │   │ 02:00 PM │     │ 06:00 PM │
│ 09:30   │   │ 02:30 PM │     │ 06:30 PM │
│ 10:00 ✓ │   │ 03:00 PM │     │ 07:00 PM │
│ 10:30   │   │ 03:30 PM │     ├──────────┤
├─────────┤   │ 04:00 PM │     No evening
│ 11:00   │   │ 04:30 PM │     slots available
│ 11:30   │   └──────────┘
└─────────┘

Features:
├─ Group by time period (Morning/Afternoon/Evening)
├─ Click to select time
├─ Selected time highlighted (blue)
├─ Disabled slots grayed out (unavailable)
├─ Scrollable on mobile
└─ Show confirmation text: "Selected: 10:00 AM"

Mobile Time Picker:
├─ Native input type="time" or custom picker
├─ Wheel-style picker UI
├─ 15-minute intervals
└─ Confirm/Cancel buttons
```

### 2.5 Modals & Dialogs

```
MODAL STRUCTURE:

┌────────────────────────────────────────┐
│ ✕ Dialog Title                         │ ← Close button (top right)
├────────────────────────────────────────┤
│                                        │
│ Dialog content area                    │
│ - Form fields                          │
│ - Information                          │
│ - Options                              │
│                                        │
├────────────────────────────────────────┤
│      [Cancel]         [Confirm]        │ ← Action buttons
└────────────────────────────────────────┘

Modal Specs:
├─ Overlay: Solid black with 40% opacity
├─ Background Click: Close modal (optional)
├─ Max-width: 500px (desktop), 90vw (mobile)
├─ Border Radius: 12px
├─ Padding: 24px
├─ Shadow: Level 4 (highest)
├─ Animation: Fade in/out (200ms)
└─ Backdrop Blur: Optional, subtle

Close Button:
├─ Top-right corner
├─ 24x24px
├─ Icon: ✕ (X mark)
├─ Hover: Background light gray

Button Layout:
├─ Desktop: Buttons aligned right, gap 12px
├─ Mobile: Stack vertically, full width
├─ Primary button last (right-most)
└─ Minimum padding: 8px around buttons

Animations:
├─ Entrance: Scale up from center (200ms easing)
├─ Exit: Scale down to center (150ms easing)
└─ Smooth: cubic-bezier(0.16, 1, 0.3, 1)

Dialog Types:
├─ Confirmation: Simple message + action
├─ Form: Input fields + validation
├─ Alert: Important notification
└─ Selection: Choose from options
```

---

## 3. PAGE LAYOUTS & USER FLOWS

### 3.1 Patient Portal - Appointment Booking Flow

```
STEP 1: BOOKING INITIATION

┌─────────────────────────────────────────────────┐
│ Book an Appointment                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Choose how to book:                             │
│                                                 │
│ [📞] Call our Voice Agent  (24/7 Available)    │
│ │ - Talk naturally                              │
│ │ - Instant confirmation                        │
│ │                                               │
│                                                 │
│ [🌐] Online Booking         (Anytime)          │
│ │ - Browse doctors                              │
│ │ - Choose time slot                            │
│ │ - Fill appointment details                    │
│                                                 │
│ ─────────────────────────────────────────       │
│ Already have an appointment?                    │
│ [View My Appointments] [Reschedule]             │
└─────────────────────────────────────────────────┘

STEP 2: SELECT DOCTOR

┌─────────────────────────────────────────────────┐
│ Back | Select Doctor                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ Filters:   [Specialization ▼] [Location ▼]    │
│            [Rating ▼] [Availability ▼]        │
│                                                 │
│ Search:    [Search by doctor name...]          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌────────────────────────┐ ┌─────────────────┐│
│ │ Dr. Sarah Johnson      │ │ Dr. James Brown ││
│ │ 👩‍⚕️ Cardiologist       │ │ 👨‍⚕️ Surgeon      ││
│ │ ⭐ 4.8 (120 reviews)  │ │ ⭐ 4.6 (85)     ││
│ │ 📍 Main Clinic         │ │ 📍 Downtown     ││
│ │ 🕐 Available today    │ │ 🕐 Tomorrow     ││
│ │ [SELECT]               │ │ [SELECT]        ││
│ └────────────────────────┘ └─────────────────┘│
│                                                 │
│ [Load More Doctors]                            │
└─────────────────────────────────────────────────┘

STEP 3: SELECT DATE & TIME

┌─────────────────────────────────────────────────┐
│ Back | Select Date & Time                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ Dr. Sarah Johnson - Cardiologist                │
│                                                 │
│        December 2024                            │
│ Mo Tu We Th Fr Sa Su                            │
│                   1                             │
│ 2  3  4 [5]  6  7  8  ← Today                  │
│ 9  10 11 12 13 14 15                           │
│                                                 │
│ Available Times - Friday, Dec 5, 2024           │
│                                                 │
│ Morning              Afternoon                  │
│ [09:00] [09:30]     [02:00] [02:30]            │
│ [10:00] [10:30]     [03:00] [03:30] ✓ Selected│
│ [11:00] [11:30]     [04:00]                    │
│                                                 │
│ [Back] [Next: Confirm Appointment]             │
└─────────────────────────────────────────────────┘

STEP 4: APPOINTMENT DETAILS & CONFIRMATION

┌─────────────────────────────────────────────────┐
│ Back | Confirm Your Appointment                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Appointment Summary                             │
│ ─────────────────────────────────────────       │
│ Doctor:      Dr. Sarah Johnson                  │
│ Specialty:   Cardiology                         │
│ Clinic:      Main Medical Center                │
│ Date:        Friday, December 5, 2024           │
│ Time:        03:00 PM (30 minutes)             │
│                                                 │
│ Reason for Visit: ________________________      │
│ (Optional notes)                                │
│                                                 │
│ ☑ Send me SMS reminders                        │
│ ☑ Send me email reminders                      │
│ ☑ I agree to the terms                         │
│                                                 │
│            [Cancel]  [Confirm Booking]         │
└─────────────────────────────────────────────────┘

CONFIRMATION SCREEN

┌─────────────────────────────────────────────────┐
│ ✓ Appointment Confirmed!                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ Booking ID: #APT-2024-12-05-001                │
│                                                 │
│ Your appointment with Dr. Sarah Johnson is     │
│ confirmed for:                                  │
│                                                 │
│ Friday, December 5, 2024 at 03:00 PM           │
│ Main Medical Center                             │
│                                                 │
│ ✓ Confirmation sent to:                        │
│   • SMS: +1 (555) 123-4567                     │
│   • Email: patient@example.com                 │
│                                                 │
│ Next Steps:                                     │
│ • Arrive 10 minutes early                      │
│ • Bring insurance card                         │
│ • Bring photo ID                               │
│                                                 │
│ [Add to Calendar]  [View Appointment]          │
└─────────────────────────────────────────────────┘
```

### 3.2 Appointment Management Page

```
MY APPOINTMENTS

┌─────────────────────────────────────────────────┐
│ My Appointments                                 │
├─────────────────────────────────────────────────┤
│ Filter: [Upcoming ▼] [All Appointments]        │
│                                                 │
├─────────────────────────────────────────────────┤
│ UPCOMING APPOINTMENTS (3)                       │
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Dr. Sarah Johnson - Cardiology               ││
│ │ Friday, Dec 5, 2024 at 3:00 PM              ││
│ │ Main Medical Center                          ││
│ │ Booking ID: #APT-2024-12-05-001             ││
│ │ Status: ✓ Confirmed                          ││
│ │                                              ││
│ │ [Reschedule] [Cancel] [Add to Calendar]     ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Dr. James Brown - Surgery                    ││
│ │ Wednesday, Dec 10, 2024 at 10:00 AM         ││
│ │ Downtown Clinic                              ││
│ │ Booking ID: #APT-2024-12-10-002             ││
│ │ Status: ⏳ Pending Confirmation               ││
│ │                                              ││
│ │ [Reschedule] [Cancel]                        ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ PAST APPOINTMENTS (5)                          │
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Dr. Michael Lee - General Practice           ││
│ │ Monday, Nov 28, 2024 at 2:00 PM (Completed) ││
│ │ Booking ID: #APT-2024-11-28-001             ││
│ │                                              ││
│ │ [View Details] [Reschedule] [Leave Review]  ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ [Load More]                                    │
└─────────────────────────────────────────────────┘
```

### 3.3 Doctor Dashboard - Schedule View

```
DOCTOR SCHEDULE

┌─────────────────────────────────────────────────┐
│ My Schedule                                     │
├─────────────────────────────────────────────────┤
│ View: [Day ▼] [Week] [Month]                  │
│ Date: December 5, 2024  [◀ Previous] [Next ▶] │
│                                                 │
├─────────────────────────────────────────────────┤
│ TIME    | PATIENT              | STATUS  | ACTIONS
│ ─────────────────────────────────────────────────
│ 09:00   | John Smith           | ✓ Ready | •••
│ 09:30   | [Available]          | -       | [Add]
│ 10:00   | Sarah Davis          | ⏳ Check-in | •••
│ 10:30   | [Available]          | -       | [Add]
│ 11:00   | [BREAK]              | -       | [Edit]
│ 11:30   | Michael Johnson      | ✓ Confirmed | •••
│ 12:00   | [Lunch Break]        | -       | [Edit]
│ ─────────────────────────────────────────────────
│ 02:00   | Emily Wilson         | ✓ Ready | •••
│ 02:30   | [Available]          | -       | [Add]
│ 03:00   | [No-Show 5 min ago]  | ✗       | [Action]
│ 03:30   | [Available]          | -       | [Add]
│ 04:00   | Robert Brown         | ⏳ Waiting | •••
│
│ Legend:
│ ✓ Ready      - Patient checked in
│ ⏳ Check-in   - Awaiting patient check-in
│ ✓ Confirmed  - Appointment confirmed
│ ✗ No-Show    - Patient did not arrive
│ [Available]  - Open slot
│
│ Quick Stats:
│ Today's Appointments: 12
│ Confirmed: 11 | Pending: 1 | No-Shows: 0
└─────────────────────────────────────────────────┘
```

### 3.4 Clinic Admin Dashboard

```
CLINIC ADMINISTRATION

┌─────────────────────────────────────────────────┐
│ Dashboard                                       │
├─────────────────────────────────────────────────┤
│ [📊 Overview] [👥 Patients] [👨‍⚕️ Doctors] [⚙️ Settings]
│                                                 │
├─────────────────────────────────────────────────┤
│ TODAY'S METRICS                                 │
│ ┌──────────┬──────────┬──────────┬──────────┐  │
│ │ 24       │ 22       │ 2        │ 91.7%    │  │
│ │ Appts    │ Confirmed│ Pending  │ Completion│ │
│ └──────────┴──────────┴──────────┴──────────┘  │
│                                                 │
│ WEEKLY REVENUE                                  │
│ Dec 1-7: $8,640  |  Avg per appt: $120        │
│                                                 │
│ THIS WEEK'S SCHEDULE                           │
│ ┌─────────────────────────────────────────────┐│
│ │ Mon: 18 appointments | $2,160               ││
│ │ Tue: 20 appointments | $2,400               ││
│ │ Wed: 22 appointments | $2,640               ││
│ │ Thu: 19 appointments | $2,280               ││
│ │ Fri: 16 appointments | $1,920               ││
│ │ Sat: 5 appointments  | $600                 ││
│ │ Sun: Closed                                  ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ TOP PERFORMING DOCTORS                         │
│ 1. Dr. Sarah Johnson   - 45 appts this month  │
│ 2. Dr. Michael Lee     - 38 appts this month  │
│ 3. Dr. Emily Brown     - 32 appts this month  │
│                                                 │
│ NO-SHOWS THIS WEEK                             │
│ • John Smith - Mon 2 PM (4 consecutive)       │
│ • Robert Davis - Wed 10 AM (2 consecutive)   │
│ → Send personalized reminder                  │
│                                                 │
│ PENDING ACTIONS                                │
│ ☐ Approve new doctor registration (Dr. Park) │
│ ☐ Update clinic hours for holiday            │
│ ☐ Review HIPAA audit report                   │
└─────────────────────────────────────────────────┘
```

---

## 4. RESPONSIVE DESIGN BREAKPOINTS

```
Desktop-First Approach:

Breakpoints:
├─ Desktop (1024px and up)
│  ├─ 12-column layout
│  ├─ Sidebar navigation
│  ├─ Full calendar view
│  └─ Cards in grid (3+ columns)
│
├─ Tablet (768px to 1023px)
│  ├─ 8-column layout
│  ├─ Collapsible sidebar
│  ├─ Week view calendar
│  └─ Cards in 2 columns
│
└─ Mobile (below 768px)
   ├─ Full-width single column
   ├─ Bottom tab navigation
   ├─ Day view calendar
   └─ Single column cards

Responsive Components:

Buttons:
├─ Mobile: Full width, 44px height (thumb-friendly)
├─ Tablet: 40px height, side-by-side
└─ Desktop: Standard sizing

Forms:
├─ Mobile: Single column, full width
├─ Tablet: 2-column grid
└─ Desktop: 3-column grid

Navigation:
├─ Mobile: Bottom tab bar (5 items max)
├─ Tablet: Collapsible sidebar + top nav
└─ Desktop: Permanent sidebar navigation

Images:
├─ Mobile: 100vw width (viewport width)
├─ Tablet: 90vw width
└─ Desktop: Fixed width containers
```

---

## 5. ACCESSIBILITY & WCAG 2.1 AA COMPLIANCE

```
Color Contrast:
├─ Minimum 4.5:1 for normal text (AA)
├─ Minimum 3:1 for large text (18pt+)
├─ Don't rely on color alone (use text + icons)
└─ Test with: WebAIM Contrast Checker

Keyboard Navigation:
├─ Tab through all interactive elements in logical order
├─ Focus indicators visible (outline or highlight)
├─ Skip to main content link (hidden, visible on focus)
├─ All modals have initial focus set
└─ Escape key closes modals/dropdowns

Screen Reader Support:
├─ Use semantic HTML (button, nav, main, article)
├─ Add ARIA labels for icon-only buttons
├─ Use aria-live for dynamic updates
├─ Form fields linked with labels (label for="id")
├─ Images have alt text
└─ Links have descriptive text (not "Click here")

Text & Readability:
├─ Minimum 16px font size (mobile)
├─ Line height minimum 1.5x font size
├─ Letter spacing: 0.12x font size
├─ Avoid long paragraphs (max 80 characters)
├─ Sufficient white space between elements
└─ No blinking/flashing (>3x per second)

Focus Management:
├─ Focus visible at all times (outline 2px solid)
├─ Focus trap in modals (cycle through elements)
├─ Focus restoration when modal closes
└─ Skip links functional and properly focused

Animation & Motion:
├─ Respect prefers-reduced-motion setting
├─ Animations under 5 seconds duration
├─ No auto-playing videos
├─ Test with accessibility testing tools

Implementation:
├─ Use semantic HTML elements
├─ ARIA attributes only when needed
├─ Test with: WAVE, axe DevTools, Lighthouse
├─ Screen reader testing: NVDA (Windows), JAWS
└─ Manual testing with keyboard only
```

---

## 6. ANIMATIONS & INTERACTIONS

```
Micro-interactions:

Button Press:
├─ Duration: 100ms
├─ Easing: cubic-bezier(0.16, 1, 0.3, 1)
├─ Scale: 0.98x (subtle press effect)
└─ Visual feedback: Color + scale change

Hover Effects:
├─ Duration: 200ms (smooth)
├─ Shadow elevation: Increase shadow level
├─ Color: Slightly darker/lighter
├─ Transform: Subtle lift (translateY -2px)
└─ Cursor: Change to pointer on interactive

Loading States:
├─ Spinner animation: Rotate 360° over 1s (infinite)
├─ Pulse animation: Fade in/out over 2s (infinite)
├─ Skeleton loader: Shimmer effect
└─ Progress indicator: Animated bar

Page Transitions:
├─ Entrance: Fade in + slight up (200ms)
├─ Exit: Fade out (100ms)
├─ Tab/Page change: Cross-fade (150ms)
└─ Easing: cubic-bezier(0.4, 0, 0.2, 1)

Form Validation:
├─ Valid state: Green checkmark fade in (150ms)
├─ Error shake: 100ms shake animation
├─ Error message: Slide down + fade (200ms)
└─ Input highlight: Blue border highlight

Notifications:
├─ Entrance: Slide in from top-right (200ms)
├─ Exit: Slide out + fade (200ms)
├─ Auto-dismiss: After 5 seconds (configurable)
└─ Stacking: Max 3 notifications, others queue

Performance Guidelines:
├─ Use CSS animations (GPU-accelerated)
├─ Avoid animating: width, height, left/right/top/bottom
├─ Use: transform, opacity instead
├─ Frame rate: 60fps (16.67ms per frame)
├─ Test on low-end devices
└─ Respect prefers-reduced-motion
```

---

## 7. DARK MODE DESIGN

```
Color Palette - Dark Mode:

Primary: #1B5E7A → #4B9FC4 (lighter for contrast)
Background: #F9FAFB → #111827 (dark gray-black)
Surface: #FFFFFF → #1F2937 (dark card background)
Text Primary: #1F2937 → #F9FAFB (light text)
Text Secondary: #6B7280 → #D1D5DB (lighter gray)
Borders: #E5E7EB → #374151 (light gray)

Status Colors (Dark Mode):
├─ Success: #10B981 (more luminous)
├─ Error: #F87171 (lighter red)
├─ Warning: #FBBF24 (lighter amber)
├─ Info: #60A5FA (lighter blue)
└─ Ensure 4.5:1 contrast ratio

Implementation:
├─ CSS variables for color tokens
├─ Detect: prefers-color-scheme media query
├─ User toggle: Remember preference in localStorage
├─ Smooth transition: 200ms between modes
└─ Test all components in both modes
```

---

## 8. DESIGN SPECIFICATIONS FILE

All design files (Figma/Adobe XD) should include:

```
Component Library Export:
├─ Buttons (all states)
├─ Form inputs (all states)
├─ Cards (all variants)
├─ Modals
├─ Navigation components
├─ Icons (24x24, 32x32)
├─ Color swatches
├─ Typography samples
└─ Spacing grid

Documentation:
├─ Component usage guidelines
├─ Do's and Don'ts
├─ Interaction patterns
├─ Responsive behavior
├─ Accessibility notes
└─ Animation specifications

File Organization:
├─ Base Components (buttons, inputs, cards)
├─ Composite Components (forms, tables)
├─ Layouts (pages, sections)
├─ Prototypes (user flows)
└─ Handoff (marked up for developers)
```

---

## 9. DESIGN QA CHECKLIST

```
✓ Visual Design
  ☐ All colors from approved palette
  ☐ Typography follows hierarchy
  ☐ Spacing consistent with 8px grid
  ☐ Icons consistent style/size
  ☐ Shadows consistent

✓ Responsive Design
  ☐ Mobile (320px - 767px)
  ☐ Tablet (768px - 1023px)
  ☐ Desktop (1024px+)
  ☐ No horizontal scrolling
  ☐ Touch targets ≥44px

✓ Accessibility
  ☐ Color contrast ≥4.5:1
  ☐ Keyboard navigation works
  ☐ Focus indicators visible
  ☐ Form labels present
  ☐ Alt text for images

✓ Interactions
  ☐ Buttons have hover/active states
  ☐ Forms show validation feedback
  ☐ Modals have close button
  ☐ Loading states clear
  ☐ Error messages helpful

✓ Content
  ☐ Spelling & grammar correct
  ☐ Microcopy consistent tone
  ☐ Instructions clear
  ☐ Error messages friendly
  ☐ Help text adequate
```

---

**Document End**
