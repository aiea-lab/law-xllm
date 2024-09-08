## Front End

The react app is created using [next.js](https://nextjs.org) because it is the recommended library on the [react getting started](https://react.dev/learn/start-a-new-react-project).

1. **Install dependencies:**
   Make sure you have [pnpm](https://pnpm.io/) installed. If not, install it using:

   ```sh
   cd frontend
   npm install -g pnpm
   ```

   Then, install the project dependencies:

   ```sh
   pnpm install
   pnpm run dev
   ```

Make sure to have .env file on `frontend/.env`

```bash
NEXT_PUBLIC_Google_Client_ID=
NEXT_PUBLIC_Google_Client_Secret=
```

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| next                | 14.2.4  |
| react               | ^18.3.1 |
| react-dom           | ^18.3.1 |
| tailwind-merge      | ^2.3.0  |
| tailwindcss-animate | ^1.0.7  |
| eslint              | ^8.57.0 |
| postcss             | ^8.4.39 |
| tailwindcss         | ^3.4.4  |
| typescript          | ^5.5.3  |
