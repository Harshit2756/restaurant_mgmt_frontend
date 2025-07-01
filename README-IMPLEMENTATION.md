# Restaurant Management System - Frontend Implementation

## Overview

This is a complete Angular 17 standalone application for restaurant menu management, built according to the specified requirements. The application provides a clean, simple interface for managing restaurant menu items with full CRUD operations.

## Features Implemented ✅

### Pages

1. **Home Page** - Welcome page with restaurant description and CTA buttons
2. **Add Menu Page** - Form to create new menu items with validation
3. **View Menu Page** - Table view with search, filters, and actions
4. **Update Menu Page** - Edit existing menu items with pre-filled data

### Components

- **Header Component** - Navigation bar with consistent branding
- **Footer Component** - Common footer across all pages

### API Integration

- Complete integration with the Restaurant Management API
- All CRUD operations (Create, Read, Update, Delete)
- Status toggle functionality
- Error handling and loading states

### Features

- **Form Validation** - All forms have proper validation with error messages
- **Search & Filtering** - Search by name/description, filter by category, type, and status
- **Responsive Design** - Bootstrap-based responsive layout
- **Loading States** - Proper loading indicators for API calls
- **Error Handling** - User-friendly error messages
- **Confirmation Dialogs** - Delete confirmation before removing items

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Navigation header
│   │   └── footer/          # Common footer
│   ├── pages/
│   │   ├── home/            # Home page
│   │   ├── add-menu/        # Add menu form
│   │   ├── view-menu/       # Menu listing with filters
│   │   └── update-menu/     # Update menu form
│   ├── services/
│   │   └── menu.service.ts  # API service
│   ├── models/
│   │   └── menu.model.ts    # TypeScript interfaces
│   ├── app.routes.ts        # Routing configuration
│   └── app.component.*      # Main app component
└── styles.css               # Global styles with Bootstrap
```

## API Endpoints Used

- `GET /api/menus` - Fetch all menu items
- `POST /api/menus` - Create new menu item
- `GET /api/menus/{id}` - Get menu by ID
- `PUT /api/menus/{id}` - Update menu item
- `DELETE /api/menus/{id}` - Delete menu item
- `PATCH /api/menus/{id}/status` - Update menu status

## Technologies Used

- **Angular 17** - Standalone components architecture
- **Bootstrap 5** - Responsive styling
- **Font Awesome** - Icons
- **TypeScript** - Type safety
- **RxJS** - Reactive programming for API calls

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Install Additional Libraries** (if not already installed)

   ```bash
   npm install bootstrap @fortawesome/fontawesome-free
   ```

3. **Start Development Server**

   ```bash
   npm start
   # or
   ng serve
   ```

4. **Build for Production**
   ```bash
   npm run build
   # or
   ng build
   ```

## Configuration

### API Base URL

The API base URL is configured in `src/app/services/menu.service.ts`:

```typescript
private baseUrl = 'http://localhost:8081/api/menus';
```

### Theme Colors

The application uses a consistent purple theme as specified:

- Primary Color: `#6f42c1`
- Hover Color: `#5a32a3`

## Usage Instructions

### Adding a Menu Item

1. Navigate to "Add Menu" from the header
2. Fill in all required fields (marked with \*)
3. Select menu type (Vegetarian/Non-Vegetarian)
4. Choose category (Breakfast/Lunch/Dinner)
5. Click "Add Menu Item"

### Viewing Menu Items

1. Navigate to "View Menu" from the header
2. Use search bar to find specific items
3. Use filters to narrow down results
4. Click "Clear Filters" to reset all filters

### Updating a Menu Item

1. In the "View Menu" page, click the edit icon
2. Modify the fields as needed
3. Click "Update Menu Item"

### Deleting a Menu Item

1. In the "View Menu" page, click the delete icon
2. Confirm deletion in the popup dialog

### Status Management

- Click on the status badge in the table to toggle between Available/Unavailable

## Validation Rules

- **Menu Name**: Required, 2-100 characters
- **Description**: Optional, max 500 characters
- **Price**: Required, must be greater than 0
- **Menu Type**: Required (VEG/NON_VEG)
- **Category**: Required (BREAKFAST/LUNCH/DINNER)

## Error Handling

- API errors are displayed as user-friendly messages
- Form validation errors appear below each field
- Loading states prevent multiple submissions
- Network errors are handled gracefully

## Image Assets

Add a restaurant hero image to `src/assets/images/restaurant-hero.jpg` for the home page banner.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All forms use Angular Reactive Forms for better validation
- The application follows Angular best practices
- Components are standalone for better tree-shaking
- Bootstrap classes are used for consistent styling
- Font Awesome icons enhance the user experience
- The design is responsive and mobile-friendly

## Backend Requirements

Ensure the Restaurant Management API backend is running on `http://localhost:8081` before using the application.
