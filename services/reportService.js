import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

function escapeHtml(text) {
  if (!text) return "";

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function resolveImageForPdf(uri) {
  try {
    if (!uri) return null;

    let localUri = uri;

    if (
      uri.startsWith("http://") ||
      uri.startsWith("https://")
    ) {
      const dest =
        FileSystem.cacheDirectory +
        `report_${Date.now()}.jpg`;

      const downloaded =
        await FileSystem.downloadAsync(
          uri,
          dest
        );

      localUri = downloaded.uri;
    }

    const base64 =
      await FileSystem.readAsStringAsync(
        localUri,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function mealImageHtml(imageDataUri) {
  if (!imageDataUri) return "";

  return `
    <img
      src="${imageDataUri}"
      style="
        width:100%;
        max-height:250px;
        border-radius:12px;
        object-fit:cover;
        margin-bottom:20px;
      "
    />
  `;
}

function buildHtml(
  title,
  subtitle,
  content
) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>

<style>
body{
font-family:Arial;
padding:24px;
color:#222;
}

h1{
color:#00aa66;
}

.card{
background:#f5f5f5;
padding:20px;
border-radius:16px;
margin-top:20px;
}

.section{
margin-top:15px;
line-height:1.7;
}
</style>

</head>

<body>

<h1>${title}</h1>

<p>${subtitle}</p>

${content}

</body>
</html>
`;
}

export async function exportPdfReport(
  html,
  fileName
) {
  try {
    const { uri } =
      await Print.printToFileAsync({
        html,
      });

    const canShare =
      await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: fileName,
      });
    }

    Alert.alert(
      "Success",
      "PDF report generated successfully."
    );

    return uri;

  } catch (error) {
    console.log(
      "PDF EXPORT ERROR:",
      error
    );

    Alert.alert(
      "Export Failed",
      error?.message ||
        "Could not generate PDF."
    );

    return null;
  }
}

/* ===========================
   MEAL REPORT
=========================== */

export async function downloadMealScanReport(
  meal
) {
  try {
    const imageDataUri =
      await resolveImageForPdf(
        meal?.image
      );

    const html = buildHtml(
      "NutriLens AI Meal Report",
      new Date().toLocaleString(),
      `
      <div class="card">

      ${mealImageHtml(
        imageDataUri
      )}

      <div class="section">
      <strong>Meal Type:</strong>
      ${meal?.mealType || "Meal"}
      </div>

      <div class="section">
      <strong>Analysis:</strong><br/>
      ${escapeHtml(
        meal?.result ||
          "No Analysis"
      )}
      </div>

      </div>
      `
    );

    return await exportPdfReport(
      html,
      "Meal-Report.pdf"
    );
  } catch (error) {
    console.log(error);
  }
}

/* ===========================
   WEEKLY REPORT
=========================== */

export async function downloadWeeklyReport(
  data
) {
  try {
    const html = buildHtml(
      "NutriLens Weekly Report",
      "Last 7 Days Summary",
      `
      <div class="card">

      <div class="section">
      Calories:
      ${
        data?.totals?.calories ||
        0
      }
      </div>

      <div class="section">
      Protein:
      ${
        data?.totals?.protein ||
        0
      } g
      </div>

      <div class="section">
      Carbs:
      ${
        data?.totals?.carbs ||
        0
      } g
      </div>

      <div class="section">
      Fats:
      ${
        data?.totals?.fats ||
        0
      } g
      </div>

      </div>
      `
    );

    return await exportPdfReport(
      html,
      "Weekly-Report.pdf"
    );
  } catch (error) {
    console.log(error);
  }
}

/* ===========================
   FULL REPORT
=========================== */

export async function downloadFullReport(
  data
) {
  try {
    const html = buildHtml(
      "NutriLens Full Report",
      "Complete Nutrition Summary",
      `
      <div class="card">

      <div class="section">
      Total Calories:
      ${
        data?.totals?.calories ||
        0
      }
      </div>

      <div class="section">
      Total Protein:
      ${
        data?.totals?.protein ||
        0
      } g
      </div>

      <div class="section">
      Total Carbs:
      ${
        data?.totals?.carbs ||
        0
      } g
      </div>

      <div class="section">
      Total Fats:
      ${
        data?.totals?.fats ||
        0
      } g
      </div>

      </div>
      `
    );

    return await exportPdfReport(
      html,
      "Full-Report.pdf"
    );
  } catch (error) {
    console.log(error);
  }
}