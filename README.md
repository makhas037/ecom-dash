ecom-dash/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── test.yml
│
├── analytics/
│   ├── api/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── middleware/
│   │   └── fastapi_app.py
│   ├── notebooks/
│   │   ├── 01_EDA.ipynb
│   │   └── 02_forecast_model.ipynb
│   ├── ml_models/
│   ├── data_processing/
│   ├── trained_models/
│   ├── tests/
│   ├── churn.py
│   ├── clustering.py
│   ├── forecasting.py
│   └── requirements.txt
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── customerController.js
│   │   │   ├── salesController.js
│   │   │   ├── analyticsController.js
│   │   │   └── geminiController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── UserModels.js
│   │   │   ├── queries.js
│   │   │   ├── Sales.model.js
│   │   │   ├── Customer.model.js
│   │   │   └── Product.model.js
│   │   ├── routes/
│   │   │   ├── customers.js
│   │   │   ├── index.js
│   │   │   ├── inventory.js
│   │   │   ├── sales.js
│   │   │   ├── analytics.js
│   │   │   └── gemini.js
│   │   ├── services/
│   │   │   ├── gemini-ai.service.js
│   │   │   ├── analytics.service.js
│   │   │   └── websocket.service.js
│   │   └── utils/
│   │       ├── helpers.js
│   │       └── logger.js
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── test_sales.spec.js
│   ├── .env                          ← UPDATED (GEMINI_API_KEY added)
│   ├── .env.example
│   ├── index.js
│   ├── package.json                  ← UPDATED (added @google/generative-ai)
│   ├── package-lock.json
│   └── server.js                     ← MAIN FILE (Gemini AI integrated)
│
├── database/
│   ├── migrations/
│   │   └── README.md
│   ├── datasets/
│   │   ├── data.csv                  ← YOUR KAGGLE DATA
│   │   └── processed_data.json       ← PROCESSED DATA
│   ├── schema.sql
│   └── seed_data.sql
│
├── docs/
│   ├── DEPLOYMENT.md
│   ├── PITCH_DECK.md
│   └── PROJECT_PLAN.md
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.config.js
│   │   │   ├── endpoints.js
│   │   │   ├── salesApi.js
│   │   │   └── geminiApi.js
│   │   ├── assets/
│   │   │   ├── illustrations/
│   │   │   │   └── empty-state.svg
│   │   │   ├── dashboard-bg.svg
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── BarChart.jsx
│   │   │   │   ├── Heatmap.jsx
│   │   │   │   ├── LineChart.jsx
│   │   │   │   ├── PieChart.jsx
│   │   │   │   ├── DonutChart.jsx
│   │   │   │   ├── AreaChart.jsx
│   │   │   │   └── GaugeChart.jsx
│   │   │   ├── common/
│   │   │   │   ├── Card.css
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── KPIBox.css
│   │   │   │   ├── KPIBox.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Modal.css
│   │   │   │   ├── Notification.jsx
│   │   │   │   ├── Notification.css
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Spinner.css
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── Tooltip.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── RevenueCard.jsx
│   │   │   │   ├── SalesReportArea.jsx
│   │   │   │   ├── SalesActivity.jsx
│   │   │   │   ├── BestSellers.jsx
│   │   │   │   └── OrdersByCountry.jsx
│   │   │   ├── forms/
│   │   │   │   ├── Form.css
│   │   │   │   ├── SignUpForm.jsx
│   │   │   │   ├── FilterForm.jsx
│   │   │   │   ├── LoginForm.css
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SettingsForm.jsx
│   │   │   ├── gemini-chat/
│   │   │   │   ├── ChatInterface.jsx      ← UPDATED (Fick AI)
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   ├── ChatSuggestions.jsx
│   │   │   │   └── ChatHistory.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Layout.css
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── Sidebar.css
│   │   │   │   └── Sidebar.jsx              ← UPDATED (Logo → About)
│   │   │   └── tables/
│   │   │       ├── DataTable.jsx
│   │   │       ├── SalesTable.jsx
│   │   │       └── CustomerTable.jsx
│   │   ├── context/
│   │   │   ├── AppContext.jsx
│   │   │   └── ThemeContext.jsx             ← NEW (Dark mode)
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   ├── useFetch.js
│   │   │   └── useGeminiChat.js
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   ├── index.jsx                ← MAIN DASHBOARD
│   │   │   │   ├── About.jsx                ← NEW
│   │   │   │   ├── HelpCenter.jsx           ← NEW
│   │   │   │   ├── Settings.jsx             ← NEW (Dark mode)
│   │   │   │   ├── Analytics.jsx            ← NEW
│   │   │   │   ├── Explore.jsx              ← NEW
│   │   │   │   ├── Customers.jsx            ← NEW
│   │   │   │   ├── Integration.jsx          ← NEW
│   │   │   │   ├── Messages.jsx             ← NEW
│   │   │   │   ├── Reviews.jsx              ← NEW
│   │   │   │   ├── CustomersMarketing.jsx
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── Executive.jsx
│   │   │   │   ├── ProductInventory.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── SalesDeepDive.jsx
│   │   │   ├── ErrorPage/
│   │   │   │   ├── NotFound.css
│   │   │   │   └── NotFound.jsx
│   │   │   ├── HomePage/
│   │   │   │   ├── HomePage.css
│   │   │   │   └── HomePage.jsx
│   │   │   ├── LoginPage/
│   │   │   │   ├── LoginPage.css
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── Sales/
│   │   │   │   ├── SalesOverview.jsx
│   │   │   │   └── SalesReports.jsx
│   │   │   ├── Customers/
│   │   │   │   ├── CustomersList.jsx
│   │   │   │   └── CustomerSegments.jsx
│   │   │   ├── Products/
│   │   │   │   ├── ProductCatalog.jsx
│   │   │   │   └── InventoryManagement.jsx
│   │   │   ├── Marketing/
│   │   │   │   ├── CampaignPerformance.jsx
│   │   │   │   └── ROIAnalysis.jsx
│   │   │   └── Settings/
│   │   │       ├── Profile.jsx
│   │   │       └── Preferences.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── salesSlice.js
│   │   │   │   └── customerSlice.js
│   │   │   └── index.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── theme.css
│   │   │   └── variables.css
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   ├── constants.js
│   │   │   └── chartConfig.js
│   │   ├── App.css
│   │   ├── App.jsx                          ← UPDATED (All routes + Theme)
│   │   ├── index.css
│   │   ├── index.js
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json                         ← UPDATED (recharts added)
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js                   ← UPDATED (Dark mode)
│   └── vite.config.js
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.analytics
│   ├── kubernetes/
│   │   ├── frontend-deployment.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── analytics-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   ├── redis-deployment.yaml
│   │   └── ingress.yaml
│   ├── terraform/
│   └── scripts/
│
├── monitoring/
│   ├── prometheus.yml
│   └── grafana-dashboard.json
│
├── powerbi/
│   ├── placeholder_dataset.csv
│   └── README.md
│
├── scripts/
│   ├── generate-sample-data.js
│   ├── import-kaggle-data.py                ← USED FOR DATA IMPORT
│   ├── setup-dev-env.sh
│   └── seed-database.js
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CODE_OF_CONDUCT.md


Postgre Sql database credentials
organization : makhas037
project : Sales Dashboards
pass : Makhas037@123*
connected using github