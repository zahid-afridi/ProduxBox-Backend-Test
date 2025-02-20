import inquirer from "inquirer";

const startServer = async () => {
    const { serverChoice } = await inquirer.prompt([
        {
            type: "list",
            name: "serverChoice",
            message: "Select Server to Start:",
            choices: [
                "1. Callback-based Server (callback-server.js)",
                "2. Async/Await Server (async-server.js)",
                "3. Promise-based Server (promises-server.js)",
                "4. Stream-based Server (streams-server.js)"
            ]
        }
    ]);

    console.log(`Starting ${serverChoice.split(". ")[1]}...`);

    if (serverChoice.startsWith("1")) {
        import("./Callback-server.js").then(() => console.log("Callback Server Started!"));
      } else if (serverChoice.startsWith("2")) {
        import("./Async-server.js").then(() => console.log("Async/Await Server Started!"));
      }else if (serverChoice.startsWith("3")) {
        import("./Promises-server.js").then(() => console.log("Promise-based Server Started!"));

      }else if (serverChoice.startsWith("4")) {
        import("./Streams-server.js").then(() => console.log("Stream-based Server Started!"));

      }
};

startServer();
