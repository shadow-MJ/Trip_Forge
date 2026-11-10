# TripForge Frontend

TripForge is a collaborative trip planning web application for groups of friends and university students. Every member collaborates in one shared tropical-themed workspace with roles strictly limited to **Trip Creator** and **Trip Member**, and sample costs denominated in **BDT (৳)** within the 3,000–10,000 BDT range.

## Tech Stack

- **React 19 + Vite** (JavaScript)
- **React Router** (`react-router-dom`) for public, protected, and nested trip workspace routes
- **Axios** (`src/api/client.js`) prepared for REST API integration
- **Plain CSS with CSS Variables** (`src/styles/tokens.css`, `src/styles/global.css`) supporting tropical light and dark lagoon modes

## Running the Project

1. Open a terminal inside `Project_Code`:
   ```bash
   cd Project_Code
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal (typically `http://localhost:5173`).

### Available Scripts

- `npm run dev` — Start the development server with hot reload
- `npm run build` — Build the production bundle into `dist/`
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run Oxlint checks across the codebase

## Demo Credentials & Mock Data

All API calls in `src/api/` currently return in-memory mock data with `TODO` comments marking where real REST endpoints will connect.

- **Demo accounts:**
  - `bijoyhasan1612@gmail.com` / `@1111111` (Joy M · Creator of Bandarban Ridge Trail, member of Cox's Bazar and Sylhet)
  - `ranatonmoy33@gmail.com` / `tonmoy1234` (Mahmud Rana Tonmoy)
  - Or click **Fill credentials** on the Login page, or register a new account.
- **Joinable demo trip invite code:** On the Dashboard, click **Join with code** and enter `6767` to join *Sundarbans River Study Tour*.
- **Showcase trips included:**
  - *Cox's Bazar Coastline Escape* — Populated workspace (`Trip Creator` role, weather forecast active).
  - *Sylhet Tea & Waterfall Weekend* — Collaborative trip (`Trip Member` role).
  - *Bandarban Ridge Trail* — Newly created empty workspace demonstrating empty states and the `WeatherCard` fallback state.

## Project Structure

```text
src/
  api/          # Axios client, mock datastore, and one module per feature (with TODOs)
  components/   # Navbar, Sidebar, Card, Modal, EmptyState, Loader, ErrorState, MapView, WeatherCard, NotificationsPanel, TropicalVisuals, Icons
  context/      # AuthContext (auth state only)
  pages/        # Landing, Login, Register, Dashboard, CreateTrip, Notifications, Profile, Settings
  pages/trip/   # TripWorkspaceLayout + Overview, Itinerary, Ideas, Polls, Expenses, Discussion, Packing, Members, Summary
  routes/       # ProtectedRoute
  styles/       # tokens.css (CSS variables for light tropical / dark lagoon modes) and global.css
  utils/        # Date helpers, formatters, expense split calculator, theme helpers
```
