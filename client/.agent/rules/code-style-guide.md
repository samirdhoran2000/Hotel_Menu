---
trigger: always_on
---

# React + Tailwind CSS Style Guide

> Principles: DRY · SOLID · Modular · Mobile-First · Scalable

## Project Structure (Feature-Based)
```
src/
├── components/
├── features/
│   └── feature-name/
│       ├── components/
│       ├── hooks/
│       └── services/
├── hooks/
├── services/
├── utils/
├── constants/
└── App.jsx
```

## Component Rules
- One responsibility per component
- UI in components
- Logic in hooks
- API calls in services
- Components < 200 lines

## Naming Conventions
- Components: PascalCase
- Hooks: useSomething
- Files: camelCase / kebab-case
- Booleans: is / has / can

## Tailwind CSS Rules
- Mobile styles by default
- No long inline class strings
- Extract reusable styles
- Use clsx for conditional classes
- No duplicated utilities

## DRY
- Reuse components
- Reuse hooks
- Reuse styles
- No copy-paste logic

## SOLID (React)
- S: UI / Logic / API separation
- O: Extend via props
- L: Interchangeable components
- I: Small, focused props
- D: Depend on services

## Hooks
- Encapsulate logic & side effects
- No UI in hooks
- Return minimal state/actions

## State Management
- Local UI → useState
- Shared → Context
- Server → React Query

## Mobile-First Responsive UI

### Core Rules
- Mobile is default
- Design for 320px first
- Desktop is enhancement
- Touch targets ≥ 44px

### Breakpoints (Tailwind)
```
base → mobile
sm   → 640px
md   → 768px
lg   → 1024px
xl   → 1280px
2xl  → 1536px
```

### Layout
```jsx
<div className="flex flex-col md:flex-row gap-4" />
```

### Width & Spacing
```jsx
<div className="w-full max-w-md md:max-w-2xl" />
```

### Typography
```jsx
<h1 className="text-lg md:text-xl lg:text-2xl" />
```

### Touch-Friendly UI
```jsx
<button className="min-h-[44px] px-4 py-2" />
```

### Images
```jsx
<img className="w-full h-auto object-cover" />
```

### Lists / Tables
- Avoid tables on mobile
- Use stacked cards

### Overflow Handling
```jsx
<p className="break-words truncate md:whitespace-normal" />
```

### Navigation
- Mobile: Drawer / Bottom nav
- Desktop: Sidebar / Top nav

## Performance
- React.memo
- useCallback
- useMemo
- Virtualize long lists
- Avoid heavy animations on mobile

## Review Checklist
- Feature-based structure
- No inline API calls
- No duplicated Tailwind styles
- Mobile works at 320px
- Touch-friendly UI
- Clear naming

## Golden Rules
- Small components
- Clean separation
- Mobile-first always
- Predictable structure
- No god components
