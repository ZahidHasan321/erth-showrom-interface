# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the ERTH Showroom interface - a React + TypeScript + Vite application for managing a custom garment/tailoring showroom. The application handles customer orders, measurements, fabric selections, and inventory management using Airtable as a backend database.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Environment Setup

The application requires a `VITE_API_BASE_URL` environment variable in `.env`:
- Production: AWS Lambda API endpoint
- Development: `http://localhost:8000`

## Architecture

### Tech Stack
- **Framework**: React 19 with TanStack Router (file-based routing)
- **Build Tool**: Vite with React Compiler plugin
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: Zustand with devtools
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Airtable via REST API (Python FastAPI backend)

### Project Structure

```
src/
├── api/              # API client functions for Airtable operations
├── components/
│   ├── forms/        # Multi-step form components (customer, measurements, fabric, etc.)
│   ├── global/       # Global UI components (error boundaries, etc.)
│   ├── ui/           # Shadcn/ui components (buttons, dialogs, etc.)
│   └── orders-at-showroom/  # Order management components
├── hooks/            # Custom React hooks
├── lib/
│   ├── *-mapper.ts   # Data transformation between API and form schemas
│   ├── utils.ts      # Utility functions
│   └── constants/    # App-wide constants
├── routes/
│   ├── $main/        # Main application routes
│   │   └── orders/   # Order management pages
│   └── (auth)/       # Auth-related routes
├── schemas/          # Zod schemas for complex data structures
├── store/            # Zustand stores (work order, sales order state)
└── types/            # TypeScript interfaces for API entities
```

### Core Concepts

#### Multi-Step Order Workflow
The application uses a stepper pattern for creating work orders and sales orders:

1. **Demographics** - Customer information (name, phone, address)
2. **Measurements** - Body measurements for tailoring
3. **Fabric Selection** - Fabric choice, color, length
4. **Shelved Products** - Additional items from inventory
5. **Order & Payment** - Payment type, delivery method, pricing
6. **Confirmation** - Final review and submission

Each step has its own:
- Form schema (`schema.ts`) with Zod validation
- Form component (in `components/forms/`)
- State stored in Zustand (see `store/current-work-order.ts` or `store/current-sales-order.ts`)

#### Data Flow Pattern

The application follows this pattern for all entities:

1. **API Types** (`src/types/*.ts`) - Airtable record structure with `id`, `createdTime`, and `fields`
2. **Form Schemas** (`src/schemas/*.ts` or in form component folders) - UI-friendly structure
3. **Mappers** (`src/lib/*-mapper.ts`) - Transform between API and form formats
   - `mapApiXToFormX()` - API → Form
   - `mapFormXToApiX()` - Form → API

Example: `Customer` (API) ↔ `CustomerDemographicsSchema` (Form)

#### API Integration

All API calls go through `src/api/baseApi.ts` which provides:
- `getRecords<T>(tableName)` - Fetch all records
- `getRecordById<T>(tableName, id)` - Fetch single record
- `searchRecords<T>(tableName, query)` - Search with Airtable formula
- `searchAllRecords<T>(tableName, fields)` - Search by field matching
- `createRecord<T>(tableName, record)` - Create new record
- `updateRecord<T>(tableName, id, fields)` - Update existing record
- `upsertRecords<T>(tableName, records, keyFields)` - Batch upsert

Entity-specific APIs wrap these base functions (e.g., `src/api/customers.ts`, `src/api/orders.ts`).

#### State Management

Two main Zustand stores manage order state:

1. **Work Orders** (`createWorkOrderStore`) - Custom tailoring orders with measurements
2. **Sales Orders** (`createSalesOrderStore`) - Simple product sales from shelves

Both stores track:
- Current step in multi-step form
- Form data for each step
- Order ID and customer demographics
- Payment and pricing information
- Saved steps (validation checkpoints)

#### Routing

Uses TanStack Router with:
- File-based routing in `src/routes/`
- Route tree auto-generated in `src/routeTree.gen.ts` (DO NOT edit manually)
- Path aliases: `@/` maps to `src/`
- Route groups: `(auth)` for authenticated routes, `$main` for main app

## Key Patterns

### Form Validation
All forms use Zod schemas with `react-hook-form`:
```typescript
const form = useForm<SchemaType>({
  resolver: zodResolver(schema),
  defaultValues: defaults,
});
```

### Data Transformation
Always use mappers when moving between API and forms:
```typescript
// Reading from API
const formData = mapApiCustomerToFormCustomer(apiCustomer);

// Writing to API
const apiPayload = mapFormCustomerToApiCustomer(formData, recordId);
```

### TanStack Query Patterns
- Query keys use array format: `['customers', customerId]`
- Mutations invalidate related queries after success
- `staleTime` and `gcTime` set to `Infinity` for reference data (prices, campaigns)

## Common Tasks

### Adding a New Form Step
1. Create schema in `src/components/forms/[step-name]/schema.ts`
2. Create form component in `src/components/forms/[step-name]/index.tsx`
3. Add step to the stepper in the order page (e.g., `new-work-order.tsx`)
4. Update Zustand store to include new step data
5. Update order mapper to transform new fields

### Adding a New API Entity
1. Define TypeScript interface in `src/types/[entity].ts`
2. Create API functions in `src/api/[entity].ts` using `baseApi.ts`
3. Create mapper functions in `src/lib/[entity]-mapper.ts`
4. Add TanStack Query hooks in components

### Working with Airtable Fields
- Airtable records have structure: `{ id: string, createdTime: string, fields: {...} }`
- Linked records are arrays of record IDs: `CustomerID: string[]`
- Field names are PascalCase in API, camelCase in forms
- Use mappers to handle this transformation consistently

## Styling Conventions

### Design System

The application uses a consistent design system based on Tailwind CSS with shadcn/ui components:

**Color Palette:**
- `primary` - Main brand color (used for CTAs, active states, important text)
- `secondary` - Accent color (used for highlights, secondary actions)
- `destructive` - Error/danger states
- `muted` - Subtle backgrounds and secondary text
- `accent` - Slight emphasis backgrounds
- `border` - Border colors with `/60` opacity variant for softer borders
- `background` - Main background color
- `card` - Card/panel backgrounds
- `foreground` - Primary text color
- `muted-foreground` - Secondary text color

**Note:** Avoid hardcoded colors like `green-500`, `purple-600`, etc. Always use semantic color tokens.

### Form Layout Patterns

All multi-step forms follow this consistent structure:

```tsx
<Form {...form}>
  <motion.form
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-8 w-full"
  >
    {/* Title Section */}
    <motion.div variants={itemVariants} className="flex justify-between items-start mb-2">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground bg-linear-to-r from-primary to-secondary bg-clip-text">
          Form Title
        </h1>
        <p className="text-sm text-muted-foreground">Descriptive subtitle</p>
      </div>
    </motion.div>

    {/* Content Sections */}
    <motion.div variants={itemVariants} className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Section Title</h3>
      {/* Form fields */}
    </motion.div>

    {/* Action Buttons */}
    <motion.div variants={itemVariants} className="flex gap-4 justify-end">
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Save →</Button>
    </motion.div>
  </motion.form>
</Form>
```

**Animation Variants:**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
```

### Card/Section Styling

**Standard Card:**
```tsx
<div className="bg-card p-6 rounded-xl border border-border shadow-sm">
  {/* Content */}
</div>
```

**Card with Header:**
```tsx
<section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
  <header className="bg-primary text-primary-foreground px-6 py-4">
    <h3 className="text-lg font-semibold">Section Title</h3>
  </header>
  <div className="p-6 space-y-4">
    {/* Content */}
  </div>
</section>
```

### Input Field Styling

**Standard Input:**
```tsx
<Input
  placeholder="Enter value"
  className="bg-background border-border/60"
  {...field}
/>
```

**Read-only Input:**
```tsx
<Input
  readOnly
  className="bg-muted border-border/60"
  {...field}
/>
```

### Button Conventions

**Action Buttons:**
All buttons should use lucide-react icons instead of emojis. Import icons from `lucide-react` and use them with consistent sizing (`w-4 h-4`) and spacing (`mr-2` for left icons, `ml-2` for right icons).

- `Continue/Proceed`: `<ArrowRight className="w-4 h-4 ml-2" />` - Icon on right
- `Save`: `<Save className="w-4 h-4 mr-2" />` - "Save Changes" or "Saving..."
- `Edit`: `<Pencil className="w-4 h-4 mr-2" />` - "Edit [Entity]"
- `Cancel`: `<X className="w-4 h-4 mr-2" />` - "Cancel"
- `Create/Confirm`: `<Check className="w-4 h-4 mr-2" />` - "Create [Entity]" or "Confirm Order"
- `Add`: `<Plus className="w-4 h-4 mr-2" />` - "Add Item"
- `Print`: `<Printer className="w-4 h-4 mr-2" />` - "Print Invoice"

Example:
```tsx
import { Save, Pencil, X, Check, Plus, ArrowRight } from "lucide-react";

// Save button
<Button type="submit" disabled={isSaving}>
  <Save className="w-4 h-4 mr-2" />
  {isSaving ? "Saving..." : "Save Changes"}
</Button>

// Continue button with icon on right
<Button onClick={onProceed}>
  Continue to Next Step
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
```

**Button Variants:**
- Primary action: `<Button>Text</Button>`
- Secondary action: `<Button variant="secondary">Text</Button>`
- Cancel/Destructive: `<Button variant="outline">Text</Button>`

### Typography Hierarchy

- **Page Title**: `text-3xl font-bold text-foreground`
- **Section Title**: `text-lg font-semibold text-foreground`
- **Subsection**: `text-base font-semibold text-foreground`
- **Description**: `text-sm text-muted-foreground`
- **Label**: `font-medium` or `font-semibold` for required fields
- **Required Field Indicator**: `<span className="text-destructive">*</span>`

### Spacing Conventions

- Form spacing: `space-y-8` (main sections), `space-y-4` (within sections)
- Card padding: `p-6`
- Section gaps: `gap-4` or `gap-6`
- Button groups: `gap-4`
- Grid gaps: `gap-6` (large), `gap-4` (medium)

### Animation Patterns

**Framer Motion Usage:**
- Use `motion.section` with `layout` and `smoothTransition` for collapsible/expandable sections
- Use `AnimatePresence` for conditional content with enter/exit animations
- Use staggered animations for form sections with `containerVariants` and `itemVariants`

**Smooth Transition:**
```typescript
const smoothTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
};
```

**Expandable Section Pattern:**
```tsx
<motion.div layout transition={smoothTransition}>
  <AnimatePresence mode="wait">
    {isExpanded && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        {/* Content */}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

### Interactive Elements

**Hover States:**
- Clickable cards: `hover:border-primary hover:shadow-sm`
- Buttons: Use variant-specific hover states
- Links: `hover:text-primary`

**Active States:**
- Selected items: `border-primary ring-2 ring-primary/20`
- Active indicators: `bg-primary border-primary text-primary-foreground`

**Disabled States:**
- Always include: `disabled={isDisabled}` AND `className` with `opacity-50 cursor-not-allowed`

### Grid Layouts

**Responsive Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Items */}
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Larger breakpoint */}
</div>
```

### Error Boundaries

Wrap complex sections with ErrorBoundary:
```tsx
<ErrorBoundary fallback={<div>Section crashed</div>}>
  {/* Complex component */}
</ErrorBoundary>
```

## Important Notes

- The `routeTree.gen.ts` file is auto-generated by TanStack Router plugin - never edit it manually
- Path alias `@/` is configured in both `vite.config.ts` and `tsconfig.json`
- React Compiler plugin is enabled - avoid unnecessary memoization
- Bundle splitting configured for vendor and zod packages in `vite.config.ts`
- All Airtable operations go through the backend API (not directly to Airtable)
- **Always use semantic color tokens** (`primary`, `secondary`, etc.) instead of hardcoded colors
- **Maintain consistent animation patterns** across forms for better UX
