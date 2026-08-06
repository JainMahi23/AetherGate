package com.aethergate.gateway.common.exception;

public class ProviderNotFoundException extends RuntimeException {

    public ProviderNotFoundException(Long id) {
        super("Provider not found with id : " + id);
    }

}