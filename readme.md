# InfraHub

InfraHub is an all-in-one developer workspace designed to streamline project management, collaboration, authentication, documentation, database management, templates, and analytics into a single unified platform.

---

## 🚀 Features

- **Instant Authentication** – Sign up, sign in, and manage sessions securely without external services.
- **Unified Developer Dashboard** – View all your projects, activity, and analytics in one place.
- **Team Collaboration** – Invite team members with roles and permissions.
- **Browser-Based Documentation** – Upload, organize, and preview Markdown documents directly in your browser.
- **Integrated MongoDB Explorer** – Access, edit, and manage collections without complex setup.
- **GitHub Integration** – Connect repositories and sync workflows seamlessly.
- **Prebuilt Project Templates** – Quickly bootstrap projects with ready-to-use templates.
- **API Analytics & Monitoring** – Track requests with logs and visual insights.

---

## 📦 Installation

InfraHub is deployed online and can also be run locally.

### Clone the repo

```bash
git clone https://github.com/jaadu611/infra-hub.git
cd infra-hub
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Login via CLI/API

```bash
npm run dev

POST https://infra-hub.onrender.com/api/client/login
Headers:
  x-api-key: YOUR_PROJECT_API_KEY
  Content-Type: application/json

Body:
{
  "modelName": "User",
  "email": "user@example.com",
  "password": "yourPassword123!"
}
```

## 🤝 Contributing

Contributions are welcome! Please fork the repo, make your changes, and submit a pull request.

![GitHub repo size](https://img.shields.io/github/repo-size/jaadu611/infra-hub)
![GitHub stars](https://img.shields.io/github/stars/jaadu611/infra-hub?style=social)
![GitHub forks](https://img.shields.io/github/forks/jaadu611/infra-hub?style=social)
