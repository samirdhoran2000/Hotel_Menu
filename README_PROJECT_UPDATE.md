# Digital Menu Card. Updated Full Stack Version

## What was fixed
- Proper top navigation on public hotel page: Menu, About, Contact, Setting
- Fully connected settings panel with hotel info, categories, QR/public link, and password change
- Public page sections for Menu, About, and Contact
- Regular categories from database plus working All, Popular, Trending tabs
- Admin login, signup, and dashboard pages
- Backend APIs for settings, categories, items, public hotel page, and password change
- QR/public URL uses `PUBLIC_BASE_URL`, not localhost
- MongoDB database changed to `digital-menu-card`
- Images are saved in `server/uploads` and MongoDB stores image path only

## Changed files
### Server
- `server/src/index.js`
- `server/src/models/Admin.js`
- `server/src/models/Category.js`
- `server/src/models/Item.js`
- `server/src/middleware/auth.js`
- `server/src/controllers/authController.js`
- `server/src/controllers/categoryController.js`
- `server/src/controllers/itemController.js`
- `server/src/controllers/settingsController.js`
- `server/src/controllers/publicController.js`
- `server/src/routes/auth.js`
- `server/src/routes/category.js`
- `server/src/routes/item.js`
- `server/src/routes/settings.js`
- `server/src/routes/public.js`
- `server/.env`

### Client
- `client/src/App.jsx`
- `client/src/App.css`
- `client/src/index.css`
- `client/src/main.jsx`
- `client/src/components/Header.jsx`
- `client/src/components/Sidebar.jsx`
- `client/src/components/MenuSection.jsx`
- `client/src/components/SettingsPanel.jsx`
- `client/src/components/Footer.jsx`
- `client/src/components/ListViewItem.jsx`
- `client/src/utils/dataManager.js`
- `client/src/utils/config.js`
- `client/src/utils/api.js`
- `client/src/utils/file.js`
- `client/src/pages/PublicPage.jsx`
- `client/src/pages/AdminAuthPage.jsx`
- `client/src/pages/AdminDashboardPage.jsx`
- `client/.env.example`

## Backend run steps
1. Start local MongoDB
2. Open terminal in `server`
3. Install packages
   ```bash
   npm install
   ```
4. Make sure `server/.env` is correct
5. Run backend
   ```bash
   npm run dev
   ```

## Frontend run steps
1. Open terminal in `client`
2. Install packages
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`
4. Run frontend
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

## Exact backend .env for LAN testing and QR testing
Put this in `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/digital-menu-card
JWT_SECRET=change_this_to_a_secure_secret
CLIENT_ORIGIN=http://localhost:5173,http://192.168.0.109:5173
PUBLIC_BASE_URL=http://192.168.0.109:5173
```

## Exact frontend .env for LAN testing
Create `client/.env`
```env
VITE_API_BASE_URL=http://192.168.0.109:5000
```

## How QR/public link works now
- Admin logs in
- Admin dashboard or settings shows public URL
- Public URL format:
  ```
  http://192.168.0.109:5173/?hotel=<publicSlug>
  ```
- Regenerate QR link changes `publicSlug`
- This opens the correct hotel public page on mobile when mobile is on same LAN

## Important notes
- Use the PC LAN IP in both `PUBLIC_BASE_URL` and `VITE_API_BASE_URL`
- Keep frontend and backend running on the same computer for LAN testing
- On Windows firewall, allow Node.js access on private network if mobile cannot open the page
- If categories cannot be deleted, first remove menu items using that category
