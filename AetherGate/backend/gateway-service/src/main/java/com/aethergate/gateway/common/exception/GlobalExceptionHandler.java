package com.aethergate.gateway.common.exception;

import com.aethergate.gateway.auth.exception.InvalidCredentialsException;
import com.aethergate.gateway.auth.exception.UserAlreadyExistsException;
import com.aethergate.gateway.llm.exception.LlmProviderException;
import com.aethergate.gateway.common.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException exception) {

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message(exception.getMessage())
                .errorCode("INVALID_CREDENTIALS")
                .build();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(
            UserAlreadyExistsException exception) {

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message("An account with this email already exists.")
                .errorCode("USER_ALREADY_EXISTS")
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(LlmProviderException.class)
    public ResponseEntity<ErrorResponse> handleLlmProviderException(
            LlmProviderException ex) {

        log.warn("LLM provider error [{}]: {}", ex.getProvider(), ex.getMessage());

        // User-friendly message; never expose provider names or internal error codes
        String userMessage;
        if (ex.getStatus() == HttpStatus.TOO_MANY_REQUESTS) {
            userMessage = "The service is currently busy. Please try again in a moment.";
        } else if (ex.getStatus() == HttpStatus.SERVICE_UNAVAILABLE) {
            userMessage = "The service is temporarily unavailable. Please try again later.";
        } else {
            userMessage = "Something went wrong while generating a response. Please try again.";
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .message(userMessage)
                .errorCode("SERVICE_ERROR")
                .build();

        return ResponseEntity
                .status(ex.getStatus())
                .body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Validation Failed");
        response.put("errors", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(ProviderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProviderNotFound(
            ProviderNotFoundException exception) {

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message(exception.getMessage())
                .errorCode("PROVIDER_NOT_FOUND")
                .build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(DuplicateProviderException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateProvider(
            DuplicateProviderException exception) {

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message(exception.getMessage())
                .errorCode("DUPLICATE_PROVIDER")
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception) {

        // Log the actual error for debugging, but never send it to the client
        log.error("Unhandled exception: ", exception);

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message("An unexpected error occurred. Please try again.")
                .errorCode("INTERNAL_SERVER_ERROR")
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}