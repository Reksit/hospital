package com.carefleet.controller;

import com.carefleet.dto.AmbulanceDto;
import com.carefleet.dto.LocationUpdateDto;
import com.carefleet.service.AmbulanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ambulances")
@Tag(name = "Ambulance Management", description = "Ambulance tracking and management APIs")
public class AmbulanceController {

    @Autowired
    private AmbulanceService ambulanceService;

    @GetMapping
    @Operation(summary = "Get all ambulances")
    @PreAuthorize("hasRole('HOSPITAL_ADMIN') or hasRole('AMBULANCE_DRIVER')")
    public ResponseEntity<List<AmbulanceDto>> getAmbulances() {
        List<AmbulanceDto> ambulances = ambulanceService.getAllAmbulances();
        return ResponseEntity.ok(ambulances);
    }

    @PostMapping("/{ambulanceId}/location")
    @Operation(summary = "Update ambulance location")
    @PreAuthorize("hasRole('AMBULANCE_DRIVER')")
    public ResponseEntity<?> updateLocation(@PathVariable String ambulanceId, 
                                          @Valid @RequestBody LocationUpdateDto locationUpdate) {
        ambulanceService.updateLocation(ambulanceId, locationUpdate);
        return ResponseEntity.ok().build();
    }
}