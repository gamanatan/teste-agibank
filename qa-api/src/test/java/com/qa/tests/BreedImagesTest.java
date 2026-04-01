package com.qa.tests;

import com.qa.config.ApiConfig;
import io.qameta.allure.*;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@Epic("Dog API")
@Feature("GET /breed/{breed}/images")
public class BreedImagesTest extends ApiConfig {

    @Test
    @Story("Imagens por raça")
    @DisplayName("Deve retornar imagens para raça 'labrador'")
    @Severity(SeverityLevel.BLOCKER)
    void shouldReturnImagesForLabrador() {
        given()
            .when()
                .get("/breed/labrador/images")
            .then()
                .statusCode(200)
                .body("status", equalTo("success"))
                .body("message", not(empty()));
    }

    @ParameterizedTest(name = "Raça: {0}")
    @ValueSource(strings = {"labrador", "poodle", "beagle", "husky"})
    @Story("Imagens por raça")
    @DisplayName("Deve retornar imagens para múltiplas raças")
    @Severity(SeverityLevel.CRITICAL)
    void shouldReturnImagesForMultipleBreeds(String breed) {
        given()
            .when()
                .get("/breed/{breed}/images", breed)
            .then()
                .statusCode(200)
                .body("status", equalTo("success"))
                .body("message", not(empty()));
    }

    @Test
    @Story("Imagens por raça")
    @DisplayName("URLs das imagens devem apontar para o domínio correto")
    @Severity(SeverityLevel.NORMAL)
    void imageUrlsShouldPointToCorrectDomain() {
        Response response = given()
            .when()
                .get("/breed/labrador/images")
            .then()
                .statusCode(200)
                .extract().response();

        List<String> images = response.jsonPath().getList("message");
        assertThat(images, not(empty()));
        images.forEach(url ->
            assertThat("URL deve começar com https://images.dog.ceo",
                url, startsWith("https://images.dog.ceo"))
        );
    }

    @Test
    @Story("Imagens por raça")
    @DisplayName("Raça inválida deve retornar erro")
    @Severity(SeverityLevel.CRITICAL)
    void invalidBreedShouldReturnError() {
        given()
            .when()
                .get("/breed/racainexistente/images")
            .then()
                .statusCode(404)
                .body("status", equalTo("error"));
    }

    @Test
    @Story("Imagens por raça")
    @DisplayName("Deve retornar imagens de sub-raça 'bulldog/french'")
    @Severity(SeverityLevel.NORMAL)
    void shouldReturnImagesForSubBreed() {
        given()
            .when()
                .get("/breed/bulldog/french/images")
            .then()
                .statusCode(200)
                .body("status", equalTo("success"))
                .body("message", not(empty()));
    }
}
