/**
 * Import Telegraf and standart Session
 * Импорт Телеграфа и стандартной сессии
 */
import { Telegraf, session } from "telegraf";
/**
 * Import description for extendet Context
 * Импорт описания расширеного контекста
 */
import { ExtContext } from "./src/interface";
/**
 * Import custom session
 * Импорт кастомной сесии
 */
import BotSession from "./middleware/session";
/**
 * Import middleware to extend standart Context
 * Импорт мидлы для расширения стандартного контекста
 */
import BotContext from "./middleware/ctx";
/**
 * Import custom console.log function
 * Импорт собственной console.log
 */
import Log from "./src/log";
/**
 * Import Bot token and run mode from config
 * Импорт токена бота и режима запуска из настроек
 */
import { BOT_TOKEN, MODE } from "./config";
/**
 * Import stage with all scenes
 * Импорт стейджа со всеми сценами
 */
import stages from "./scenes/stage";
/**
 * Create your bot and tell it your context type
 * Создаем бот и указываем кастомный контекст для него
 */
const bot = new Telegraf<ExtContext>(BOT_TOKEN[MODE]);
/**
 * Reg standard telegraf session and init default values for session. Important This is required for porper scenes to work
 * Регистрируем стандартную сессию и передаем параметры по умолчанию. Внимание. Это нужно чтоб сцены работали правильно
 */
bot.use(
  session({
    defaultSession: () => ({ userID: 0, chatID: 0, name: "", tgName: "" }),
  })
);
/**
 * Reg custom session to get users from DB
 * Регистрируем собсвенную сессию чтоб извлекать данные пользователей из базы
 */
bot.use(BotSession);
/**
 * Extend standart telegraf Context with custom functions
 * Расширяем стандартный контекст Телеграфа собственными функциями
 */
bot.use(BotContext);
/**
 * Include stage with scenes and global actions
 * Регистрируем сцены с глобальными и внутренними событиями
 */
bot.use(stages.middleware());
/**
 * Start bot in Pooling mode
 * Запуск бота в Пулинг режиме
 */
bot.launch({ dropPendingUpdates: true }).catch((e) => {
  Log.error("MAIN", e);
});
/**
 * Custom console output function for beautiful formatting
 * Собственная функция вывода в консоль для красивого форматирования
 */
Log.info("MAIN", "Started in development mode...");
/**
 * Enable graceful stop
 * Включаем плавную остановку
 */
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
