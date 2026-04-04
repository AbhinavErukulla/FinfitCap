package utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public final class DriverManager {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();
    private static final int TIMEOUT_SECONDS = 60;

    private DriverManager() {}

    public static WebDriver getDriver() {
        if (DRIVER.get() == null) {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            if ("true".equalsIgnoreCase(System.getenv("HEADLESS"))) {
                options.addArguments("--headless=new", "--window-size=1280,900");
            }
            options.addArguments("--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");
            options.setPageLoadStrategy(org.openqa.selenium.PageLoadStrategy.NORMAL);
            
            ChromeDriver driver = new ChromeDriver(options);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(TIMEOUT_SECONDS));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(TIMEOUT_SECONDS));
            driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(TIMEOUT_SECONDS));
            driver.manage().window().maximize();
            
            DRIVER.set(driver);
        }
        return DRIVER.get();
    }

    public static void quitDriver() {
        WebDriver driver = DRIVER.get();
        if (driver != null) {
            try {
                driver.quit();
            } finally {
                DRIVER.remove();
            }
        }
    }
}
