package com.aethergate.gateway.provider.service.impl;

import com.aethergate.gateway.provider.dto.CreateProviderRequest;
import com.aethergate.gateway.provider.dto.ProviderResponse;
import com.aethergate.gateway.provider.dto.UpdateProviderRequest;
import com.aethergate.gateway.provider.entity.Provider;
import com.aethergate.gateway.provider.mapper.ProviderMapper;
import com.aethergate.gateway.provider.repository.ProviderRepository;
import com.aethergate.gateway.provider.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.aethergate.gateway.common.exception.DuplicateProviderException;
import com.aethergate.gateway.common.exception.ProviderNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository repository;
    private final ProviderMapper mapper;

    @Override
    public ProviderResponse createProvider(CreateProviderRequest request) {

        if (repository.existsByProviderCode(request.getProviderCode())) {
            throw new DuplicateProviderException(request.getProviderCode());
        }

        Provider provider = mapper.toEntity(request);

        return mapper.toResponse(repository.save(provider));
    }

    @Override
    public List<ProviderResponse> getAllProviders() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public ProviderResponse getProviderById(Long id) {

        Provider provider = repository.findById(id)
                .orElseThrow(() ->
                        new ProviderNotFoundException(id));

        return mapper.toResponse(provider);
    }

    @Override
    public ProviderResponse updateProvider(Long id,
                                           UpdateProviderRequest request) {

        Provider provider = repository.findById(id)
                .orElseThrow(() -> new ProviderNotFoundException(id));

        provider.setProviderName(request.getProviderName());
        provider.setBaseUrl(request.getBaseUrl());
        provider.setApiKey(request.getApiKey());
        provider.setModelName(request.getModelName());
        provider.setEnabled(request.getEnabled());
        provider.setHealthy(request.getHealthy());
        provider.setPriority(request.getPriority());
        provider.setTimeoutMs(request.getTimeoutMs());

        return mapper.toResponse(repository.save(provider));
    }

    @Override
    public void deleteProvider(Long id) {

        Provider provider = repository.findById(id)
                .orElseThrow(() -> new ProviderNotFoundException(id));

        repository.delete(provider);
    }
}