# How to Use Test Templates with the App

## Test Templates

Three test templates have been created and placed in the `attached_assets` folder:
- TEMPLATE_1.xls
- TEMPLATE_2.xls
- TEMPLATE_3.xls

These templates are copies of the master_bridge_Design.xlsx file.

## Using Test Templates

To use the test templates with the app, you can access them through the following API endpoint:

```
GET /api/projects/:id/export/excel/:templateId
```

Where:
- `:id` is the project ID
- `:templateId` is the template number (1, 2, or 3)

### Example Usage

1. First, create or select a project to get its ID
2. Then use one of these URLs to export using a specific template:
   - `/api/projects/1/export/excel/1` - Uses TEMPLATE_1.xls
   - `/api/projects/1/export/excel/2` - Uses TEMPLATE_2.xls
   - `/api/projects/1/export/excel/3` - Uses TEMPLATE_3.xls

## Implementation Details

The functionality was added by:

1. Modifying `excel-template-export.ts` to accept a template file name parameter
2. Adding a new function `generateWorkbookFromTestTemplate` that maps template IDs to template files
3. Adding a new route in `routes.ts` that accepts the template ID parameter

## Testing the Templates

The templates can be tested by:
1. Starting the application
2. Creating a project or using an existing one
3. Accessing the export endpoint with the desired template ID
4. Verifying that the downloaded Excel file contains the correct data and formulas

All 46 sheets with 2,336 live formulas should be preserved while the INPUTS sheet is updated with the current design parameters.