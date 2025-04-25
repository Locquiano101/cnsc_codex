# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

READ ME FIRST -

in order to make this run, follow this steps:

--- first you open terminal
--- type "npm run dev"
--- click the link that shows.

if you wish to see what is in it (di pa connected kung saan through buttons, focusing sa design and a few backends)

(link)

- "/bulletin-board" => eto yung scrollable yung design para sa newsfeed

- "/sandbox" => dito ko tinetesting muna kung maayos na ba bago ko ilagay sa respective folder and components
- "/sign-up" => self explenatory
- "/login" => self explenatory

         <Route path="/bulletin-board" element={<NewsFeed />} />
         <Route path="/admin" element={<AdminTemplate />} />
         <Route path="/sandbox" element={<DatabaseSandbox />} />

         <Route path="/sign-up" element={<DatabaseSandbox />} />
         <Route path="/login" element={<LoginComponent />} />

         <Route
           path={`/organizations/${_id}`}
           element={<OrganizationMainProfile />}
         />

         {/* 404 Route */}
         <Route path="*" element={<NotFound />} />
