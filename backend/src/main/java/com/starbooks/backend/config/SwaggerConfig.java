package com.starbooks.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@OpenAPIDefinition(
        info = @Info(title = "Starbooks API 명세서", description = "Starbooks 백엔드 API", version = "1.0"),
        servers = {
                @Server(url = "http://localhost:9090", description = "개발 서버"),
                @Server(url = "https://i12d206.p.ssafy.io", description = "운영 서버")
        }
)
@Configuration
public class SwaggerConfig {
    private static final String BEARER_TOKEN_PREFIX = "Bearer";

    @Bean
    public OpenAPI openAPI() {

        return new OpenAPI();
//                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
//                .components(new Components()
//                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
//                                .name(SECURITY_SCHEME_NAME)
//                                .type(SecurityScheme.Type.HTTP)
//                                .scheme("bearer")
//                                .bearerFormat("JWT")
//                        )
//                );
    }
}
