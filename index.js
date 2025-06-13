const fs = require("fs");
const axios = require("axios");

// 🔧 Replace these
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const GITHUB_TOKEN = process.env.GITHUB_PAT; // Must have "repo" access

// Load your issues
const issues = JSON.parse(fs.readFileSync("issues.json", "utf8"));

async function createIssue(issue) {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        title: issue.title,
        body: issue.body || "",
        labels: issue.labels || []
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json"
        }
      }
    );
    console.log(`✅ Created: ${response.data.title}`);
  } catch (error) {
    console.error(`❌ Error creating issue: ${issue.title}`);
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

(async () => {
  for (const issue of issues) {
    await createIssue(issue);
  }
})();
