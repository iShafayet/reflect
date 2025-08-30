# Reflect

A simple web application that allows users to share markdown content through shareable links. Built with TypeScript and Svelte.

## Features

- **Markdown Input**: Enter markdown text (up to 1200 characters by default, configurable)
- **Live Preview**: See how your markdown will look before sharing
- **Shareable Links**: Generate links that contain the markdown data in the URL hash
- **Client-side Only**: No server-side rendering or database required
- **Base64 Encoding**: Markdown content is embedded directly in the URL using base64 encoding
- **Configurable**: Easy to customize app name, description, and character limits

## How It Works

1. **Input**: Users enter markdown text in the main page
2. **Encoding**: The markdown is encoded to base64 and embedded in a URL hash
3. **Sharing**: A shareable link is generated that contains the encoded content
4. **Viewing**: Anyone with the link can view the rendered markdown on the `/view` page

## Technology Stack

- **Frontend**: Svelte 5 with TypeScript
- **Build Tool**: Vite
- **Markdown Parser**: Marked
- **Styling**: CSS with modern design principles

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm



### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd reflect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `build` directory.

## Usage

### Creating Content

1. Visit the main page (`/`)
2. Enter your markdown text (maximum 1200 characters by default, configurable)
3. Click "Generate Link" to create a shareable URL
4. Copy the generated link to share with others

### Viewing Shared Content

1. Click on a shared link or navigate to `/view#<encoded-content>`
2. The markdown will be automatically rendered
3. Use the "View Raw Markdown" section to see the original text
4. Navigate back or create new content using the action buttons

## URL Structure

- **Main Page**: `/` - Input form for creating markdown content
- **View Page**: `/view#<base64-encoded-markdown>` - Displays rendered markdown



## Character Limit

The application enforces a 1200-character limit on markdown input by default to ensure URLs remain manageable and shareable. You can customize this and other settings by copying `env.example` to `.env` and modifying the values.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

