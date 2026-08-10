package com.aethergate.gateway.llm.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class LlmProviderException extends RuntimeException {

    private final String provider;
    private final HttpStatus status;
    private final String errorCode;

    public LlmProviderException(
            String provider,
            HttpStatus status,
            String errorCode,
            String message
    ) {
        super(message);
        this.provider = provider;
        this.status = status;
        this.errorCode = errorCode;
    }
}