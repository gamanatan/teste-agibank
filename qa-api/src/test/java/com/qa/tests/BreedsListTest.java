package com.qa.tests;

import com.qa.config.ApiConfig;
import io.qameta.allure.*;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Epic("Dog API")
@Feature("GET /breeds/list/all")
public class BreedsListTest extends ApiConfig {

    @Test
    @Story("Listar todas as raças")
    @DisplayName("Deve retornar status 200 e status 'success'")
    @Severity(SeverityLevel.BLOCKER)
    void shouldReturn200WithSuccessStatus() {
        given()
            .when()
                .get("/breeds/list/all")
            .then()
                .statusCode(200)
                .body("status", equalTo("success"));
    }

    @Test
    @Story("Listar todas as raças")
    @DisplayName("Deve retornar mapa de raças não vazio")
    @Severity(SeverityLevel.CRITICAL)
    void shouldReturnNonEmptyBreedsMap() {
        given()
            .when()
                .get("/breeds/list/all")
            .then()
                .statusCode(200)
                .body("message", notNullValue())
                .body("message.size()", greaterThan(0));
    }

    @Test
    @Story("Listar todas as raças")
    @DisplayName("Deve conter raças conhecidas na resposta")
    @Severity(SeverityLevel.NORMAL)
    void shouldContainKnownBreeds() {
        given()
            .when()
                .get("/breeds/list/all")
            .then()
                .statusCode(200)
                .body("message", hasKey("labrador"))
                .body("message", hasKey("poodle"))
                .body("message", hasKey("bulldog"));
    }

    @Test
    @Story("Listar todas as raças")
    @DisplayName("Deve retornar Content-Type application/json")
    @Severity(SeverityLevel.MINOR)
    void shouldReturnJsonContentType() {
        given()
            .when()
                .get("/breeds/list/all")
            .then()
                .statusCode(200)
                .contentType(containsString("application/json"));
    }

    @Test
    @Story("Listar todas as raças")
    @DisplayName("Sub-raças de 'bulldog' devem ser retornadas como lista")
    @Severity(SeverityLevel.NORMAL)
    void shouldReturnSubBreedsAsList() {
        Response response = given()
            .when()
                .get("/breeds/list/all")
            .then()
                .statusCode(200)
                .extract().response();

        response.then().body("message.bulldog", instanceOf(java.util.List.class));
    }
}
