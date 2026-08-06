package com.aethergate.gateway.provider.service;

import com.aethergate.gateway.provider.dto.CreateProviderRequest;
import com.aethergate.gateway.provider.dto.ProviderResponse;
import com.aethergate.gateway.provider.dto.UpdateProviderRequest;

import java.util.List;

public interface ProviderService {

    ProviderResponse createProvider(CreateProviderRequest request);

    List<ProviderResponse> getAllProviders();

    ProviderResponse getProviderById(Long id);

    ProviderResponse updateProvider(Long id, UpdateProviderRequest request);

    void deleteProvider(Long id);
}
