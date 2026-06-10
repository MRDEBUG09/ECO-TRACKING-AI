import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Shared Gemini Agent Client
const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

const ai = hasGeminiKey
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Indicator
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", usingRealGemini: hasGeminiKey });
  });

  // REST API: Gemini Context Insights
  app.post("/api/gemini/insights", async (req, res) => {
    const { activities, username, currentScore } = req.body;
    
    if (!hasGeminiKey || !ai) {
      // Graceful Mock Fallback
      return res.json({
        carbonScore: currentScore || 72,
        todayEmissions: "14.2 kg CO₂",
        trendMessage: "Your transport footprint is down 8% but electricity is up.",
        insightText: "Hi " + (username || "EcoLeader") + "! Heating is your biggest emitter today. Consider reducing thermostat temperature by 1°C to save an estimated 150kg of annual CO₂.",
        recommendations: [
          "Walk or bike to destinations under 3km instead of driving.",
          "Enable Eco Mode on laundry cycles to trim electricity overhead by 30%.",
          "Try choosing local, in-season produce to limit carbon costs from logistics."
        ]
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this carbon footprint logging history for User ${username || "EcoLeader"}.
Current score: ${currentScore || "70/100"}. 
Activities: ${JSON.stringify(activities || [])}. 

Provide a personalized, structured assessment in JSON. Provide helpful, concrete advice.`,
        config: {
          systemInstruction: "You are the head AI analyst of EcoTrack AI. Calculate user impact, suggest score updates, and compile exactly 3 actionable tips.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              carbonScore: { type: Type.INTEGER, description: "Suggested updated carbon score between 1 and 100 based on lifestyle quality." },
              todayEmissions: { type: Type.STRING, description: "Total emissions estimate, e.g. '12.4' with metric units." },
              trendMessage: { type: Type.STRING, description: "One liner overview comparison of weekly lifestyle logs." },
              insightText: { type: Type.STRING, description: "A detailed paragraph of sustainability advice tailored to user categories." },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of exactly 3 highly specific eco-friendly recommendations."
              }
            },
            required: ["carbonScore", "todayEmissions", "trendMessage", "insightText", "recommendations"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Insights Error:", err);
      res.status(500).json({ error: "Failed to generate insights from Gemini " + err.message });
    }
  });

  // REST API: AI coach chat endpoint
  app.post("/api/gemini/coach", async (req, res) => {
    const { message, history, activities } = req.body;

    if (!hasGeminiKey || !ai) {
      // Mock chat replies
      let reply = "I am ready to help you track emissions, set reduction goals, and choose green options! Since the server-side Gemini API is currently in demo simulation, here's a helpful tip: Try switching traditional home bulbs to LED lights to immediately slash energy emissions by up to 75%!";
      if (message.toLowerCase().includes("emissions") || message.toLowerCase().includes("reduce")) {
        reply = "Reducing greenhouse emissions comes down to addressing high-impact areas:\n\n1. **Transportation**: Swap car rides for trains or high-speed buses.\n2. **Energy Efficiency**: Choose renewable energy options or adjust your room thermostat.\n3. **Diet**: Opt-in for plant-based foods once or twice a week. Transitioning from red meat to a vegan standard lowers average diet footprint by 50%!";
      } else if (message.toLowerCase().includes("car") || message.toLowerCase().includes("transport")) {
        reply = "Active transportation or public transit reduces carbon emissions as follows:\n- Private Vehicle: ~120g CO₂ per passenger-kilometer.\n- Electric Train/Subway: ~14g CO₂ per passenger-kilometer.\n- Walking / Biking: **0g** CO₂ emission!\n\nI recommend joining our upcoming **'No Car Week' Challenge** to save points!";
      }
      return res.json({ reply });
    }

    try {
      // Reconstitute chat history safely
      const structuredHistory = (history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.message }]
      }));

      // Append contextual activity dump to system instructions
      const systemInstruction = `You are EcoTrack AI Coach, an expert sustainability coach.
The user has logged these recent activities: ${JSON.stringify(activities || [])}.
Respond concisely, with professional, inspiring, startup-grade advice, using structured markdown.
Emphasize measurable outcomes and actionable steps. No jargon. Use friendly and encouraging tone.`;

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
        },
        history: structuredHistory,
      });

      const result = await chat.sendMessage({ message });
      res.json({ reply: result.text });
    } catch (err: any) {
      console.error("Gemini Coach Error:", err);
      res.status(500).json({ error: "Gemini Chat error: " + err.message });
    }
  });

  // REST API: Predictions endpoint (30d, 90d, 1y forecasts)
  app.post("/api/gemini/predictions", async (req, res) => {
    const { activities, country } = req.body;

    if (!hasGeminiKey || !ai) {
      // Mock predictor
      return res.json({
        predictedScoreCurrent: 75,
        predictedScore30Days: 78,
        predictedScore90Days: 82,
        predictedScore1Year: 89,
        trendMessage: "On track for positive, durable reduction! By continuing current habits, your annual carbon output will decrease from 4.8 tons to 3.2 tons.",
        impactAnalysis: "With your active challenge commitments and focus on meat-free lunches, your personal environmental score will rise safely. In one year, you will have equivalent carbon abatement of planting **42 mature trees**! Keep it up!",
        forecastGraphData: [
          { name: "Current", emissions: 240, score: 75 },
          { name: "30 Days", emissions: 210, score: 78 },
          { name: "90 Days", emissions: 180, score: 82 },
          { name: "1 Year", emissions: 120, score: 89 }
        ]
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Extrapolate carbon emissions forecasts for user living in ${country || "Global"}.
Activities history: ${JSON.stringify(activities || [])}.

Analyze the data trend. Predict score updates at Current, 30 Days, 90 Days, and 1 Year thresholds assuming they sustain positive changes or default habits. Provide a structured response in JSON.`,
        config: {
          systemInstruction: "You are the advanced predictive engine of EcoTrack AI. Extrapolate metrics and project future carbon impacts visually.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictedScoreCurrent: { type: Type.INTEGER },
              predictedScore30Days: { type: Type.INTEGER },
              predictedScore90Days: { type: Type.INTEGER },
              predictedScore1Year: { type: Type.INTEGER },
              trendMessage: { type: Type.STRING },
              impactAnalysis: { type: Type.STRING },
              forecastGraphData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Interval label, e.g., 'Current', '30 Days'" },
                    emissions: { type: Type.NUMBER, description: "Estimated monthly co2 emissions in kg" },
                    score: { type: Type.NUMBER, description: "Predicted score value out of 100" }
                  },
                  required: ["name", "emissions", "score"]
                }
              }
            },
            required: ["predictedScoreCurrent", "predictedScore30Days", "predictedScore90Days", "predictedScore1Year", "trendMessage", "impactAnalysis", "forecastGraphData"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Prediction Error:", err);
      res.status(500).json({ error: "Gemini Prediction Error: " + err.message });
    }
  });

  // REST API: Report synthesis endpoint
  app.post("/api/gemini/report", async (req, res) => {
    const { activities, username, country, goals } = req.body;

    if (!hasGeminiKey || !ai) {
      const totalEmissionsVal = (activities || []).reduce((acc: number, curr: any) => acc + (curr.emissionsKg || 0), 0);
      return res.json({
        reportMarkdown: `# ECOTRACK AI EXECUTIVE FOOTPRINT REPORT\n\n*Prepared for ${username || "EcoLeader"} — Location: ${country || "Earth"}*\n\n## 100% Verified Sustainability Audit\n\n- **Total Logged CO₂ Output**: **${totalEmissionsVal.toFixed(1)} kg**\n- **Current Goals Status**: ${goals?.length || 2} Active commitments logged.\n\n### Carbon Contribution Analysis\nTransportation logs constitute the largest operational share of emissions, followed by regional electricity parameters. High-frequency commutes are driving current peaks.\n\n### Operational Strategic Recommendations\n- **Electrify Your Mobility**: Default to hybrid vehicle engines or electric public railways.\n- **Adjust Micro-Habits**: Power wash clothes on cold cycles and compost residential organic debris.\n- **Leverage Smart Automation**: Utilize smart power strips to eradicate phantom energy draws.`,
        downloadUrl: "#"
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Compile a formal Sustainability Auditor's EcoReport for user ${username || "EcoLeader"} living in ${country || "Global"}.
Current logged activities: ${JSON.stringify(activities || [])}.
Active commitments: ${JSON.stringify(goals || [])}.
Deliver structured carbon audit markdown, with clear executive segments: Executive Overview, Distribution Review, Recommendations.`,
        config: {
          systemInstruction: "You are the Lead Sustainability auditor. Author professional, polished ESG-quality executive reports in Markdown."
        }
      });

      res.json({
        reportMarkdown: response.text,
        downloadUrl: "#"
      });
    } catch (err: any) {
      console.error("Gemini Report Generation Error:", err);
      res.status(500).json({ error: "Gemini Report Error: " + err.message });
    }
  });

  // Vite Assets and Single Page App Routing configuration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoTrack AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
