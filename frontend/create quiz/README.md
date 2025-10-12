# Create New Quiz - Step 1

A responsive, accessible quiz creation form built with semantic HTML5 and CSS3.

## 📂 Files Structure

```
create quiz/
├── index.html       # Main HTML markup
├── styles.css       # Complete stylesheet with CSS variables
├── assets/          # (Optional) For icons/images
└── README.md        # This file
```

## 🚀 How to Open

### Method 1: Direct File Opening
1. Navigate to `frontend/create quiz/`
2. Double-click `index.html` to open in your default browser

### Method 2: Local Server (Recommended)

**Using Python:**
```bash
# Navigate to the create quiz folder
cd "frontend/create quiz"
python -m http.server 8000
# Open http://localhost:8000

# Or from frontend root
cd frontend
python -m http.server 8000
# Open http://localhost:8000/create%20quiz/
```

**Using Node.js:**
```bash
cd "frontend/create quiz"
npx http-server -p 8000
# Open http://localhost:8000
```

### Method 3: VS Code Live Server
1. Right-click on `index.html` in VS Code
2. Select "Open with Live Server"

## ✨ Features

### Accessibility (WCAG AA Compliant)
- ✅ Semantic HTML5 structure (`<nav>`, `<main>`, `<section>`)
- ✅ All form inputs have visible `<label>` elements
- ✅ ARIA labels and descriptions for screen readers
- ✅ Keyboard navigation support (tab order)
- ✅ Focus states on all interactive elements
- ✅ Minimum 44px touch targets for mobile
- ✅ Color contrast meets WCAG AA standards
- ✅ Support for `prefers-reduced-motion`
- ✅ Support for `prefers-contrast: high`
- ✅ Print-friendly stylesheet

### Responsive Design
- **Desktop** (> 900px): Two-column layout (60% / 40%)
- **Tablet** (600px - 900px): Single column stacked
- **Mobile** (< 600px): Optimized single column with mobile-friendly controls

### Form Controls & Default Values
- **Quiz Title**: "Introduction to Environmental Science"
- **Description**: Pre-filled with environmental science description
- **Category**: "Science" (selected)
- **Difficulty Level**: "Medium" (selected)
- **Time Limit**: 15 minutes
- **Passing Score**: 70%
- **Randomize Questions**: ON (toggle)
- **Immediate Results**: ON (toggle)

### Visual Design
- Clean, modern card-based layout
- Purple primary color theme (`#6b46ff`)
- CSS variables for easy theming
- Smooth transitions and hover effects
- CSS-only animated toggles
- Professional button styles (primary/secondary)

## 🎨 Theming

The stylesheet uses CSS variables defined in `:root`. To change the color theme:

```css
/* In styles.css, modify these variables: */
:root {
    --primary: #6b46ff;        /* Main brand color */
    --accent: #ff6b9d;         /* Alternative accent color */
}

/* Or swap to use accent as primary (uncomment in styles.css): */
:root {
    --primary: var(--accent);
}
```

## 🔧 Future JavaScript Integration

The HTML includes `data-*` attributes as hooks for future interactivity:

### Key Data Attributes
- `data-action="save-draft"` - Save Draft button
- `data-action="preview-quiz"` - Preview button
- `data-action="navigate-back"` - Back arrow
- `data-action="navigate-prev"` - Previous step button
- `data-action="navigate-next"` - Next step button
- `data-field="quiz-title"` - Quiz title input
- `data-field="quiz-description"` - Description textarea
- `data-field="quiz-category"` - Category select
- `data-field="difficulty-level"` - Difficulty select
- `data-field="time-limit"` - Time limit input
- `data-field="passing-score"` - Passing score input
- `data-field="randomize-questions"` - Randomize checkbox
- `data-field="immediate-results"` - Immediate results checkbox
- `data-form="quiz-creation"` - Main form element

### Example JS Implementation
```javascript
// Attach event listeners using data-action attributes
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        switch(action) {
            case 'save-draft':
                saveDraft();
                break;
            case 'preview-quiz':
                previewQuiz();
                break;
            case 'navigate-next':
                goToStep(2);
                break;
            // ... handle other actions
        }
    });
});

// Collect form data using data-field attributes
function collectFormData() {
    const formData = {};
    document.querySelectorAll('[data-field]').forEach(field => {
        const fieldName = field.dataset.field;
        formData[fieldName] = field.type === 'checkbox' 
            ? field.checked 
            : field.value;
    });
    return formData;
}
```

## ⏱️ Development Time Estimate

**~2-4 hours** for complete implementation including:
- Semantic HTML structure (45 min)
- CSS styling with variables (90 min)
- Responsive design testing (30 min)
- Accessibility audit & fixes (45 min)
- Documentation (30 min)

## 📋 Checklist

- ✅ Semantic HTML5 markup
- ✅ CSS3 with custom properties (variables)
- ✅ Fully responsive (desktop, tablet, mobile)
- ✅ WCAG AA accessibility compliance
- ✅ All default values set correctly
- ✅ Toggle switches styled and functional (CSS-only)
- ✅ Focus states for keyboard navigation
- ✅ Data attributes for JS hooks
- ✅ Print stylesheet
- ✅ No external frameworks or libraries
- ✅ No JavaScript required for static layout
- ✅ Organized, commented code

## 🎯 Browser Compatibility

Tested and compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

- The "Prev" button is disabled on Step 1 (as expected)
- All form validation is built-in HTML5 (required fields, min/max values)
- Toggle switches work with keyboard (Space/Enter to toggle)
- Form can be submitted by pressing Enter in text fields
- Color contrast ratios exceed WCAG AA requirements (4.5:1 for text)

## 🚀 Next Steps

To extend this page:
1. Add JavaScript validation before moving to next step
2. Implement form state persistence (localStorage)
3. Add character counters for text inputs
4. Create Steps 2 and 3 for the complete flow
5. Connect to backend API for saving drafts
6. Add real-time validation feedback
7. Implement autosave functionality

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**License**: MIT
