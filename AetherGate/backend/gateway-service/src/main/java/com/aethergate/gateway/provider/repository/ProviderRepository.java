package com.aethergate.gateway.provider.repository;

import com.aethergate.gateway.provider.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Optional<Provider> findByProviderCode(String providerCode);

    boolean existsByProviderCode(String providerCode);

}