---
description: Search for code with surrounding context preview
---

# Context Search Workflow

Use this when you need to find code AND see what's around it without opening the full file.

## Basic Context Search

```powershell
Select-String -Path "path/to/file" -Pattern "search-term" -SimpleMatch -Context 5,5
```

**Parameters:**

- `-Context 5,5` = Show 5 lines before and 5 lines after the match
- `-SimpleMatch` = Literal string search (no regex)
- Adjust context numbers based on how much preview you need (e.g., `-Context 3,8`)

## Common Use Cases

### Find a class name and see its usage

```powershell
Select-String -Path "components/ui/ProductCanvas.tsx" -Pattern "pos-system-footer" -SimpleMatch -Context 5,5
```

### Find multiple occurrences in multiple files

```powershell
Select-String -Path "src/**/*.tsx" -Pattern "className=" -SimpleMatch -Context 2,2 | Select-Object -First 10
```

### Case-insensitive search with preview

```powershell
Select-String -Path "file.ts" -Pattern "variable" -SimpleMatch -CaseInsensitive -Context 3,3
```

## Why Use This?

✅ **Faster than**: grep (broken) → view_file → read lines
✅ **Shows context**: See surrounding code immediately
✅ **Reliable**: PowerShell works when grep fails
✅ **Adjustable**: Change context window as needed

## Tips

- **Small context (2-3)**: Quick checks, finding line numbers
- **Medium context (5-8)**: Understanding structure
- **Large context (10-15)**: Seeing full functions/blocks
