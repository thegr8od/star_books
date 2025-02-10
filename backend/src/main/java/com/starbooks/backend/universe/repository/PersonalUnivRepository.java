package com.starbooks.backend.universe.repository;

import com.starbooks.backend.universe.model.PersonalUniv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalUnivRepository extends JpaRepository<PersonalUniv, Long> {
}
