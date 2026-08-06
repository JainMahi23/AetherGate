package com.aethergate.gateway.config.swagger;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI aetherGateOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("AetherGate API")
                        .description("Enterprise Intelligent Multi-LLM Gateway Platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Mahi Jain")
                                .email("your-email@example.com"))
                        .license(new License()
                                .name("MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation"));
    }
}