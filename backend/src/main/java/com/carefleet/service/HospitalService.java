package com.carefleet.service;

import com.carefleet.dto.AssignmentDto;
import com.carefleet.dto.BedDto;
import com.carefleet.dto.StaffDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class HospitalService {

    public List<BedDto> getBeds(String hospitalId) {
        // Mock data - replace with actual database queries
        return Arrays.asList(
            new BedDto("1", hospitalId, "A101", "ICU", "OCCUPIED", "1", "1", 
                      LocalDateTime.now().toString(), LocalDateTime.now().toString()),
            new BedDto("2", hospitalId, "A102", "GENERAL", "AVAILABLE", null, null,
                      LocalDateTime.now().toString(), LocalDateTime.now().toString()),
            new BedDto("3", hospitalId, "B201", "EMERGENCY", "MAINTENANCE", null, null,
                      LocalDateTime.now().toString(), LocalDateTime.now().toString())
        );
    }

    public List<StaffDto> getStaff(String hospitalId) {
        // Mock data - replace with actual database queries
        return Arrays.asList(
            new StaffDto("1", hospitalId, "EMP001", "Dr. Jane", "Smith", "DOCTOR", 
                        "Emergency", "MORNING", true, "+1234567890", "jane.smith@hospital.com",
                        LocalDateTime.now().toString(), LocalDateTime.now().toString()),
            new StaffDto("2", hospitalId, "EMP002", "Nurse Mary", "Johnson", "NURSE",
                        "ICU", "EVENING", true, "+1234567891", "mary.johnson@hospital.com",
                        LocalDateTime.now().toString(), LocalDateTime.now().toString())
        );
    }

    public List<AssignmentDto> getAssignments() {
        // Mock data - replace with actual database queries
        return Arrays.asList(
            new AssignmentDto("1", "3", "1", "1", "CHECKUP", "Morning checkup and vitals",
                            "MEDIUM", "PENDING", LocalDateTime.now().plusHours(1).toString(),
                            null, null, LocalDateTime.now().toString(), LocalDateTime.now().toString())
        );
    }
}