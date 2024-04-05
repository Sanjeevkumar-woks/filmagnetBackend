import app from "./app";
import * as mongodb from "./connectors/mongodb";

async function bootstrap() {
  const SERVICE_PORT = process.env.SERVICE_PORT;

  try {
    await mongodb.connect();
    app.listen(SERVICE_PORT, () => {
      console.log(`HTTP server running on port: ${SERVICE_PORT}`);
    });
  } catch (err) {
    console.log("Error in starting server", err);
    process.exit(1);
  }
}

process.on("uncaughtException", function (err: Error) {
  console.error("uncaughtException", err);
});

process.on("unhandledRejection", function (err: Error) {
  console.error("unhandledRejection", err);
});

bootstrap();
