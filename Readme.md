# 🌟 Node.js Full Stack Engineering Test

This project demonstrates four key concepts in Node.js:

✅ Callbacks  
✅ Async/Await  
✅ Promises  
✅ Streams  

The application fetches website titles based on provided domain names and displays them dynamically.

## 🚀 Getting Started

Follow these steps to set up and run the project:

### 1. Create a `.env` file and add the following:

```sh
PORT=8000
```

### 2. Clone the Repository

```sh
git clone <repository-url>
```

### 3. Install Dependencies

```sh
npm install
```

### 4. Run the Project

```sh
npm run dev
```

After running the command, the project will prompt you to select a server type.

You can test it using the following URL:

```
http://localhost:8000/I/want/title?address=https://example.com
```

## 📁 Project Structure

The project consists of four different server implementations:

- `callback-server.js` → Uses callbacks
- `async-server.js` → Uses async/await
- `promises-server.js` → Uses Promises
- `streams-server.js` → Uses Streams

## 🛠 Technologies Used

- **Express.js** → For handling the server
- **Inquirer.js** → For terminal-based user input
- **Cheerio.js** → For parsing and extracting HTML
- **Dotenv** → For managing environment variables
