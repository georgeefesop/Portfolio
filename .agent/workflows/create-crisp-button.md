---
description: Create buttons with razor-sharp, liquid-like edges using the Contrast+Crop technique
---

# Super Crisp "Liquid Edge" Button Workflow

Use this workflow when you need UI elements (buttons, pills, toggles) with **razor-sharp, pixel-perfect edges** that standard CSS border-radius and anti-aliasing cannot achieve. This is especially useful for "stencil" effects or complex transparency masks.

## The Core Concept: "Contrast & Crop"

Standard CSS blurring results in fuzzy, semi-transparent pixels at vector edges (aliasing). We fix this by:

1. **Blurring** the shape to create a gradient.
2. **Thresholding** with High Contrast to force pixels to be either 0% or 100% opacity (binary edge).
3. **Cropping** the visual artifacts ("bleed") that result from this process.
4. **Supersampling** for sub-pixel precision.

---

## Step 1: Supersampling Structure

Build the element larger than its display size, then scale it down. This gives the browser more pixels to calculate the initial curves.

- **Build Size**: 1.25x (e.g., 375px for a 300px button)
- **Display Scale**: 0.8x (reduces back to target size)

```tsx
<div style={{ width: 300, height: 56 }} className="relative">
    <button
        style={{
            width: 375, // Built larger
            height: 70,
            transform: 'scale(0.8) translateZ(0)', // Scaled down + GPU Force
            transformOrigin: 'top left',
        }}
    >
       {/* Content */}
    </button>
</div>
```

---

## Step 2: The Contrast Trick (Liquid Edges)

Apply a high contrast filter to the **parent container**. This thresholding "eats" blur gradients and turns them into sharp lines.

```css
.button-container {
    filter: contrast(30); /* Forces binary opacity */
    background: transparent;
}
```

Then, inside the button, apply a **heavy blur** to the background or mask layer. The contrast filter will sharpen this blur into a crisp edge.

```css
.inner-layer {
    backdrop-filter: blur(10px); /* Provides the gradient for contrast to eat */
}
```

---

## Step 3: The Crop (Fixing Edge Bleed)

The Blur+Contrast technique often leaves a white "fuzz" or halo at the bounding box of the element. We must push this artifact off-canvas.

1. **Scale Up Inner Layers**: Scale the inner content/background to `1.1x`.
2. **Clip Parent**: Set `overflow: hidden` on the parent button.

```tsx
<button className="overflow-hidden ...">
    <div 
        className="absolute inset-0 scale-110" // Pushes edge bleed outside
        style={{ backdropFilter: 'blur(10px)' }} 
    />
</button>
```

---

## Step 4: SVG & Text Precision

If using SVG masks or text, force the browser to prioritize geometry over speed.

```tsx
// Inside SVG Data URI or props
shape-rendering="geometricPrecision"
text-rendering="geometricPrecision"
```

---

## Complete Component Recipe (Tailwind + React)

```tsx
<div className="relative w-[300px] h-[56px]">
    <button
        className="group relative w-[375px] h-[70px] origin-top-left overflow-hidden rounded-full transition-transform"
        style={{
            transform: 'scale(0.8) translateZ(0)', // 1. Supersample
            filter: 'contrast(30)',                // 2. Contrast Threshold
        }}
    >
        {/* Inner Blur Layer (The "Glass") */}
        <div 
            className="absolute inset-0 scale-110 rounded-full backdrop-blur-[10px]" // 3. Crop Bleed + Blur Gradient
            style={{
                background: 'rgba(255,255,255,0.5)',
                // Optional: Masking for stencil text
                maskImage: 'url(...)', 
            }}
        />
        
        {/* Content Layer */}
        <div className="absolute inset-0 flex items-center justify-center scale-110">
             <span className="font-black text-black">LABEL</span>
        </div>
    </button>
</div>
```

## When NOT to use this

- If you need **smooth semi-transparency gradients** (e.g., a soft shadow or fading cloud). The contrast filter will destroy them.
- If you need **100% color accuracy** on subtle off-white shades (contrast might shift them).
