package com.aethergate.gateway.provider.controller;
import jakarta.validation.Valid;
import com.aethergate.gateway.common.response.ApiResponse;
import com.aethergate.gateway.provider.dto.CreateProviderRequest;
import com.aethergate.gateway.provider.dto.ProviderResponse;
import com.aethergate.gateway.provider.dto.UpdateProviderRequest;
import com.aethergate.gateway.provider.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService service;

    @PostMapping
    public ApiResponse<ProviderResponse> createProvider(
            @Valid @RequestBody CreateProviderRequest request){

        return ApiResponse.success(service.createProvider(request));
    }

    @GetMapping
    public ApiResponse<List<ProviderResponse>> getAllProviders() {

        return ApiResponse.success(service.getAllProviders());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProviderResponse> getProvider(
            @PathVariable Long id) {

        return ApiResponse.success(service.getProviderById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProviderResponse> updateProvider(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProviderRequest request) {

        return ApiResponse.success(service.updateProvider(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProvider(
            @PathVariable Long id) {

        service.deleteProvider(id);

        return ApiResponse.success("Provider deleted successfully.");
    }
}
