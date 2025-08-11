package com.carefleet.service;

import com.carefleet.dto.AmbulanceDto;
import com.carefleet.dto.LocationUpdateDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class AmbulanceService {

    public List<AmbulanceDto> getAllAmbulances() {
        // Mock data - replace with actual database queries
        AmbulanceDto.LocationDto location = new AmbulanceDto.LocationDto();
        location.setLatitude(40.7128);
        location.setLongitude(-74.0060);
        location.setTimestamp(LocalDateTime.now().toString());

        AmbulanceDto ambulance = new AmbulanceDto();
        ambulance.setId("1");
        ambulance.setLicensePlate("AMB-001");
        ambulance.setDriverId("2");
        ambulance.setStatus("IN_TRANSIT");
        ambulance.setCurrentLocation(location);
        ambulance.setPatientOnBoard(true);
        ambulance.setCreatedAt(LocalDateTime.now().toString());
        ambulance.setUpdatedAt(LocalDateTime.now().toString());

        return Arrays.asList(ambulance);
    }

    public void updateLocation(String ambulanceId, LocationUpdateDto locationUpdate) {
        // Mock implementation - replace with actual database update
        System.out.println("Updating location for ambulance: " + ambulanceId);
        System.out.println("New location: " + locationUpdate.getLatitude() + ", " + locationUpdate.getLongitude());
    }
}