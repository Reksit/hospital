package com.carefleet.controller;

import com.carefleet.dto.BedDto;
import com.carefleet.dto.StaffDto;
import com.carefleet.dto.AssignmentDto;
import com.carefleet.service.HospitalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospitals")
@Tag(name = "Hospital Management", description = "Hospital resource management APIs")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping("/{hospitalId}/beds")
    @Operation(summary = "Get all beds for a hospital")
    @PreAuthorize("hasRole('HOSPITAL_ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<BedDto>> getBeds(@PathVariable String hospitalId) {
        List<BedDto> beds = hospitalService.getBeds(hospitalId);
        return ResponseEntity.ok(beds);
    }

    @GetMapping("/{hospitalId}/staff")
    @Operation(summary = "Get all staff for a hospital")
    @PreAuthorize("hasRole('HOSPITAL_ADMIN')")
    public ResponseEntity<List<StaffDto>> getStaff(@PathVariable String hospitalId) {
        List<StaffDto> staff = hospitalService.getStaff(hospitalId);
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/assignments")
    @Operation(summary = "Get assignments for current user")
    public ResponseEntity<List<AssignmentDto>> getAssignments() {
        List<AssignmentDto> assignments = hospitalService.getAssignments();
        return ResponseEntity.ok(assignments);
    }
}