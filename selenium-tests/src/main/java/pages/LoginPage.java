package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import utils.DriverManager;

public class LoginPage {

    private final WebDriver driver;
    private final String baseUrl;

    public static final By EMAIL = By.id("login-email");
    public static final By PASSWORD = By.id("login-password");
    public static final By SUBMIT = By.id("login-submit");
    public static final By REMEMBER = By.id("login-remember-me");

    public LoginPage() {
        this.driver = DriverManager.getDriver();
        this.baseUrl = System.getProperty("findit.baseUrl", "http://localhost:3000");
    }

    public void open() {
        driver.get(baseUrl + "/login.html");
    }

    public void loginAs(String email, String password, boolean remember) {
        driver.findElement(EMAIL).clear();
        driver.findElement(EMAIL).sendKeys(email);
        driver.findElement(PASSWORD).clear();
        driver.findElement(PASSWORD).sendKeys(password);
        if (driver.findElement(REMEMBER).isSelected() != remember) {
            driver.findElement(REMEMBER).click();
        }
        driver.findElement(SUBMIT).click();
    }

    public boolean isDashboard() {
        return driver.getCurrentUrl().contains("dashboard.html");
    }

    public String globalErrorText() {
        return driver.findElement(By.id("login-global-error")).getText();
    }

    public boolean isGlobalErrorVisible() {
        var el = driver.findElement(By.id("login-global-error"));
        return el.isDisplayed() && !el.getText().isBlank();
    }

    public String title() {
        return driver.getTitle();
    }

    public void clearFields() {
        driver.findElement(EMAIL).clear();
        driver.findElement(PASSWORD).clear();
    }
}
