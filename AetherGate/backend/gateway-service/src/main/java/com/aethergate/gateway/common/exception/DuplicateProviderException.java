package com.aethergate.gateway.common.exception;

public class DuplicateProviderException extends RuntimeException {

    public DuplicateProviderException(String providerCode) {
        super("Provider already exists with code : " + providerCode);
    }

}
