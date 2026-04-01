package com.qa.tests;

import com.qa.config.ApiConfig;
import io.qameta.allure.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Epic("Dog API")
@Feature("GET /breeds/image/random")
public class RandomImageTest extends ApiConfig {

    @Test
    @Story("Imagem aleatória")
    @DisplayName("Deve retornar status 200 e status 'success'")
    @Severity(SeverityLevel.BLOCKER)
    void shouldReturn200WithSuccessStatus() {
        given()
            .when()
                .get("/breeds/image/random")
            .then()
                .statusCode(200)
                .body("status", equalTo("success"));
    }

    @Test
    @Story("Imagem aleatória")
    @DisplayName("Deve retornar uma URL de imagem válida")
    @Severity(SeverityLevel.CRITICAL)
    void shouldReturnValidImageUrl() {
        given()
            .when()
                .get("/breeds/image/random")
            .then()
                .statusCode(200)
                .body("message", notNullValue())
                .body("message", startsWith("https://images.dog.ceo"))
                .body("message", matchesPattern(".*\\.(jpg|jpeg|png|gif)$"));
    }

    @RepeatedTest(3)
    @Story("Imagem aleatória")
    @DisplayName("Deve retornar imagens diferentes a cada chamada (aleatoriedade)")
    @Severity(SeverityLevel.NORMAL)
    void shouldReturnRandomImages() {
        // Valida que o endpoint responde corretamente em múltiplas chamadas
        given()
            .when()
                .get("/breeds/image/random")
            .then()
                .statusCode(200)
                .body("status", equalTo("success"))
                .body("message", not(emptyString()));
    }

    @Test
    @Story("Imagem aleatória")
    @DisplayName("Deve retornar Content-Type application/json")
    @Severity(SeverityLevel.MINOR)
    void shouldReturnJsonContentType() {
        given()
            .when()
                .get("/breeds/image/random")
            .then()
                .statusCode(200)
                .contentType(containsString("application/json"));
    }

    @Test
    @Story("Imagem aleatória")
    @DisplayName("Resposta deve conter apenas os campos 'message' e 'status'")
    @Severity(SeverityLevel.MINOR)
    void responseShouldContainExpectedFields() {
        given()
            .when()
                .get("/breeds/image/random")
            .then()
                .statusCode(200)
                .body("$", hasKey("message"))
                .body("$", hasKey("status"));
    }
}
