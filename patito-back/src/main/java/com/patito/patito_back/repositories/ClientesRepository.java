package com.patito.patito_back.repositories;

import com.patito.patito_back.entities.ClientesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientesRepository  extends JpaRepository<ClientesEntity, Long> {

}
