/**
 * Настройки Remotion CLI (studio, render). Документация: https://remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
// H.264, высокое качество для финального ролика (CRF 16 ≈ визуально без потерь).
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");

// Если Chrome Headless Shell не может быть скачан автоматически (закрытая сеть),
// укажите путь к локальному браузеру: REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
