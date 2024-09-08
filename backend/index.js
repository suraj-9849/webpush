const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const admin = require("firebase-admin");
const serviceAccount = require("./fireBaseAdmin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

const supabaseUrl = "https://yymvzwupfugsjctnzksh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bXZ6d3VwZnVnc2pjdG56a3NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTA0MTE2MCwiZXhwIjoyMDQwNjE3MTYwfQ.q9FfJ-MxXsQEbSd5w_5KessCuTfKgWQCvd6sw_sKc0U";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/store-token", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const { data, error } = await supabase.from("fcm_tokens").insert([{ token }]);

  if (error) {
    console.error("Error storing token in Supabase:", error);
    return res.status(500).json({ message: "Error storing token" });
  }

  res.json({ message: "Token stored successfully" });
});

app.post("/send-notifications", async (req, res) => {
  console.log("Sending notifications...");
  const { data: tokens, error } = await supabase
    .from("fcm_tokens")
    .select("token");

  if (error) {
    console.error("Error fetching tokens:", error);
    return res.status(500).json({ message: "Error fetching tokens" });
  }

  if (tokens.length === 0) {
    console.warn("No tokens found for notifications");
    return res.status(404).json({ message: "No tokens found" });
  }

  const registrationTokens = tokens.map((row) => row.token);
  const message = {
    notification: {
      title: "New Message!",
      body: "You have a new notification.",
    },
    tokens: registrationTokens,
  };

  messaging
    .sendMulticast(message)
    .then(async (response) => {
      console.log("Successfully sent messages:", response);

      // Filter out invalid tokens
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const { error } = resp;
          console.error(
            `Error sending to token ${registrationTokens[idx]}:`,
            error.message
          );
          if (
            error.code === "messaging/invalid-registration-token" ||
            error.code === "messaging/registration-token-not-registered"
          ) {
            invalidTokens.push(registrationTokens[idx]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        await supabase
          .from("fcm_tokens")
          .delete()
          .in("token", invalidTokens)
          .then(() => {
            console.log("Invalid tokens removed successfully");
          })
          .catch((error) => {
            console.error("Error removing invalid tokens:", error);
          });
      }
      

      res.json({
        message: `Successfully sent ${response.successCount} messages, ${response.failureCount} failed`,
      });
    })
    .catch((error) => {
      console.error("Error sending notifications:", error);
      res.status(500).json({ message: "Error sending notifications" });
    });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
